const fs = require('fs');
const path = require('path');
const config = require('../config');
const request = require('request');
const i18n = require('i18n');
const achievementUtil = require('./achievement-util.js');

const LOCALE_CODES = {
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

/*
 * These profile sections will be removed before sending to client
 */
const IGNORED_PROFILE_DATA = [
    'portrait',
    'career',
    'swarmLevels',
    'campaign',
    'season',
    'rewards',
];

function getProfileApiUrl(params) {
    let server, user_id, region, username, locale, api_key;
    ({server, user_id, region, username, locale, api_key} = params);
    return `https://${server}.api.battle.net/sc2/profile/${user_id}/${region}/${username}/?locale=${locale}&apikey=${api_key}`;
}

function getAchievementsApiUrl(params) {
    let server, locale, api_key;
    ({server, locale, api_key} = params);
    return `https://${server}.api.battle.net/sc2/data/achievements?locale=${locale}&apikey=${api_key}`;
}

function parseProfileUrl(url) {
    // e.g. http://eu.battle.net/sc2/en/profile/2784180/1/fallofmath/
    const regex = /.*?(\w+)\.battle\.net\/?sc2\/(\w+)\/profile\/(\d+)\/(\d+)\/(.*?)\//g;
    const m = regex.exec(url);
    return {
        username: m[5],
        user_id: m[3],
        region: m[4],
        language: m[2],
        server: m[1],
    }
}

function buildProfileUrl(params) {
    let server, language, user_id, region, username;
    ({server, language, user_id, region, username} = params);

    return `http://${server}.battle.net/sc2/${language}/profile/${user_id}/${region}/${username}/`;
}

function getUserProfile(params) {
    console.log(params);
    return new Promise((resolve, reject) => {
        i18n.setLocale(params.locale);
        params.api_key = config.api_key;
        const url = getProfileApiUrl(params);
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
    for (let i = 0; i < IGNORED_PROFILE_DATA.length; i++) {
        delete profile[IGNORED_PROFILE_DATA[i]];
    }

    return getAchievementDefinitions(params.server, params.locale)
        .then(results => {
            const achievements = results[0];
            const categories = results[1];

            const completed = profile.achievements.achievements;

            // Find any 'override' achievements and add them to the
            // completed list
            addCategoryIds(completed, achievements);
            achievementUtil.addOverrides(completed);

            let len = completed.length;
            // Remove any achievements that have already been completed
            for (let i = 0; i < len; i++) {
                const c = completed[i];
                delete achievements[c.achievementId];
            }

            achievementUtil.removeDeprecated(achievements);

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

                c.achievements = achValues;
            }
            profile.achievements.achievements = categories;

            // Add names to points category IDs
            const pointsCategories = profile.achievements.points.categoryPoints;
            for (let k in pointsCategories) {
                const points = pointsCategories[k];
                const title = categories[k].title;
                pointsCategories[k] = {title: title, points: points};
            }

            return profile;
        });
}

/*
 * Take a list of completed achievements as returned by the profile API
 * i.e. each object has 'achievementId' and 'completionDate'
 * Add categoryId to these objects
 */
function addCategoryIds(achievements, achievementDefs) {
    const len = achievements.length;
    for (let i = 0; i < len; i++) {
        const a = achievements[i];
        a.categoryId = achievementDefs[a.achievementId].categoryId;
    }
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
function getAchievementDefinitions(server, locale) {
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
    return new Promise((resolve, reject) => {
        fs.readFile(getCacheFile(locale, 'categories.json'), 'utf-8', (err, data) => {
            if (err) {
                console.log('cannot read categories for ' + locale);
                reject(err);
            }
            else {
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
function updateAchievementDefinitions(server, locale) {
    return new Promise((resolve, reject) => {
        const url = getAchievementsApiUrl({
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

            if (c.children) {
                const children = c.children;
                const childCount = children.length;

                for (let j = 0; j < childCount; j++) {
                    const ch = children[j];
                    ch.parent = catID;
                    const chCatID = ch.categoryId;
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

        // Remove any categories we are not interested in
        const lenIgnore = achievementUtil.IGNORED_ACHIEVEMENT_CATEGORIES.length;
        for (let i = 0; i < lenIgnore; i++) {
            const ig = achievementUtil.IGNORED_ACHIEVEMENT_CATEGORIES[i];
            if (ig in catDictionary) {
                console.log('Removing category ' + ig);
                delete catDictionary[ig];
            }
        }

        resolve(catDictionary);
    });
}

/**
 * @returns {Promise} Promise representing achievements suitable for caching
 */
function buildAchievements(achievements) {
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
    lookup: code => {
        return code in LOCALE_CODES ? LOCALE_CODES[code] : code;
    },
    getUserProfile: getUserProfile,
    parseProfileUrl: parseProfileUrl,
    buildProfileUrl: buildProfileUrl,
}

if (config.debug) {
    Object.assign(module.exports, {
        buildAchievements: buildAchievements,
        buildCategories: buildCategories,
        getAchievementDefinitions: getAchievementDefinitions,
        addCategoryIds: addCategoryIds,
        getProfileApiUrl: getProfileApiUrl,
        getAchievementsApiUrl: getAchievementsApiUrl,
    });
}