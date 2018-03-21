const http = require('http');
const querystring = require('querystring');
const port = require('../config').port;
const fs = require('fs');
const path = require('path');
const app = require('./server.js');
const i18n = require('i18n');

const locales = [
    // EU
    'de_DE',
    'en_GB',
    'es_ES',
    'fr_FR',
    'it_IT',
    'pl_PL',
    'pt_PT',
    'ru_RU',

    // US/SEA
    'en_US',
    'es_MX',
    'pt_BR',

    // Korea
    'ko_KR',

    // Taiwan
    'zh_TW'
];

i18n.configure({
    locales: locales,
    directory: __dirname + '/locales',
    defaultLocale: 'en_GB',
    extension: '.json',
});

initCacheDirs();

const server = http.createServer((request, response) => {
    i18n.init(request, response);
    let data = '';
    request.on('error', err => {

    }).on('data', chunk => {
        data += chunk;
        if (data.length > 1e6) {
            data = ''
            response.writeHead(413, {'Content-Type': 'text/plain'});
            response.end();
            request.connection.destroy();
        }
    }).on('end', () => {
        response.on('error', err => {
            error(err);
        });
        request.post = querystring.parse(data);
        app.serve(request, response);
    })
}).listen(port);


/*
 * Initiate cache directory structure
 */
function initCacheDirs() {
    try {
        fs.mkdirSync('./data');
    }
    catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
    for (let i = 0; i < locales.length; i++) {
        try {
            fs.mkdirSync(path.join('./data', locales[i]));
        }
        catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
    }
}