const i18n = require('i18n');

function translate(text, locale) {
    i18n.setLocale(locale || 'en_GB');
    console.log('Translating with locale=' + i18n.getLocale());
    const r = /_\((.*?)\)/g;
    let m;
    while (m = r.exec(text)) {
        text = text.replace(m[0], i18n.__(m[1]));
    }
    return text;
}

module.exports = {
    translate: translate,
}