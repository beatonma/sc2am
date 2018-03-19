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
        callback(JSON.parse(body));
    })
}

function getAchievementDefinitions(callback) {
    const url = ACHIEVEMENTS_URL.formatUnicorn(config);
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

module.exports = {
    lookup: code => {
        return code in CODES ? CODES[code] : code;
    },
    getAchievementDefinitions: getAchievementDefinitions,
    getUserProfile: getUserProfile,
    parseProfileUrl: parseProfileUrl,
}
