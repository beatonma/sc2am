const fs = require('fs');
const path = require('path');
const config = require('../../config');
const request = require('request');
const i18n = require('i18n');

// API endpoints
const ACHIEVEMENTS_URL = 'https://{server}.api.battle.net/sc2/data/achievements?locale={locale}&apikey={api_key}';
const PROFILE_URL = 'https://{server}.api.battle.net/sc2/profile/{user_id}/{region}/{username}/?locale={locale}&apikey={api_key}';

const CODES = {
    // // Achievement categories - top level
    // '4325379': 'Liberty Campaign',
    // '4325410': 'Swarm Campaign',
    // '4330138': 'Void Campaign',
    // '4364473': 'Mission Packs',
    // '4386911': 'Co-op Missions',
    // '4325377': 'Versus',

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

// Old achievements that are no longer available
// TODO remove these while caching achievements
const DEPRECATED_ACHIEVEMENTS = [
    // Free-for-all
    '91475320766623',
    '91475320766624',
    '91475320766625',
    '91475320766626',
    '91475320766627',
    '91475320766628',
    '91475320766629',
    '91475320766630',
    '91475320766632',
    '91475035553850',
];

const ACHIEVEMENT_GROUPING = {

};

/*
 * These profile sections will be removed before sending to client
 */
const UNUSED_PROFILE_DATA = [
    'portrait',
    'career',
    'swarmLevels',
    'campaign',
    'season',
    'rewards',
];

function lookup(code) {
    return code in CODES ? CODES[code] : code;
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

function getUserProfile(params) {
    return new Promise((resolve, reject) => {
        i18n.setLocale(params.locale);
        params.api_key = config.api_key;
        const url = PROFILE_URL.formatUnicorn(params);
        console.log('Loading profile data: ' + url);
        request.get(url, (err, response, body) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(cleanProfileData(params, JSON.parse(body)));
            }
        });
    });
    
}

/*
 * Remove any data that is not required:
 *  - Any achievements that have already been unlocked
 *  - Unnecessary profile data
 *  - Multiplayer career data
 *
 * Also replace numeric IDs with proper names, where possible
 */
function cleanProfileData(params, profile) {
    console.log('cleanProfileData()');
    for (let i = 0; i < UNUSED_PROFILE_DATA.length; i++) {
        delete profile[UNUSED_PROFILE_DATA[i]];
    }

    // const pointsCategories = profile.achievements.points.categoryPoints;
    // for (let k in pointsCategories) {
    //     // Replace category IDs with names
    //     pointsCategories[i18n.__(lookup(k))] = pointsCategories[k];
    //     delete pointsCategories[k];
    // }

    return getAchievementDefinitions(params.server, params.locale)
        .then(results => {
            console.log('processing achievements');
            const achievements = results[0];
            const categories = results[1];

            const completed = profile.achievements.achievements;
            let len = completed.length;

            // Remove any achievements that have already been completed
            for (let i = 0; i < len; i++) {
                const c = completed[i];
                delete achievements[c.achievementId];
            }

            // Replace achievement ID list with the full achievement objects
            for (let k in categories) {
                const achValues = [];
                const c = categories[k];
                const achs = c.achievements;
                const achsCount = achs.length;
                for (let i = 0; i < achsCount; i++) {
                    const id = achs[i];
                    if (id in achievements) {
                        achValues.push(achievements[id]);
                    }
                }

                if (achValues.length == 0) {
                    // All achievements in this category have been completed
                    delete categories[k];
                }
                else {
                    c.achievements = achValues;
                }

            }
            profile.achievements.achievements = categories;

            console.log('returning profile');
            return profile;
        })
        .catch(err => {
            console.error('getAchievementDefinitions failed: ' + err);
            return {};
        });
}

function getCacheDir(locale) {
    return path.join('./data/', locale + '/');
}

function getCacheFile(locale, filename) {
    return path.join(getCacheDir(locale), filename);
}

/*
 * Try to load cached definitions, or update from battle.net
 */
function getAchievementDefinitions(server, locale, callback) {
    console.log('getAchievementDefinitions');
    return Promise.all([readAchievements(locale), readCategories(locale)])
        .catch(err => {
            console.log('calling updateAchievementDefinitions: ' + err);
            return updateAchievementDefinitions(server, locale);
        });
}

/*
 * Read the cached achievements file for this locale
 */
