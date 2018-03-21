const fs = require('fs');
const path = require('path');

const lookup = require('../../bnet').api.lookup;

const base = fs.readFileSync(path.join(__dirname, './base.html'), 'utf-8');
const head = fs.readFileSync(path.join(__dirname, './head.html'), 'utf-8');
const header = fs.readFileSync(path.join(__dirname, './header.html'), 'utf-8');
const header_points = fs.readFileSync(path.join(__dirname, './header_points.html'), 'utf-8');
const achievement = fs.readFileSync(path.join(__dirname, './achievement.html'), 'utf-8');

function getTemplate(name) {
    return fs.readFileSync(path.join(__dirname, name), 'utf-8');
}

function buildProfileStub(user) {
    return getTemplate('base.html').formatUnicorn(user);
}

module.exports = {
    'stub': buildProfileStub,
}