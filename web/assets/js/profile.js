let achievements = null;

function loadProfile(params, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/profile');

    xhr.onload = () => {
        if (xhr.status === 200) {
            const profile = JSON.parse(xhr.response);
            achievements = profile.achievements.achievements;
            displayProfile(profile);
            displayAchievements();
        }
        else {
            // TODO show loading error
        }
    };
    const payload = new URLSearchParams();
    for (key in user) {
        payload.append(key, user[key]);
    }

    xhr.send(payload);
}

function displayProfile(profile) {
    const points = profile.achievements.points;
    document.getElementById('points_total').appendChild(document.createTextNode(points.totalPoints));
    const categories = points.categoryPoints;
    const categoriesContainer = document.getElementById('points_categories');
    for (let k in categories) {
        const d = document.createElement('div');
        d.className = 'points-category';
        d.appendChild(document.createTextNode(k + ':'));

        const s = document.createElement('span');
        s.className = 'points';
        s.appendChild(document.createTextNode(categories[k]));
        d.appendChild(s);
        
        categoriesContainer.appendChild(d);
    }
}

function displayAchievements(sortby) {
    sortby = sortby || 'achievementId';
    if (!achievements) {
        console.log('Achievements are not yet loaded');
        return;
    }
    const container = document.getElementById('achievements');
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }

    sortAchievements(sortby);

    // if (sortby === 'achievementId') {
    //     achievements.sort((a, b) => {
    //         return a.achievementId - b.achievementId;
    //     });
    // }
    // else if (sortby === 'points') {
    //     achievements.sort((a, b) => {
    //         return b.points - a.points;
    //     });
    // }
    // else if (sortby === 'categoryId') {
    //     achievements.sort((a, b) => {
    //         return a.categoryId - b.categoryId;
    //     })
    // }
    // else if (sortby === 'title') {
    //     achievements.sort((a, b) => {
    //         return a.title.localeCompare(b.title);
    //     })
    // }

    const fields = ['points', 'title', 'description', 'achievementId', 'categoryId'];
    for (let k in achievements) {
        const a = achievements[k];
        const d = document.createElement('div');
        d.className = 'achievement';

        for (let i = 0; i < fields.length; i++) {
            const f = fields[i];
            const t = document.createElement('div');
            t.className = f;
            t.appendChild(document.createTextNode(a[f]));
            d.appendChild(t);
        }
        container.appendChild(d);
    }

    document.getElementById('achievement_controls').classList.remove('hidden');
}

function sortAchievements(sortby) {
    if (sortby === 'achievementId') {
        achievements.sort((a, b) => {
            return a.achievementId - b.achievementId;
        });
    }
    else if (sortby === 'points') {
        achievements.sort((a, b) => {
            return b.points - a.points;
        });
    }
    else if (sortby === 'categoryId') {
        achievements.sort((a, b) => {
            return a.categoryId - b.categoryId;
        })
    }
    else if (sortby === 'title') {
        achievements.sort((a, b) => {
            return a.title.localeCompare(b.title);
        })
    }
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

document.getElementById('sort_points').addEventListener('click', () => {
    displayAchievements('points');
});
document.getElementById('sort_category').addEventListener('click', () => {
    displayAchievements('categoryId');
});
document.getElementById('sort_title').addEventListener('click', () => {
    displayAchievements('title');
});