function readAchievements(locale) {
    console.log('readAchievements');
    return new Promise((resolve, reject) => {
        fs.readFile(getCacheFile(locale, 'achievements.json'), 'utf-8', (err, data) => {
            if (err) {
                console.log('cannot read achievements for ' + locale);
                reject(err);
            }
            else {
                console.log('readAchievements completed');
                const j = JSON.parse(data);
                const now = Date.now();
                if (j.updated - now > config.cache_refresh_rate * 1000) {
                    reject(Error(locale + '/achievements.json cache file is out of date'));
                }
                resolve(j);
            }
        });
    });
}

/*
 * Read the cached categories file for this locale
 */
function readCategories(locale) {
    console.log('readCategories');
    return new Promise((resolve, reject) => {
        fs.readFile(getCacheFile(locale, 'categories.json'), 'utf-8', (err, data) => {
            if (err) {
                console.log('cannot read categories for ' + locale);
                reject(err);
            }
            else {
                console.log('readCategories completed');
                const j = JSON.parse(data);
                const now = Date.now();
                if (j.updated - now > config.cache_refresh_rate * 1000) {
                    reject(Error(locale + '/categories.json cache file is out of date'));
                }
                resolve(j);
            }
        });
    });
}

/*
 * Update definitions cache from battle.net API
 */
function updateAchievementDefinitions(server, locale, callback) {
    return new Promise((resolve, reject) => {
        const url = ACHIEVEMENTS_URL.formatUnicorn({
            api_key: config.api_key,
            locale: locale,
            server: server,
        });
        console.log('Updating achievement definitions: ' + url);
        request.get(url, (err, response, body) => {
            const j = JSON.parse(body);

            const a = buildAchievements(j.achievements)
                .then(data => {
                    return new Promise((resolve, reject) => {
                        fs.writeFile(
                            getCacheFile(locale, 'achievements.json'),
                            JSON.stringify(data), err => {
                                if (err) reject(err);
                                else resolve(data)
                        });
                    });
                });

            const c = buildCategories(j)
                .then(data => {
                    return new Promise((resolve, reject) => {
                        fs.writeFile(
                            getCacheFile(locale, 'categories.json'),
                            JSON.stringify(data), err => {
                                if (err) reject(err);
                                else resolve(data);
                        });
                    })
                });

            resolve(Promise.all([a, c]));
        });
    });
}

/**
 * Constructs a dictionary of categories using the categoryId as the key.
 * Each category entry holds a list of achievementIds for that category,
 * and the total number of points available for completing those achievements.
 * 
 * @param  {object} data Data returned from API call to ACHIEVEMENTS_URL
 * @return {Promise}      Categorised achievements list
 */
function buildCategories(data) {
    console.log('buildCategories');
    return new Promise((resolve, reject) => {
        const achievements = data.achievements;
        const categories = data.categories;

        // Flatten categories list and convert to dictionary using categoryId
        // as the key
        const lenC = categories.length;
        const catDictionary = {};
        for (let i = 0; i < lenC; i++) {
            const c = categories[i];
            const catID = c.categoryId;
            delete c.categoryId;

            if (c.children) {
                const children = c.children;
                const childCount = children.length;

                for (let j = 0; j < childCount; j++) {
                    const ch = children[j];
                    ch.parent = catID;
                    const chCatID = ch.categoryId;
                    delete ch.categoryId;
                    ch.achievements = [];
                    ch.points = 0;

                    catDictionary[chCatID] = ch;
                }
            }
            delete c.children;

            c.achievements = [];
            c.points = 0;
            catDictionary[catID] = c;
        }

        // Assign achievement IDs to their category
        const lenA = achievements.length;
        for (let i = 0; i < lenA; i++) {
            const a = achievements[i];
            const catID = a.categoryId;
            try {
                catDictionary[catID].achievements.push(a.achievementId);
                catDictionary[catID].points += a.points;
            }
            catch (e) {
                console.error('Unable to assign achievement ' + a.achievementId + ' to category ' + catID);
            }
        }

        resolve(catDictionary);
    });
}

/**
 * @returns {Promise} Promise representing achievements suitable for caching
 */
function buildAchievements(achievements) {
    console.log('buildAchievements');
    return new Promise((resolve, reject) => {
        const output = {};
        const len = achievements.length;

        for (let i = 0; i < len; i++) {
            const a = achievements[i];
            const aid = a.achievementId;
            delete a.icon;
            output[aid] = a;
        }

        resolve(output);
    });
}


module.exports = {
    lookup: lookup,
    getUserProfile: getUserProfile,
    parseProfileUrl: parseProfileUrl,
}

if (config.debug) {
    module.exports['buildAchievements'] = buildAchievements;
    module.exports['buildCategories'] = buildCategories;
    module.exports['getAchievementDefinitions'] = getAchievementDefinitions;
}