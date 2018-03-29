const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const sc2 = require('../web/bnet').api;
const testUtil = require('./util.js');

describe('getProfileApiUrl(params)', () => {
    it('should construct a valid API url to retrieve data about the given profile', () => {
        const params = {
            api_key: 'test_api_key',
            username: 'fallofmath',
            user_id: 2784180,
            region: 1,
            server: 'eu',
            locale: 'en_GB',
        };
        const expected = 'https://eu.api.battle.net/sc2/profile/2784180/1/fallofmath/?locale=en_GB&apikey=test_api_key';
        expect(sc2.getProfileApiUrl(params)).to.be.equal(expected);
    });
});

describe('getAchievementsApiUrl(params)', () => {
    it('should construct a valid API url to retrieve achievement data', () => {
        const params = {
            api_key: 'test_api_key',
            server: 'eu',
            locale: 'en_GB',
        };
        const expected = 'https://eu.api.battle.net/sc2/data/achievements?locale=en_GB&apikey=test_api_key';
        expect(sc2.getAchievementsApiUrl(params)).to.be.equal(expected);
    });
});

describe('parseProfileUrl(url)', () => {
    it('should parse a battle.net profile url', () => {
        const url = 'http://eu.battle.net/sc2/en/profile/2784180/1/fallofmath/';
        const parsed = sc2.parseProfileUrl(url);

        // Expected values
        const username = 'fallofmath';
        const server = 'eu';
        const language = 'en';
        const user_id = '2784180';
        const region = '1';

        expect(parsed.username).to.be.equal(username);
        expect(parsed.server).to.be.equal(server);
        expect(parsed.language).to.be.equal(language);
        expect(parsed.user_id).to.be.equal(user_id);
        expect(parsed.region).to.be.equal(region);
    });
});

describe('buildProfileUrl(params)', () => {
    it('should construct a valid battle.net profile url', () => {
        const params = {
            server: 'eu',
            language: 'de',
            region: 1,
            username: 'fallofmath',
            user_id: 2784180,
        };

        const url = sc2.buildProfileUrl(params);

        expect(url).to.be.equal('http://eu.battle.net/sc2/de/profile/2784180/1/fallofmath/');
    });
});

describe('addCategoryIds(achievements, achievementDefs)', () => {
    it('should add categoryId value to each object in achievements', () => {
        const achievements = [
            {
                "achievementId" : 91475035554468,
                "completionDate" : 1521244987
            },
            {
                "achievementId" : 91475035554477,
                "completionDate" : 1521243301
            },
        ];

        const defs = testUtil.getTestAchievementsProcessed();
        sc2.addCategoryIds(achievements, defs);

        expect(achievements[0].categoryId).to.be.equal(4387708);
        expect(achievements[1].categoryId).to.be.equal(4377488);
    });
});

describe('buildAchievements(achievements, callback)', () => {
    it('should restructure achievement data into a dictionary with achievementId as the key', (done) => {
        const achievements = testUtil.getTestAchievementApiResponse().achievements;
        expect(achievements[0].achievementId).to.be.equal(91475035554439);

        sc2.buildAchievements(achievements)
            .then(data => {
                expect(data[91475035554751].categoryId).to.be.equal(3211311);
                expect(data[91475320766526].categoryId).to.be.equal(4325385);
                expect(data[91475334536921].categoryId).to.be.equal(4386911);
            })
            .then(done());
    });
})

describe('buildCategories(categories, callback)', () => {
    it(`should build a dictionary of categories using categoryId as the key.
        Each category may have a list of associated achievement IDs and/or the ID of its parent`, (done) => {
        const apiResponse = testUtil.getTestAchievementApiResponse();
        expect(apiResponse.categories[0].featuredAchievementId).to.be.equal(91475320766734);

        sc2.buildCategories(apiResponse)
            .then(cats => {
                expect(cats[4364473].featuredAchievementId).to.be.equal(91475335963007);

                // Test that parent assignment works correctly
                expect(cats[3211295].parent).to.be.equal(4325410);

                // Test that achievements are assigned to category correctly
                const storyMode = cats[3211292];
                [91475035553973, 91475035553974, 91475035553975].forEach(id => {
                    expect(storyMode.achievements).to.include(id);
                });
            })
            .then(done)
            .catch(err => {
                console.error(err);
                throw(err);
            });
    });
})
