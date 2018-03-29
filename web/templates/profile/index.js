const fs = require('fs');
const path = require('path');

const base = fs.readFileSync(path.join(__dirname, './base.html'), 'utf-8');

function getTemplate(name) {
    return fs.readFileSync(path.join(__dirname, name), 'utf-8');
}

function buildProfileStub(user) {
    return format(getTemplate('base.html'), user);
}

function format() {
    if (arguments && arguments.length > 1) {
        let template = arguments[0];

        const t = typeof arguments[1];
        const args =
            ("string" === t || "number" === t)
                ? Array.prototype.slice.call(arguments)
                : arguments[1];

        for (let key in args) {
            template = template.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
        }
        return template;
    }
}

module.exports = {
    'stub': buildProfileStub,
}