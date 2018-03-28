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
            // WoL Hard 5-25
            achievements: [
                91475035553997,
                91475035553998,
                91475035553999,
                91475035554000,
                91475035554001,
            ],
        },
        brutal: {
            // WoL Brutal 5-25
            overrides: 'hard',
            achievements: [
                91475035554002,
                91475035554003,
                91475035554004,
                91475035554005,
                91475035554006,
            ],
        },
    },

    3211293: {
        brutal: {
            // Heart of the Swarm: Brutal 5-20
            overrides: 'hard',
            achievements: [
                91475035554156, // 5
                91475035554158, // 10
                91475035554159, // 15
                91475035554157, // 20
            ],
        },

        hard: {
            // Heart of the Swarm: Hard 5-20
            overrides: 'normal',
            achievements: [
                91475035554160, // 5
                91475035554162, // 10
                91475035554163, // 15
                91475035554161, // 20
            ],
        },

        normal: {
            // Heart of the Swarm: Normal 5-20
            achievements: [
                91475035554362, // 5
                91475035554364, // 10
                91475035554365, // 15
                91475035554363, // 20
            ],
        },

        kerrigan: {
            // HotS Kerrigan Power 10-70
            achievements: [
                91475035554354,
                91475035554355,
                91475035554356,
                91475035554357,
                91475035554358,
                91475035554359,
                91475035554360,
            ],
        }
    },

    4346203: {
        solar: {
            // LotV Solar Powered: 50-300
            achievements: [
                91475035554439,  // 50
                91475035554561,  // 100
                91475035554435,  // 150
                91475035554436,  // 200
                91475035554437,  // 250
                91475035554438,  // 300
            ],
        },

        brutal: {
            // Legacy of the Void: Brutal 5-19
            overrides: 'hard',
            achievements: [
                91475035554530,
                91475035554531,
                91475035554533,
                91475035554535,
            ],
        },

        hard: {
            // Legacy of the Void: Hard 5-19
            overrides: 'normal',
            achievements: [
                91475035554559,  // 5
                91475035554532,  // 10
                91475035554534,  // 15
                91475035554536,  // 19
            ],
        },

        normal: {
            // Legacy of the Void: Normal 5-19
            achievements: [
                91475035554540,  // 5
                91475035554543,  // 10
                91475035554538,  // 15
                91475035554539,  // 19
            ]
        }
    },

    4325408: {
        master: {
            // StarCraft Master: Complete 10-30 rounds
            achievements: [
                91475035554036,
                91475035554037,
                91475035554038,
                91475035554039,
            ],
        },
    },

    /* CO-OP */
    4353371: {
        /* Co-op Difficulty */
        casual: {
            // Casual 10-500 missions completed
            achievements: [
                91475326410893,  // 10
                91475326821551,  // 25
                91475334286067,  // 50
                91475322971092,  // 75
                91475334812772,  // 100
                91475337246592,  // 150
                91475320835372,  // 300
                91475325888028,  // 500
            ],
        },

        normal: {
            // Normal 10-500 missions completed
            overrides: 'casual',
            achievements: [
                91475330365211,  // 10
                91475326768131,  // 25
                91475330769258,  // 50
                91475327997139,  // 75
                91475323695781,  // 100
                91475323946151,  // 150
                91475322354638,  // 300
                91475328864099,  // 500
            ],
        },

        hard: {
            // Hard 10-500 missions completed
            overrides: 'normal',
            achievements: [
                91475335028033,  // 10
                91475322035960,  // 25
                91475332517436,  // 50
                91475321434128,  // 75
                91475336742427,  // 100
                91475332024771,  // 150
                91475332589913,  // 300
                91475324244989,  // 500
            ],
        },

        brutal: {
            // Brutal 10-500 missions completed
            overrides: 'hard',
            achievements: [
                91475332369454,  // 10
                91475325478583,  // 25
                91475332741354,  // 50
                91475331870315,  // 75
                91475328131428,  // 100
                91475322969088,  // 150
                91475324050927,  // 300
                91475329056828,  // 500
            ],
        },
    },

    4377898: {
        /* Co-op Levels */
        mastery: {
            // Mastery levels 10-90
            achievements: [
                91475329050964,  // 10
                91475322833851,  // 20
                91475329470676,  // 30
                91475325706792,  // 40
                91475323230709,  // 50
                91475334671083,  // 60
                91475331545339,  // 70
                91475335483250,  // 80
                91475334762647,  // 90
            ],
        },

        abathur: {
            // Abathur levels 5-15
            achievements: [
                91475322961304,  // 5
                91475335437481,  // 10
                91475331305824,  // 15
            ],
        },

        alarak: {
            // Alarak levels 5-15
            achievements: [
                91475323410831,  // 5
                91475326390096,  // 10
                91475322588892,  // 15
            ],
        },

        artanis: {
            // Artanis levels 5-15
            achievements: [
                91475323853471,  // 5
                91475335807841,  // 10
                91475327799321,  // 15
            ],
        },
        
        dehaka: {
            // Dehaka levels 5-15
            achievements: [
                91475324281236,  // 5
                91475325026471,  // 10
                91475323778830,  // 15
            ],
        },
        

        fenix: {
            // Fenix levels 5-15
            achievements: [
                91475334058022,  // 5
                91475324727776,  // 10
                91475327586357,  // 15
            ],
        },

        horner: {
            // Horner levels 5-15
            achievements: [
                91475331577281,  // 5
                91475331840792,  // 10
                91475323803719,  // 15
            ],
        },

        karak: {
            // Karak levels 5-15
            achievements: [
                91475325568242,  // 5
                91475323126750,  // 10
                91475332667413,  // 15
            ],
        },

        kerrigan: {
            // Kerrigan levels 5-15
            achievements: [
                91475325498135,  // 5
                91475331052561,  // 10
                91475321112139,  // 15
            ],
        },
        
        nova: {
            // Nova levels 5-15
            achievements: [
                91475336203783,  // 5
                91475330384728,  // 10
                91475327915283,  // 15
            ],
        },

        raynor: {
            // Raynor levels 5-15
            achievements: [
                91475321572241,  // 5
                91475328627176,  // 10
                91475331860104,  // 15
            ],
        },

        stukov: {
            // Stukov levels 5-15
            achievements: [
                91475324225400,  // 5
                91475334326859,  // 10
                91475324625978,  // 15
            ],
        },

        swann: {
            // Swann levels 5-15
            achievements: [
                91475336291145,  // 5
                91475322668947,  // 10
                91475337361763,  // 15
            ],
        },

        vorazun: {
            // Vorazun levels 5-15
            achievements: [
                91475328493540,  // 5
                91475324600378,  // 10
                91475322365788,  // 15
            ],
        },

        zagara: {
            // Zagara levels 5-15
            achievements: [
                91475322764393,  // 5
                91475323988052,  // 10
                91475336446624,  // 15
            ],
        },
    },

    /* MULTIPLAYER */
    4325378: {
        /* Versus '1v1 Unranked/Ranked' */
        terran: {
            // Solo Terran 10-1000 wins
            achievements: [
                91475320766465,
                91475320766468,
                91475320766469,
                91475320766470,
                91475320766471,
                91475320766472,
                91475320766473,
                91475320766474,
            ],
        },
        
        zerg: {
            // Solo Zerg 10-1000 wins
            achievements: [
                91475320766475,
                91475320766482,
                91475320766483,
                91475320766484,
                91475320766485,
                91475320766486,
                91475320766487,
                91475320766488,
            ],
        },

        protoss: {
            // Solo Protoss 10-1000 wins
            achievements: [
                91475320766489,
                91475320766490,
                91475320766491,
                91475320766492,
                91475320766493,
                91475320766494,
                91475320766495,
                91475320766496,
            ],
        },

        random: {
            // Solo Random 10-1000 wins
            achievements: [
                91475320766497,
                91475320766498,
                91475320766499,
                91475320766500,
                91475320766501,
                91475320766502,
                91475320766503,
                91475320766504,
            ],
        },

        hotstreak: {
            // Solo Hot Streak 3-5 wins
            achievements: [
                91475320766505,
                91475320766506,
            ],
        },
    },

    4325385: {
        /* Versus, 'Team Unranked/Ranked' */
        terran: {
            // Team Terran 10-1000 wins
            achievements: [
                91475320766509,
                91475320766510,
                91475320766511,
                91475320766512,
                91475320766513,
                91475320766514,
                91475320766515,
                91475320766516,
            ],
        },

        zerg: {
            // Team Zerg 10-1000 wins
            achievements: [
                91475320766517,
                91475320766518,
                91475320766519,
                91475320766520,
                91475320766521,
                91475320766522,
                91475320766523,
                91475320766524,
            ],
        },

        protoss: {
            // Team Protoss 10-1000 wins
            achievements: [
                91475320766525,
                91475320766526,
                91475320766527,
                91475320766528,
                91475320766529,
                91475320766530,
                91475320766531,
                91475320766532,
            ],
        },
        
        random: {
            // Team Random 10-1000 wins
            achievements: [
                91475320766533,
                91475320766534,
                91475320766535,
                91475320766536,
                91475320766537,
                91475320766538,
                91475320766539,
                91475320766540,
            ],
        },

        hotstreak: {
            // Team Hot Streak 3-5 wins
            achievements: [
                91475320766541,
                91475320766542,
            ],
        },
    },

    /* VERSUS A.I. */
    4325390: {
        /* Versus: 'Race Versus A.I.' */
        terran: {
            // Play as Terran: 10-250 wins
            achievements: [
                91475320766601,
                91475320766602,
                91475320766603,
                91475320766604,
                91475320766605,
            ],
        },

        protoss: {
            // Play as Protoss: 10-250 wins
            achievements: [
                91475320766606,
                91475320766607,
                91475320766608,
                91475320766609,
                91475320766610,
            ],
        },

        zerg: {
            // Play as Zerg: 10-250 wins
            achievements: [
                91475320766611,
                91475320766612,
                91475320766613,
                91475320766614,
                91475320766615,
            ],
        },

        random: {
            // Play as Random: 10-250 wins
            achievements: [
                91475320766616,
                91475320766617,
                91475320766618,
                91475320766619,
                91475320766620,
            ],
        },
    },

    4325386: {
        /* Versus, 'Versus A.I. Very Easy' */
        single: {
            // Very Easy 10-250 wins
            achievements: [
                91475320766545,
                91475320766546,
                91475320766547,
                91475320766548,
                91475320766549,
            ],
        },

        twos: {
            // Very Easy 2v2 5-15 win streak
            achievements: [
                91475320766550,
                91475320766551,
                91475320766552,
            ],
        },

        threes: {
            // Very Easy 3v3 5-15 win streak
            achievements: [
                91475320766553,
                91475320766554,
                91475320766555,
            ],
        },
    },

    4325387: {
        /* Versus, 'Versus A.I. Medium' */
        single: {
            // Medium 10-250 wins
            achievements: [
                91475320766559,
                91475320766560,
                91475320766561,
                91475320766562,
                91475320766563,
            ],
        },

        twos: {
            // Medium 2v2 5-15 win streak
            achievements: [
                91475320766564,
                91475320766565,
                91475320766566,
            ],
        },

        threes: {
            // Medium 3v3 5-15 win streak
            achievements: [
                91475320766567,
                91475320766568,
                91475320766569,
            ],
        },
    },

    4325388: {
        /* Versus, 'Versus A.I. Harder' */
        single: {
            // Harder 10-250 wins
            achievements: [
                91475320766573,
                91475320766574,
                91475320766575,
                91475320766576,
                91475320766577,
            ],
        },

        twos: {
            // Harder 2v2 5-15 win streak
            achievements: [
                91475320766578,
                91475320766579,
                91475320766580,
            ],
        },

        threes: {
            // Harder 3v3 5-15 win streak
            achievements: [
                91475320766581,
                91475320766582,
                91475320766583,
            ],
        },
    },

    4325389: {
        /* Versus, 'Versus A.I. Elite' */
        single: {
            // Elite 10-250 wins
            achievements: [
                91475320766587,
                91475320766588,
                91475320766589,
                91475320766590,
                91475320766591,
            ],
        },

        twos: {
            // Elite 2v2 5-15 win streak
            achievements: [
                91475320766592,
                91475320766593,
                91475320766594,
            ],
        },

        threes: {
            // Elite 3v3 5-15 win streak
            achievements: [
                91475320766595,
                91475320766596,
                91475320766597,
            ],
        },
    },

    4325392: {
        /* Custom Games, 'Very Easy A.I' */
        terran: {
            // AI Romp Terran Very Easy 10-100 wins
            achievements: [
                91475320766636,
                91475320766637,
                91475320766638,
                91475320766639,
            ],
        },

        zerg: {
            // AI Romp Zerg Very Easy 10-100 wins
            achievements: [
                91475320766640,
                91475320766641,
                91475320766642,
                91475320766643,
            ],
        },
        
        protoss: {
            // AI Romp Protoss Very Easy 10-100 wins
            achievements: [
                91475320766644,
                91475320766645,
                91475320766646,
                91475320766647,
            ],
        },

        random: {
            // AI Romp Random Very Easy 10-100 wins
            achievements: [
                91475320766648,
                91475320766649,
                91475320766650,
                91475320766651,
            ],
        },
    },

    4325395: {
        /* Custom Games, 'Medium A.I' */
        romp: {
            // Medium AI Romp 10-100 wins
            achievements: [
                91475320766655,
                91475320766656,
                91475320766657,
                91475320766658,
            ],
        },
    },

    4325396: {
        /* Custom Games, 'Harder A.I' */
        romp: {
            // Harder AI Romp 10-100 wins
            achievements: [
                91475320766666,
                91475320766668,
                91475320766669,
                91475320766670,
            ],
        },
    },

    4325402: {
        /* Custom Games, 'Elite A.I' */
        romp: {
            // Elite AI Romp 10-100 wins
            achievements: [
                91475320766711,
                91475320766712,
                91475320766713,
                91475320766714,
            ],
        },
    },
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
                    // Achievement found in this series. Add any previous
                    // series members to achievements list
                    for (let j = 0; j < pos; j++) {
                        achievements.push({achievementId: achs[j]});
                    }
                    let related = group.overrides;
                    while(related) {
                        const rel = series[related];
                        for (let j = 0; j <= pos; j++) {
                            achievements.push({achievementId: rel.achievements[j]});
                        }
                        related = rel.overrides;
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