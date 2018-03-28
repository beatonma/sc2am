const IGNORED_ACHIEVEMENT_CATEGORIES = [
    4325394,  // Feats of Strength
];

// Old achievements that are no longer achievable
// e.g. FFA; Mothership vortex
const DEPRECATED_ACHIEVEMENTS = [
    // FFA 5-800 wins
    '91475320766623',
    '91475320766624',
    '91475320766625',
    '91475320766626',
    '91475320766627',
    '91475320766628',
    '91475320766629',
    '91475320766630',

    // FFA Destroyer
    '91475320766632',

    // FFA Gladiator
    '91475035553850',

    // Distorted Reality - Mothership vortex
    '91475035553843'
];

/*
 * Some achievements override others
 * e.g. 'Wings of Liberty: Hard 5' is overridden by 'Wings of Liberty: Hard 10'
 *      and also by 'Wings of Liberty: Brutal 5'
 *      
 * The battle.net API profile response only includes the highest level
 * achieved - all lower levels appear unearned.
 * e.g. If you earn 'WoL: Hard 25', then 'WoL: Hard 5/10/15/20' appears
 *      unearned
 *
 * Here we store a list of achievement IDs for known overrides so that we can
 * recognise and remove them later.
 * 
 * The ID order is all over the place so I guess we just have to do this
 * manually :(  It is very tedious but we may need to update this as more
 * achievements are added - particularly co-op ones.
 *
 * Groups are in ascending order, unless otherwise specified
 *
 * n.b: The 'Feats of Strength' category contains many override achievements
 *      but we ignore them because they are not worth any points and they are
 *      tedious to maintain.
 */
const ACHIEVEMENT_OVERRIDE_CATEGORIES = [
    3211292,  // Wings of Liberty, 'Story Mode'
    4325408,  // Arcade
    3211293,  // Heart of the Swarm, 'Story Mode'
    4346203,  // Legacy of the Void, 'Story Mode'
    4353371,  // Co-op, 'Difficulty'
    4377898,  // Co-op, 'Levels'
    4325378,  // Versus, '1v1 Unranked/Ranked'
    4325385,  // Versus, 'Team Unranked/Ranked'
    4325386,  // Versus, 'Versus A.I. Very Easy'
    4325387,  // Versus, 'Versus A.I. Medium'
    4325388,  // Versus, 'Versus A.I. Harder'
    4325389,  // Versus, 'Versus A.I. Elite'
    4325390,  // Versus, 'Race Versus A.I.'
    4325392,  // Custom Games, 'Very Easy A.I'
    4325395,  // Custom Games, 'Medium A.I'
    4325396,  // Custom Games, 'Harder A.I'
    4325402,  // Custom Games, 'Elite A.I'
];

/*
 * achievement id lists must be in order of succession - later members
 * will override earlier members!
 */
