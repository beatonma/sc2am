var expect = require('chai').expect;
var sc2 = require('../web/bnet').api;

describe('parseProfileUrl(url)', () => {
    it('should parse a battle.net profile url', () => {
        const url = 'http://eu.battle.net/sc2/en/profile/2784180/1/fallofmath/';
        const parsed = sc2.parseProfileUrl(url);

        // Expected values
        const username = 'fallofmath';
        const server = 'eu';
        const language = 'en';
        const id = '2784180';
        const region = '1';

        expect(parsed.username).to.be.equal(username);
        expect(parsed.server).to.be.equal(server);
        expect(parsed.language).to.be.equal(language);
        expect(parsed.id).to.be.equal(id);
        expect(parsed.region).to.be.equal(region);
    });
});