const http = require('http');       // HTTP actions
const fs = require('fs');           // Filesystem actions
const path = require('path');       // Path actions
const request = require('request');
// const winston = require('winston'); // Logging

// API constants
const ACHIEVEMENTS_URL = 'https://{server}.api.battle.net/sc2/data/achievements?locale={locale}&apikey={api_key}';
const PROFILE_URL = 'https://{server}.api.battle.net/sc2/profile/{user_id}/{region}/{username}/?locale={locale}&apikey={api_key}';

// Local server constants
const CONFIG = require('./config.json');
const PROFILE_CACHE = './profile.json';
const ACHIEVEMENTS_CACHE = './achievements.json';

const PORT = 9876;
const BASE_URL = 'http://localhost:' + PORT;
const DATA_DIR = './data/';
const ASSETS_DIR = './assets';
const ASSETS = [
    '/favicon.ico'
];

const TEMPLATES = {
    'base': fs.readFileSync('./templates/base.html', 'utf-8'),
    'head': fs.readFileSync('./templates/head.html', 'utf-8'),
    'header': fs.readFileSync('./templates/header.html', 'utf-8'),
    'header_points': fs.readFileSync('./templates/header_points.html', 'utf-8'),
    'achievement': fs.readFileSync('./templates/achievement.html', 'utf-8'),
};


String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function() {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

let ACHIEVEMENTS = {};

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

const server = http.createServer((request, response) => {
    request.on('error', err => {

    }).on('data', chunk => {

    }).on('end', () => {
        response.on('error', err => {
            error(err);
        });
        serve(request, response);
    })
}).listen(PORT);

function serve(request, response) {
    const url = request.url;
    console.log('request: "' + url + '"');
    if (ASSETS.indexOf(url) >=  0) {
        serveStatic(url, response);
    }
    else {
        serveMainPage(request, response);
    }
}

function serveMainPage(request, response) {
    getUserProfile(profile => {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(buildUserPage(profile));
    });
}

function buildUserPage(profile) {
    updateAchievementStatus(profile);
    const htmlHead = TEMPLATES.head;
    const htmlHeader = buildHtmlHeader(profile.achievements.points);
    const htmlAchievements = buildHtmlAchievements();

    return TEMPLATES.base.formatUnicorn({
        head: htmlHead,
        header: htmlHeader,
        achievements: htmlAchievements,
    }).formatUnicorn({
        username: profile.displayName
    });
}

function buildHtmlHeader(achievement_points) {
    const template = TEMPLATES.header_points;
    const categoryPoints = achievement_points.categoryPoints;
    let html = '';
    for (let id in categoryPoints) {
        html += template.formatUnicorn({
            category: id,
            points: categoryPoints[id],
        });
    }

    return TEMPLATES.header.formatUnicorn({
        total: achievement_points.totalPoints,
        points: html
    });
}

function buildHtmlAchievements() {
    const template = TEMPLATES.achievement;

    let html = '';
    for (let a in ACHIEVEMENTS) {
        let ach = ACHIEVEMENTS[a];
        html += template.formatUnicorn({
            title: ach.title,
            description: ach.description,
            completed: 'completionDate' in ach ? new Date(ach.completionDate) : 'NOT COMPLETED',
        });
    }
    return html;
}

/*
 * Add completion dates to ACHIEVEMENTS
 */
function updateAchievementStatus(profile) {
    const completed = profile.achievements.achievements;
    const len = completed.length;
    for (let i = 0; i < len; i++) {
        const c = completed[i];
        ACHIEVEMENTS['' + c.achievementId].completionDate = c.completionDate * 1000;
    }
}

function getUserProfile(callback) {
    if (fs.existsSync(PROFILE_CACHE)) {
        fs.readFile(PROFILE_CACHE, 'utf-8', (err, data) => {
            const j = JSON.parse(data);
            const cacheAge = Date.now() - j.updated;
            const refreshRate = CONFIG.refresh_rate / 1000;
            if (cacheAge > refreshRate) {
                console.log('Cache is old (' + cacheAge + ' > ' + refreshRate + ') - refreshing data...');
                getRemoteUserProfile(callback);
            }
            else {
                console.log('Using cached profile data');
                j.cached = true;
                callback(j);
            }
        });
    }
    else {
        getRemoteUserProfile(callback);
    }
}

function getRemoteUserProfile(callback) {
    const url = PROFILE_URL.formatUnicorn(CONFIG);
    console.log('Loading profile data: ' + url);
    request.get(url, (err, response, body) => {
        body.updated = Date.now();

        fs.writeFile(PROFILE_CACHE, body, err => {
            if (err) throw err;
            console.log('Profile saved to cache!');
        });

        body.cached = false;

        callback(body);
    })
}

function loadAchievements(callback) {
    if (fs.existsSync(ACHIEVEMENTS_CACHE)) {
        fs.readFile(ACHIEVEMENTS_CACHE, 'utf-8', (err, data) => {
            const j = JSON.parse(data);
            console.log('Achievement definitions loaded from cache.');
            callback(j);
        })
    }
    else {
        updateAchievements(callback);
    }
}

function updateAchievements(callback) {
    const url = ACHIEVEMENTS_URL.formatUnicorn(CONFIG);
    console.log(url);
    request.get(url, (err, response, body) => {
        const j = JSON.parse(body);
        // Build a dictionary using the achievement id as key
        let output = {}
        const as = j.achievements;
        for (let i = 0; i < as.length; i++) {
            const a = as[i];
            output[a.achievementId] = a;
        }

        fs.writeFile(ACHIEVEMENTS_CACHE, JSON.stringify(output), err => {
            if (err) throw err;
            console.log('Achievement definitions cache updated');
        })

        console.log('Achievement defintions loaded from network.');
        callback(output);
    });
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

loadAchievements((content) => {
    ACHIEVEMENTS = content;
    console.log('Server ready.');
});