const fs = require('fs');
const path = require('path');       // Path actions
const config = require('../config');
const sc2 = require('./bnet').api;
const templates = require('./templates');

const ASSETS_DIR = path.join(__dirname, './assets');
const ASSETS = [
    '/css/base.css',
    '/css/achievements.css',
    '/js/bnet-parse.js',
    '/favicon.ico'
];

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

    if (ASSETS.indexOf(url) >=  0) {
        serveStatic(url, response);
    }
    else if (url === '/') {
        serveMainPage(request, response);
    }
    else if (url === '/debug' && config.debug) {
        serveDebug(request, response);
    }
    else {
        serveUserPage(request, response);
    }
}

function serveMainPage(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(templates.main.base);

}

function serveUserPage(request, response) {
    const url = request.url;
    // e.g. /eu/en/2784180/1/fallofmath
    const m = /\/(\w+)\/(\w+)\/(\d+)\/(\d+)\/(.*$)/g.exec(url);
    if (m) {
        const params = {
            server: m[1],
            locale: config.locale,
            user_id: m[3],
            region: m[4],
            username: m[5]
        }
        sc2.getUserProfile(params, profile => {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(templates.profile.build(profile));
        });
    }
    else {
        response.writeHead(302, {Location: '/'});
        response.end();
    }
}

function serveDebug(request, response) {
    const file = './data/debug_profile.json';
    if (fs.existsSync(file)) {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }
            const profile = JSON.parse(data);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(templates.profile.build(profile));
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

// function getUserProfile(callback) {
//     if (config.debug && fs.existsSync(PROFILE_CACHE)) {
//         fs.readFile(PROFILE_CACHE, 'utf-8', (err, data) => {
//             const j = JSON.parse(data);
//             const cacheAge = Date.now() - j.updated;
//             const refreshRate = CONFIG.refresh_rate / 1000;
//             if (cacheAge > refreshRate) {
//                 console.log('Cache is old (' + cacheAge + ' > ' + refreshRate + ') - refreshing data...');
//                 getRemoteUserProfile(callback);
//             }
//             else {
//                 console.log('Using cached profile data');
//                 j.cached = true;
//                 callback(j);
//             }
//         });
//     }
//     else {
//         sc2.getUserProfile(callback);
//     }
// }

// function getAchievements(callback) {
//     if (fs.existsSync(ACHIEVEMENTS_CACHE)) {
//         fs.readFile(ACHIEVEMENTS_CACHE, 'utf-8', (err, data) => {
//             const j = JSON.parse(data);
//             console.log('Achievement definitions loaded from cache.');
//             callback(j);
//         })
//     }
//     else {
//         sc2.getAchievementDefinitions(callback);
//     }
// }

module.exports = {
    serve: serve,
}