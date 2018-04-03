const fs = require('fs');
const path = require('path');
const config = require('./config');
const sc2 = require('./bnet').api;
const templates = require('./templates');
const _ = require('./translation').translate;

const ASSETS_DIR = path.join(__dirname, './assets');

const MIMETYPES = {
    'ico': 'image/x-icon',
    'html': 'text/html',
    'js': 'text/javascript',
    'json': 'application/json',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'mp3': 'audio/mpeg',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
};

function serve(request, response) {
    const url = request.url;
    console.log('request: "' + url + '"');

    if (url.startsWith('/static/')) {
        serveStatic(url.replace('/static', ''), response);
    }
    else if (url === '/') {
        serveMainPage(request, response);
    }
    else if (url.startsWith('/api/') && request.method == 'POST') {
        request.url = url.replace(/^\/api/, '');
        serveApi(request, response);
    }
    else if (url === '/debug' && config.debug) {
        serveDebug(request, response);
    }
    else {
        serveUserPage(request, response);
    }
}

function serveApi(request, response) {
    const url = request.url;
    if (url.startsWith('/profile')) {
        serveApiProfile(request, response);
    }
    else {
        console.log('Unknown url: ' + url);
        response.writeHead(404);
        response.end();
    }
}

function serveApiProfile(request, response) {
    const params = request.post;

    sc2.getUserProfile(params)
        .then(profile => {
            console.log('Returning profile');
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(profile));
        })
        .catch(err => {
            console.error('getUserProfile failed: ' + err);
            response.statusCode = 500;
            response.end();
        });
}

function serveMainPage(request, response) {
    serveHtml(response, templates.main.base);
}

/*
 * Display a basic page for the user. Full profile data is loaded
 * asynchronously.
 */
function serveUserPage(request, response) {
    const url = request.url;
    // e.g. /eu/en/2784180/1/fallofmath
    const m = /\/(\w+)\/(\w+)\/(\d+)\/(\d+)\/(.*$)/g.exec(url);
    if (m) {
        const server = m[1];
        const language = m[2];
        const locale = sc2.lookup(server)[language] || config.locale;
        const params = {
            server: server,
            language: language,
            locale: locale,
            user_id: m[3],
            region: m[4],
            username: m[5],
        }
        params['bnet_profile_url'] = sc2.buildProfileUrl(params);
        serveHtml(response, templates.profile.stub(params));
    }
    else {
        response.writeHead(302, {Location: '/'});
        response.end();
    }
}

/*
 * Send a localised HTML response
 */
function serveHtml(response, content, locale) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(_(content, locale));
}

function serveDebug(request, response) {
    const file = './data/debug_profile.json';
    if (fs.existsSync(file)) {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }
            const profile = JSON.parse(data);
            serveHtml(response, templates.profile.build(profile));
        });
    }
    else {
        console.log('Debug profile file is unavailable');
    }
}

function serveStatic(url, response) {
    const filepath = path.join(ASSETS_DIR, url);
    fs.stat(filepath, (err, stats) => {
        if (err) {
            response.statusCode = 404;
            response.end('file ' + filepath + ' not found: ');
            console.log('file \'' + url + '\' not found', url);
        }
        else {
            if (stats.isFile()) {
                fs.readFile(filepath, (err, data) => {
                    const m = /\.(\w+)$/.exec(filepath);
                    if (m) {
                        const ext = m[1];
                        response.setHeader('Content-type', MIMETYPES[ext] || 'text/plain');
                    }
                    else {
                        response.setHeader('Content-type', 'text/plain');
                    }
                    response.statusCode = 200;
                    response.end(data);
                });
            }
            else {
                response.statusCode = 404;
                response.end('file ' + filepath + ' not found');
                console.log('file ' + filepath + ' not found');
            }
        }
    });
}

module.exports = {
    serve: serve,
}