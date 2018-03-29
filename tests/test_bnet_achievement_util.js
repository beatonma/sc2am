const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const achievementUtil = require('../web/bnet/achievement-util.js');
const testUtil = require('./util.js');

/*
 * Each object in achievements should contain at least achievementId and categoryId
 */
describe('addOverrides(achievements)', () => {
    it('should check if any achievements are known to override another and, if so, add those to the list', () => {
        const achievementsWolHard = [
            // WoL Hard 20. We expect WoL Hard 5, 10, 15 to be added
            {achievementId: 91475035554000, categoryId: 3211292},

            // Other, non-overriding achievements
            {achievementId: 91475035554477, categoryId: 4377488},  // Nexus of Destruction
            {achievementId: 91475035554455, categoryId: 4387708},  // We Move Unseen
            {achievementId: 91475035553984, categoryId: 3211292},  // Dead Man's Hand
        ];

        achievementUtil.addOverrides(achievementsWolHard);

        // 3 new achievements should be added to the list
        expect(achievementsWolHard.length).to.be.equal(7);
        expect(achievementsWolHard[4].achievementId).to.be.equal(91475035553997);  // WoL Hard 5

        const achievementsWolBrutal = [
            // WoL Brutal 15. We expect WoL Brutal 5, 10 to be added
            // as well as WoL Hard 5, 10, 15
            {achievementId: 91475035554004, categoryId: 3211292},  // WoL Brutal 15

            // Other, non-overriding achievements
            {achievementId: 91475035554477, categoryId: 4377488},  // Nexus of Destruction
            {achievementId: 91475035554455, categoryId: 4387708},  // We Move Unseen
            {achievementId: 91475035553984, categoryId: 3211292},  // Dead Man's Hand
        ];

        achievementUtil.addOverrides(achievementsWolBrutal);

        expect(achievementsWolBrutal.length).to.be.equal(9);
        expect(achievementsWolBrutal[4].achievementId).to.be.equal(91475035554002)  // WoL Brutal 5
        expect(achievementsWolBrutal[7].achievementId).to.be.equal(91475035553998)  // WoL Hard 10

        const achievementsHotsBrutal = [
            // HotS Brutal 15. Should add:
            //   - HotS Brutal 5, 10
            //   - HotS Hard 5, 10, 15
            //   - HotS Normal 5, 10, 15
            {achievementId: 91475035554159, categoryId: 3211293},

            // Other, non-overriding achievements
            {achievementId : 91475035554477, categoryId: 4377488},  // Nexus of Destruction
            {achievementId : 91475035554455, categoryId: 4387708},  // We Move Unseen
            {achievementId : 91475035553984, categoryId: 3211292},  // Dead Man's Hand
        ];

        achievementUtil.addOverrides(achievementsHotsBrutal);

        expect(achievementsHotsBrutal.length).to.be.equal(12);
        expect(achievementsHotsBrutal[4].achievementId).to.be.equal(91475035554156);    // Hots Brutal 5
        expect(achievementsHotsBrutal[7].achievementId).to.be.equal(91475035554162);    // Hots Hard 10
        expect(achievementsHotsBrutal[11].achievementId).to.be.equal(91475035554365);   // Hots Normal 15
    });
});