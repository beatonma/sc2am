const fs = require('fs');
const path = require('path');
const request = require('request');
const config = require('../config');

const DEBUG_LOCALE = 'eu';

function getCacheDir(locale) {
    return path.join('./data/', locale + '/');
}

function getCacheFile(locale, filename) {
    return path.join(getCacheDir(locale), filename);
}

function getTokenCacheFile(locale) {
    return getCacheFile(locale, 'token')
}

function getAccessToken(callback) {
    return readCachedAccessToken()
        .catch((err) => updateAccessToken())
        .then((token) => {
            callback(token);
        });
}

function readCachedAccessToken() {
    return new Promise((resolve, reject) => {
        fs.readFile(getTokenCacheFile(DEBUG_LOCALE), 'utf-8', (err, data) => {
            if (err) {
                console.log('Unable to read cached access token');
                reject(err);
            }
            else {
                console.log('Access token read from cache');
                const json = JSON.parse(data);
                resolve(json.access_token);
            }
        }
    });
}

function updateAccessToken() {
    return new Promise((resolve, reject) => {
        const user = new Buffer(config.client_id + ':' + config.client_secret).toString('base64');
        request.post({
            url: 'https://eu.battle.net/oauth/token',
            headers: {
                'Authorization': 'Basic ' + user,
                'Content-Type': 'multipart/form-data'
            },
            formData: {
                'grant_type': 'client_credentials'
            }
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }
            else {
                fs.writeFile(
                    getTokenCacheFile(DEBUG_LOCALE),
                    JSON.stringify(data), err => {
                        if (err) reject(err);
                        else resolve(data.access_token);
                    });
            }
        });
    });
}

module.exports = {
    getAccessToken: getAccessToken,
}