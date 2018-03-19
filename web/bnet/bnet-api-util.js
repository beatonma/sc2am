const fs = require('fs');
const path = require('path');
const config = require('../../config');
const request = require('request');

// API endpoints
const ACHIEVEMENTS_URL = 'https://{server}.api.battle.net/sc2/data/achievements?locale={locale}&apikey={api_key}';
const PROFILE_URL = 'https://{server}.api.battle.net/sc2/profile/{user_id}/{region}/{username}/?locale={locale}&apikey={api_key}';

const CODES = {
    // Achievement categories
    '4325379': 'Liberty Campaign',
    '4325410': 'Swarm Campaign',
    '4330138': 'Void Campaign',
    '4364473': 'Mission Packs',
    '4386911': 'Co-op Missions',
    '4325377': 'Versus',

    // Server locales
    'eu': {
        'de': 'de_DE',
        'en': 'en_GB',
        'es': 'es_ES',
        'fr': 'fr_FR',
        'it': 'it_IT',
        'pl': 'pl_PL',
        'pt': 'pt_PT',
        'ru': 'ru_RU',
    },
    'us': {
        'en': 'en_US',
        'es': 'es_MX',
        'pt': 'pt_BR',
    },
    'sea': {
        'en': 'en_US',
    },
    'kr': {
        'ko': 'ko_KR',
    },
    'tw': {
        'zh': 'zh_TW',
    }
}

function parseProfileUrl(url) {
    // e.g. http://eu.battle.net/sc2/en/profile/2784180/1/fallofmath/
    const regex = /.*?(\w+)\.battle\.net\/?sc2\/(\w+)\/profile\/(\d+)\/(\d+)\/(.*?)\//g;
    const m = regex.exec(url);
    return {
        username: m[5],
        id: m[3],
        region: m[4],
        language: m[2],
        server: m[1],
    }
}

function getUserProfile(params, callback) {
    // TODO merge user completed achievements with achievement definitions
    params.api_key = config.api_key;
    const url = PROFILE_URL.formatUnicorn(params);
    console.log('Loading profile data: ' + url);
    request.get(url, (err, response, body) => {
        completeAchievementData(params, JSON.parse(body), callback);
        // callback(JSON.parse(body));
    });
}

function completeAchievementData(params, profile, callback) {
    getAchievementDefinitions(params.server, params.locale, achievements => {
        const completed = profile.achievements.achievements;
        const len = completed.length;
        for (let i = 0; i < len; i++) {
            const c = completed[i];
            achievements['' + c.achievementId].completionDate = c.completionDate * 1000;
        }
        profile.achievements.achievements = achievements;
        callback(profile);
    });
}

// function getAchievementDefinitions(callback) {
//     const url = ACHIEVEMENTS_URL.formatUnicorn(config);
//     request.get(url, (err, response, body) => {
//         const j = JSON.parse(body);
//         // Build a dictionary using the achievement id as key
//         let output = {}
//         const as = j.achievements;
//         for (let i = 0; i < as.length; i++) {
//             const a = as[i];
//             output[a.achievementId] = a;
//         }

//         fs.writeFile(ACHIEVEMENTS_CACHE, JSON.stringify(output), err => {
//             if (err) throw err;
//             console.log('Achievement definitions cache updated');
//         })

//         console.log('Achievement defintions loaded from network.');
//         callback(output);
//     });
// }

function getCacheFile(locale) {
    return path.join('./data/', locale + '/', 'achievements.json');
}

function getAchievementDefinitions(server, locale, callback) {
    const cache = getCacheFile(locale);
    fs.readFile(cache, 'utf-8', (err, data) => {
        if (err) {
            console.log('Cannot read cached definitions - will update from battle.net');
            updateAchievementDefinitions(server, locale, callback);
            return;
        }

        const j = JSON.parse(data);
        const now = Date.now();
        if (j.updated - now > config.cache_refresh_rate * 1000) {
            // Update from battle.net if cached data is old
            console.log('Cached achievement definitions are out of date.');
            updateAchievementDefinitions(server, locale, callback);
        }
        else {
            console.log('Using cached achievement definitions');
            callback(j)
        }
    });
}

function updateAchievementDefinitions(server, locale, callback) {
    const url = ACHIEVEMENTS_URL.formatUnicorn({
        api_key: config.api_key,
        locale: locale,
        server: server,
    });
    console.log('Updating achievement definitions: ' + url);
    request.get(url, (err, response, body) => {
        const j = JSON.parse(body);

        // Build a dictionary using the achievement id as key
        let output = {};
        const achievements = j.achievements;
        for (let i = 0; i < achievements.length; i++) {
            const a = achievements[i];
            delete a.icon;
            output[a.achievementId] = a;
        }

        fs.writeFile(getCacheFile(locale), JSON.stringify(output), err => {
            if (err) {
                console.log('Error caching achievement data: ' + err);
            }
        });
        console.log('Achievement definitions for locale=' + locale + ' updated from battle.net');
        callback(output);
    })
}

module.exports = {
    lookup: code => {
        return code in CODES ? CODES[code] : code;
    },
    // getAchievementDefinitions: getAchievementDefinitions,
    getUserProfile: getUserProfile,
    parseProfileUrl: parseProfileUrl,
}
