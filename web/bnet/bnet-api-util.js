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

            // Look up achievement codes and get the definition
            len = categories.length;
            for (let i = 0; i < len; i++) {
                const c = categories[i];
                if (c.achievements) {
                    const achs = c.achievements;
                    const achCount = achs.length;
                    for (let j = 0; j < achCount; j++) {
                        const k = achs[j];
                        if (k in achievements) {
                            achs[j] = achievements[k];
                        }
                    }
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
 * Update definitions cache from battle.net
 */
function updateAchievementDefinitions(server, locale, callback) {
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

        return Promise.all(a, c);
    })
}

/**
 * Add 
 * @param  {object} data Data returned from API call to ACHIEVEMENTS_URL
 * @return {object}      Categorised achievements list
 */
function buildCategories(data) {
    console.log('buildCategories');
    return new Promise((resolve, reject) => {
        const achievements = data.achievements;
        const categories = data.categories;

        // Build a category dictionary of achievements
        // {'categoryId': [achievementIds]}
        const categorizedAchievements = {}
        const lenA = achievements.length;
        for (let i = 0; i < lenA; i++) {
            const a = achievements[i];
            const catID = a.categoryId;
            if (catID in categorizedAchievements) {
                categorizedAchievements[catID].push(a.achievementId);
            }
            else {
                categorizedAchievements[catID] = [a.achievementId];
            }
        }

        // Flatten categories list, moving any nested objects to the
        // top-level list
        const lenC = categories.length;
        for (let i = 0; i < lenC; i++) {
            const c = categories[i];
            const id = c.categoryId;

            if (c.children) {
                const children = c.children;
                const childCount = children.length;

                for (let j = 0; j < childCount; j++) {
                    const ch = children[j];
                    // Store id of parent so we can reconstruct later
                    ch.parent = id;
                    categories.push(ch);
                }
            }
            delete c.children;
        }

        // Assign achievements to their category
        const lenCFlat = categories.length;
        for (let i = 0; i < lenCFlat; i++) {
            const c = categories[i];
            const id = c.categoryId;
            if (id in categorizedAchievements) {
                c.achievements = categorizedAchievements[id];
            }
        }

        resolve(categories);
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
            delete a.achievementId;
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
    // module.exports['buildDefinitions'] = buildDefinitions;
    module.exports['getAchievementDefinitions'] = getAchievementDefinitions;
}