const fs = require('fs');
const path = require('path');

// const lookup = require('../../bnet').api.lookup;

const base = fs.readFileSync(path.join(__dirname, './base.html'), 'utf-8');

function getTemplate(name) {
    return fs.readFileSync(path.join(__dirname, name), 'utf-8');
}

function buildProfileStub(user) {
    return getTemplate('base.html').formatUnicorn(user);
}

module.exports = {
    'stub': buildProfileStub,
}