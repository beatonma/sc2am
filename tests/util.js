const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;


/*
 * Returns a dictionary object with achievementId as key
 */
function getTestAchievementsProcessed() {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'data', 'achievements-processed.json'),
            'utf-8'));
}

/*
 * Returns a dictionary object with categoryId as key
 */
function getTestCategoriesProcessed() {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'data', 'categories-processed.json'),
            'utf-8'));
}

/*
 * Returns a dictionary object with 'achievements' and 'categories'
 * as children
 */
function getTestAchievementApiResponse() {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'data', 'achievements-api-response.json'),
            'utf-8'));
}

module.exports = {
    getTestAchievementsProcessed: getTestAchievementsProcessed,
    getTestCategoriesProcessed: getTestCategoriesProcessed,
    getTestAchievementApiResponse: getTestAchievementApiResponse,
}


describe('getTestAchievementsProcessed()', () => {
    it('return a dictionary representing achievements from API (after processing)', () => {
        const achievements = getTestAchievementsProcessed();

        expect(achievements['91475035554439'].categoryId).to.be.equal(4346203);
        expect(achievements['91475035554451'].categoryId).to.be.equal(4377488);
    });
});

describe('getTestCategoriesProcessed()', () => {
    it('return a dictionary representing categories from API (after processing)', () => {
        const categories = getTestCategoriesProcessed();

        expect(categories['4353371'].parent).to.be.equal(4386911);
        expect(categories['4377488'].achievements[0]).to.be.equal(91475035554451);
    });
});

describe('getTestAchievementApiResponse()', () => {
    it('should return an object representing a response from ...api.battle.net/sc2/data/achievements (before processing)', () => {
        const apiResponse = getTestAchievementApiResponse();
        const achievements = apiResponse.achievements;
        const categories = apiResponse.categories;

        expect(achievements[0].categoryId).to.be.equal(4346203);
        expect(categories[0].categoryId).to.be.equal(4325379);
    });
});