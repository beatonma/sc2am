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

function buildProfile(profile) {
    const htmlHead = buildHtmlHead(profile);
    const htmlHeader = buildHtmlHeader(profile.achievements.points);
    const htmlAchievements = buildHtmlAchievements(profile.achievements.achievements);

    return getTemplate('base.html').formatUnicorn({
        head: htmlHead,
        header: htmlHeader,
        achievements: htmlAchievements,
    }).formatUnicorn({
        username: profile.displayName
    });
}

function buildHtmlHead(profile) {
    return getTemplate('head.html').formatUnicorn({
        achievements: JSON.stringify(profile.achievements.achievements),
    });
}

function buildHtmlHeader(points) {
    const template = getTemplate('header_points.html');
    const categoryPoints = points.categoryPoints;
    let html = '';
    for (let id in categoryPoints) {
        html += template.formatUnicorn({
            category: lookup(id),
            points: categoryPoints[id],
        })
    }
    return getTemplate('header.html').formatUnicorn({
        total: points.totalPoints,
        points: html,
    });
}

function buildHtmlAchievements(achievements) {
    const template = getTemplate('achievement.html');

    let html = '';
    for (let a in achievements) {
        html += template;
    //     const ach = achievements[a];
    }
    return html;
}

module.exports = {
    // base: base,
    // head: head,
    // header
    // 'base': fs.readFileSync(path.join(__dirname, './base.html'), 'utf-8'),
    // 'head': fs.readFileSync(path.join(__dirname, './head.html'), 'utf-8'),
    // 'header': fs.readFileSync(path.join(__dirname, './header.html'), 'utf-8'),
    // 'header_points': fs.readFileSync(path.join(__dirname, './header_points.html'), 'utf-8'),
    // 'achievement': fs.readFileSync(path.join(__dirname, './achievement.html'), 'utf-8'),
    'build': buildProfile,
}