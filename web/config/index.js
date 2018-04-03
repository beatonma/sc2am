// module.exports = require('./config.json');
const fs = require('fs');
const path = require('path');

try {
    const conf = fs.readFileSync(
        path.join(__dirname, './config.json'),
        'utf-8');
    Object.assign(module.exports, JSON.parse(conf));
}
catch (err) {
    Object.assign(module.exports, {
        api_key: process.env.BATTLENET_KEY,
        cache_refresh_rate: process.env.CACHE_REFRESH_RATE || 86400,
        debug: process.env.DEBUG || false,
        port: process.env.PORT || 9876,
    });
}