const ACHIEVEMENT_OVERRIDES = {
    /* SINGLE PLAYER */
    3211292: {
        hard: {
            achievements: [
                91475035553997,
                91475035553998,
                91475035553999,
                91475035554000,
                91475035554001,
            ],
        },
        brutal: {
            overrides: 'hard',
            achievements: [
                91475035554002,
                91475035554003,
                91475035554004,
                91475035554005,
                91475035554006,
            ],
        },
        // Wings of Liberty: Hard 5-25
        // 91475035553997,
        // 91475035553998,
        // 91475035553999,
        // 91475035554000,
        // 91475035554001,

        // // Wings of Liberty: Brutal 5-25
        // 91475035554002,
        // 91475035554003,
        // 91475035554004,
        // 91475035554005,
        // 91475035554006,
    },

    3211293: [
        // Heart of the Swarm: Brutal 5-20
        91475035554156, // 5
        91475035554157, // 20
        91475035554158, // 10
        91475035554159, // 15

        // Heart of the Swarm: Hard 5-20
        91475035554160, // 5
        91475035554161, // 20
        91475035554162, // 10
        91475035554163, // 15

        // Heart of the Swarm: Normal 5-20
        91475035554362, // 5
        91475035554363, // 20
        91475035554364, // 10
        91475035554365, // 15

        // HotS Kerrigan Power 10-70
        91475035554354,
        91475035554355,
        91475035554356,
        91475035554357,
        91475035554358,
        91475035554359,
        91475035554360,
    ],

    4346203: [
        // LotV Solar Powered: 50-300
        91475035554435,  // 150
        91475035554436,  // 200
        91475035554437,  // 250
        91475035554438,  // 300
        91475035554439,  // 50
        91475035554561,  // 100

        // Legacy of the Void: Brutal 5-19
        91475035554530,
        91475035554531,
        91475035554533,
        91475035554535,

        // Legacy of the Void: Hard 5-19
        91475035554532,  // 10
        91475035554534,  // 15
        91475035554536,  // 19
        91475035554559,  // 5

        // Legacy of the Void: Normal 5-19
        91475035554538,  // 15
        91475035554539,  // 19
        91475035554540,  // 5
        91475035554543,  // 10
    ],

    4325408: [
        // StarCraft Master: Complete 10-30 rounds
        91475035554036,
        91475035554037,
        91475035554038,
        91475035554039,
    ],

    /* CO-OP */
    4353371: [
        /* Co-op Difficulty */
        // Casual 10-500 missions completed
        91475320835372,  // 500
        91475322971092,  // 75
        91475325888028,  // 500
        91475326410893,  // 10
        91475326821551,  // 25
        91475334286067,  // 50
        91475334812772,  // 100
        91475337246592,  // 150

        // Normal 10-500 missions completed
        91475322354638,  // 300
        91475323695781,  // 100
        91475323946151,  // 150
        91475326768131,  // 25
        91475327997139,  // 75
        91475328864099,  // 500
        91475330365211,  // 10
        91475330769258,  // 50

        // Hard 10-500 missions completed
        91475321434128,  // 75
        91475322035960,  // 25
        91475324244989,  // 500
        91475332024771,  // 150
        91475332517436,  // 50
        91475332589913,  // 300
        91475335028033,  // 10
        91475336742427,  // 100

        // Brutal 10-500 missions completed
        91475322969088,  // 150
        91475324050927,  // 300
        91475325478583,  // 25
        91475328131428,  // 100
        91475329056828,  // 500
        91475331870315,  // 75
        91475332369454,  // 10
        91475332741354,  // 50
    ],

    4377898: [
        /* Co-op Levels */
        // Mastery levels 10-90
        91475322833851,  // 20
        91475323230709,  // 50
        91475325706792,  // 40
        91475329050964,  // 10
        91475329470676,  // 30
        91475331545339,  // 70
        91475334671083,  // 60
        91475334762647,  // 90
        91475335483250,  // 80

        /* Co-op levels */
        // Abathur levels 5-15
        91475322961304,  // 5
        91475331305824,  // 15
        91475335437481,  // 10

        // Alarak levels 5-15
        91475322588892,  // 15
        91475323410831,  // 5
        91475326390096,  // 10

        // Artanis levels 5-15
        91475323853471,  // 5
        91475327799321,  // 15
        91475335807841,  // 10

        // Dehaka levels 5-15
        91475323778830,  // 15
        91475324281236,  // 5
        91475325026471,  // 10

        // Fenix levels 5-15
        91475324727776,  // 10
        91475327586357,  // 15
        91475334058022,  // 5

        // Horner levels 5-15
        91475323803719,  // 15
        91475331577281,  // 5
        91475331840792,  // 10

        // Karak levels 5-15
        91475323126750,  // 10
        91475325568242,  // 5
        91475332667413,  // 15

        // Kerrigan levels 5-15
        91475321112139,  // 15
        91475325498135,  // 5
        91475331052561,  // 10

        // Nova levels 5-15
        91475327915283,  // 15
        91475330384728,  // 10
        91475336203783,  // 5

        // Raynor levels 5-15
        91475321572241,
        91475328627176,
        91475331860104,

        // Stukov levels 5-15
        91475324225400,  // 5
        91475324625978,  // 15
        91475334326859,  // 10

        // Swann levels 5-15
        91475336291145,  // 5
        91475337361763,  // 15
        91475322668947,  // 10

        // Vorazun levels 5-15
        91475322365788,  // 15
        91475324600378,  // 10
        91475328493540,  // 5

        // Zagara levels 5-15
        91475322764393,
        91475323988052,
        91475336446624,
    ],

    /* MULTIPLAYER */
    4325378: [
        /* Versus '1v1 Unranked/Ranked' */
        // Solo Terran 10-1000 wins
        91475320766465,
        91475320766468,
        91475320766469,
        91475320766470,
        91475320766471,
        91475320766472,
        91475320766473,
        91475320766474,

        // Solo Zerg 10-1000 wins
        91475320766475,
        91475320766482,
        91475320766483,
        91475320766484,
        91475320766485,
        91475320766486,
        91475320766487,
        91475320766488,

        // Solo Protoss 10-1000 wins
        91475320766489,
        91475320766490,
        91475320766491,
        91475320766492,
        91475320766493,
        91475320766494,
        91475320766495,
        91475320766496,

        // Solo Random 10-1000 wins
        91475320766497,
        91475320766498,
        91475320766499,
        91475320766500,
        91475320766501,
        91475320766502,
        91475320766503,
        91475320766504,

        // Solo Hot Streak 3-5 wins
        91475320766505,
        91475320766506,
    ],

    4325385: [
        /* Versus, 'Team Unranked/Ranked' */
        // Team Terran 10-1000 wins
        91475320766509,
        91475320766510,
        91475320766511,
        91475320766512,
        91475320766513,
        91475320766514,
        91475320766515,
        91475320766516,

        // Team Zerg 10-1000 wins
        91475320766517,
        91475320766518,
        91475320766519,
        91475320766520,
        91475320766521,
        91475320766522,
        91475320766523,
        91475320766524,

        // Team Protoss 10-1000 wins
        91475320766525,
        91475320766526,
        91475320766527,
        91475320766528,
        91475320766529,
        91475320766530,
        91475320766531,
        91475320766532,
        
        // Team Random 10-1000 wins
        91475320766533,
        91475320766534,
        91475320766535,
        91475320766536,
        91475320766537,
        91475320766538,
        91475320766539,
        91475320766540,

        // Team Hot Streak 3-5 wins
        91475320766541,
        91475320766542,
    ],

    /* VERSUS A.I. */
    4325386: [
        /* Versus, 'Versus A.I. Very Easy' */
        // Very Easy 10-250 wins
        91475320766545,
        91475320766546,
        91475320766547,
        91475320766548,
        91475320766549,
        // Very Easy 2v2 5-15 win streak
        91475320766550,
        91475320766551,
        91475320766552,

        // Very Easy 3v3 5-15 win streak
        91475320766553,
        91475320766554,
        91475320766555,
    ],

    4325387: [
        /* Versus, 'Versus A.I. Medium' */
        // Medium 10-250 wins
        91475320766559,
        91475320766560,
        91475320766561,
        91475320766562,
        91475320766563,

        // Medium 2v2 5-15 win streak
        91475320766564,
        91475320766565,
        91475320766566,

        // Medium 3v3 5-15 win streak
        91475320766567,
        91475320766568,
        91475320766569,
    ],

    4325388: [
        /* Versus, 'Versus A.I. Harder' */
        // Harder 10-250 wins
        91475320766573,
        91475320766574,
        91475320766575,
        91475320766576,
        91475320766577,

        // Harder 2v2 5-15 win streak
        91475320766578,
        91475320766579,
        91475320766580,

        // Harder 3v3 5-15 win streak
        91475320766581,
        91475320766582,
        91475320766583,
    ],

    4325389: [
        /* Versus, 'Versus A.I. Elite' */
        // Elite 10-250 wins
        91475320766587,
        91475320766588,
        91475320766589,
        91475320766590,
        91475320766591,

        // Elite 2v2 5-15 win streak
        91475320766592,
        91475320766593,
        91475320766594,

        // Elite 3v3 5-15 win streak
        91475320766595,
        91475320766596,
        91475320766597,
    ],

    4325390: [
        /* Versus: 'Race Versus A.I.' */
        // Play as Terran: 10-250 wins
        91475320766601,
        91475320766602,
        91475320766603,
        91475320766604,
        91475320766605,

        // Play as Protoss: 10-250 wins
        91475320766606,
        91475320766607,
        91475320766608,
        91475320766609,
        91475320766610,

        // Play as Zerg: 10-250 wins
        91475320766611,
        91475320766612,
        91475320766613,
        91475320766614,
        91475320766615,

        // Play as Random: 10-250 wins
        91475320766616,
        91475320766617,
        91475320766618,
        91475320766619,
        91475320766620,
    ],

    4325392: [
        /* Custom Games, 'Very Easy A.I' */
        // AI Romp Terran Very Easy 10-100 wins
        91475320766636,
        91475320766637,
        91475320766638,
        91475320766639,

        // AI Romp Zerg Very Easy 10-100 wins
        91475320766640,
        91475320766641,
        91475320766642,
        91475320766643,
        
        // AI Romp Protoss Very Easy 10-100 wins
        91475320766644,
        91475320766645,
        91475320766646,
        91475320766647,

        // AI Romp Random Very Easy 10-100 wins
        91475320766648,
        91475320766649,
        91475320766650,
        91475320766651,
    ],

    4325395: [
        /* Custom Games, 'Medium A.I' */
        // Medium AI Romp 10-100 wins
        91475320766655,
        91475320766656,
        91475320766657,
        91475320766658,
    ],

    4325396: [
        /* Custom Games, 'Harder A.I' */
        // Harder AI Romp 10-100 wins
        91475320766666,
        91475320766668,
        91475320766669,
        91475320766670,
    ],

    4325402: [
        /* Custom Games, 'Elite A.I' */
        // Elite AI Romp 10-100 wins
        91475320766711,
        91475320766712,
        91475320766713,
        91475320766714,
    ],
};

