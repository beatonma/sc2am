const fs = require('fs');
const path = require('path');

module.exports = {
    'base': fs.readFileSync(path.join(__dirname, './base.html'), 'utf-8'),
}