/*
 * Check if any achievement in the given list is known to override
 * other achievements.
 * If so, append those achievements to the list.
 */
function addOverrides(achievements) {
    const len = achievements.length;
    for (let i = 0; i < len; i++) {
        const a = achievements[i];
        if (ACHIEVEMENT_OVERRIDE_CATEGORIES.includes(a.categoryId)) {
            // series = dict of objects that each represent a series
            //          of related achievements.
            //          e.g. 5, 10, 15... missions complete
            const series = ACHIEVEMENT_OVERRIDES[a.categoryId];
            for (let k in series) {
                const group = series[k];
                const achs = group.achievements;
                const pos = achs.indexOf(a.achievementId);
                if (pos >= 0) {
                    console.log('Achievement found, added subs');
                    // Achievement found in this series. Add any previous
                    // series members to achievements list
                    for (let j = 0; j < pos; j++) {
                        achievements.push({achievementId: achs[j]});
                    }
                    if ('overrides' in group) {
                        const related = series[group.overrides];
                        for (let j = 0; j <= pos; j++) {
                            achievements.push({achievementId: related.achievements[j]});
                        }
                    }
                    break;
                }
            }
        }
    }
}

/*
 * Take a list of completed achievement IDs
 * For each achievement, check if it overrides others and add those to
 * the list
 */

module.exports = {
    IGNORED_ACHIEVEMENT_CATEGORIES: IGNORED_ACHIEVEMENT_CATEGORIES,
    DEPRECATED_ACHIEVEMENTS: DEPRECATED_ACHIEVEMENTS,
    addOverrides: addOverrides,
}