const CATEGORY_ORDER = [
    '4325379',  // Liberty Campaign
    '4325410',  // Swarm Campaign
    '4330138',  // Void Campaign
    '4364473',  // Mission Packs
    '4325380',  // Exploration
    '4386911',  // Co-op Missions
    '4325377',  // Versus
    '4325382',  // Custom Games
    '4325408',  // Arcade
    '4361752',  // Collection
    // '4325394',  // Feats of Strength
];


//=include icons.js

let gAchievements = null;
let gSortType = null;
let gSortReverse = false;

//=include loading.js


function loadProfile(params, callback) {
    showLoading();
    hide('achievements_container');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/profile');

    xhr.onload = () => { 
        if (xhr.status === 200) {
            console.log('profile api response received');
            const profile = JSON.parse(xhr.response);
            gAchievements = profile.achievements.achievements;

            displayProfile(profile);
            displayCategorised();
        }
        else {
            console.error(xhr.status + ': ' + xhr.response);
            hideLoading();
            showError('Unable to load data [' + xhr.status + '] - please try again');
        }
    };
    xhr.onerror = err => {
        hideLoading();
        showError('Unable to load data [' + xhr.status + '] - please try again');
        console.error('LOADING ERROR: ' + err);
    };
    const payload = new URLSearchParams();
    for (let key in user) {
        payload.append(key, user[key]);
    }

    xhr.send(payload);
}


/*
 * Render an overview of the user profile
 */
function displayProfile(profile) {
    const points = profile.achievements.points;
    document.getElementById('points_total').appendChild(document.createTextNode(points.totalPoints));
    const categories = points.categoryPoints;
    const categoriesContainer = document.getElementById('points_categories');

    const keys = [];
    CATEGORY_ORDER.forEach(k => {
        if (k in categories) {
            keys.push(k);
        }
    });

    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const obj = categories[k];
        const container = document.createElement('div');
        container.className = 'points-category';

        if (k in CATEGORY_ICONS) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('viewBox', '0 0 240 240');
            svg.setAttribute('class', 'campaign-svg');

            const icon = CATEGORY_ICONS[k];
            const paths = icon.paths;
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', 'campaign-path ' + (icon.className || ''));
            for (let j = 0; j < paths.length; j++) {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', paths[j]);
                group.appendChild(path);
                
            }
            svg.appendChild(group);

            const link = document.createElement('a');
            link.setAttribute('href', '#' + k);
            link.setAttribute('title', obj.title);
            link.appendChild(svg);
            container.appendChild(link);
        }
        else {
            console.error('no icon for ' + k);
        }

        container.appendChild(createText(obj.points, {className: 'points'}));

        categoriesContainer.appendChild(container);
    }
    show('points_overview');
}

/*
 * Remove all cetegorisation, return a simple list of achievements.
 */
function getAchievementsList() {
    const achievements = [];
    for (let k in gAchievements) {
        const c = gAchievements[k];
        if (c.achievements) {
            achievements.push.apply(achievements, c.achievements);
        }
    }

    return achievements;
}

/*
 * Display achievements as a flat list, sorted by sortfn
 */
function displayList(sortfn, name, filterQuery) {
    hide('achievements_container');
    showLoading();

    if (name !== null) {
        if (name === gSortType) {
            gSortReverse = !gSortReverse;
        }
        gSortType = name;
    }

    const el = document.getElementById('achievements');
    empty(el);

    const achievements = applyFilter(getAchievementsList(), filterQuery);

    achievements.sort(sortfn);
    if (gSortReverse) {
        achievements.reverse();
    }

    buildAchievements(el, achievements, true);

    show('achievements_container');
    hideLoading();
}

function applyFilter(data, query) {
    if (!query) {
        return data;
    }
    query = query.toLowerCase().trim();

    return data.filter(
        achievement => achievement.title.toLowerCase().indexOf(query) >= 0
                    || achievement.description.toLowerCase().indexOf(query) >= 0
                    || ('' + achievement.achievementId).indexOf(query) >= 0
                    || ('' + achievement.categoryId).indexOf(query) >= 0);
}

/*
 * Build a fully categorised structure
 */
function getCategorised() {
    const categorised = JSON.parse(JSON.stringify(gAchievements));

    for (let k in categorised) {
        const c = categorised[k];

        c.achievements.forEach(a => {
            c.pointsToGo = (c.pointsToGo || 0) + a.points;
        });

        if (c.parent) {
            try {
                const p = categorised[c.parent];
                p.points += c.points;
                (p.children = p.children || []).push(c);
                p.pointsToGo = (p.pointsToGo || 0) + (c.pointsToGo || 0);

                delete categorised[k];
            }
            catch (e) {
                console.error('Could not find parent ' + c.parent);
            }
        }
    }
    return categorised;
}

function displayCategorised() {
    gSortType = null;
    gSortReverse = false;

    hide('achievements_container');
    showLoading();
    const el = document.getElementById('achievements');
    empty(el);

    const categorised = getCategorised();
    const keys = new Set(CATEGORY_ORDER);
    Object.keys(categorised).forEach(k => {
        // If new categories have been added that we are not yet aware
        // of then add them to the end.
        keys.add(k);
    });

    keys.forEach(k => {
        const category = categorised[k];
        buildCategory(el, category, 'category');
    });

    show('achievements_container');
    hideLoading();
}

/*
 * baseClassName should be 'category' for top-level (e.g. WoL Campaign),
 * or 'subcategory' for lower-level (e.g. Mar Sara Missions)
 */
function buildCategory(parentEl, category, baseClassName) {
    let childCount = 0;

    const container = document.createElement('div');
    container.className = baseClassName;
    container.id = category.categoryId;

    buildCategoryHeader(container, category, baseClassName);

    const content = document.createElement('div');
    content.className = 'content-container collapsed';

    childCount += buildAchievements(content, category.achievements);

    if (category.children) {
        const children = category.children;
        const len = children.length;
        for (let i = 0; i < len; i++) {
            childCount += buildCategory(content, children[i], 'subcategory');
        }
    }

    if (childCount > 0) {
        container.appendChild(content);
        parentEl.appendChild(container);
    }
    return childCount;
}

function buildCategoryHeader(parentEl, category, baseClassName) {
    const header = document.createElement('div');
    header.className = baseClassName + '-header';
    header.appendChild(createText(category.title, {className: 'title'}));
    buildPointsHeader(header, category);

    header.appendChild(flexSpacer());

    const collapseIcon = getCollapseIcon();
    collapseIcon.addEventListener('click', () => {
        const content = parentEl.querySelector('.content-container');
        const collapsed = content.classList.toggle('collapsed');
        if (collapsed) {
            content.classList.remove('expanded');
            collapseIcon.classList.add('collapsed');
        }
        else {
            content.classList.add('expanded');
            collapseIcon.classList.remove('collapsed');
        }
    });
    header.appendChild(collapseIcon);
    parentEl.appendChild(header);
}

/*
 * - showParents: Show the path of each achievement's parents
 *                e.g. Wings of Liberty/Mar Sara Missions
 */
function buildAchievements(parentEl, achievements, showParents) {
    if (achievements) {
        const len = achievements.length;
        for (let i = 0; i < len; i++) {
            buildAchievement(parentEl, achievements[i], showParents);
        }
        return achievements.length;
    }
    return 0;
}

/*
 * showParents: Show the path of the achievement's parents
 *              e.g. Wings of Liberty/Mar Sara Missions
 */
function buildAchievement(parentEl, achievement, showParents) {
    const container = document.createElement('div');
    container.className = 'achievement';
    container.id = achievement.achievementId;

    // Thumbnail view showing points
    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.appendChild(createText(achievement.points, {className: 'points'}));
    container.appendChild(thumb);

    // Main view showing title, description...
    const main = document.createElement('div');
    main.className = 'content';
    main.appendChild(createText(achievement.title, {className: 'title'}));
    main.appendChild(createText(achievement.description, {className: 'description'}));

    if (showParents) {
        const cat = gAchievements[achievement.categoryId];
        main.appendChild(createText(cat.title, {className: 'parent-category'}));
    }

    container.appendChild(main);
    parentEl.appendChild(container);
}

/*
 * Return an element showing points progress -  points achieved so far
 * and how many there are in total for this category
 *
 * Currently works ok for subcategories but categories are broken
 */
function buildPointsHeader(parentEl, category) {
    const total = category.points;
    if (total == 0) {
        return;
    }
    if (category.pointsToGo) {
        const pointsDone = total - category.pointsToGo;
        const text = pointsDone + '/' + total;
        parentEl.appendChild(createText(text, {className: 'points'}));
    }
}

function empty(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild);
    }
}

function hide() {
    for (let i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).classList.add('hidden');
    }
}

function show() {
    for (let i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).classList.remove('hidden');
    }
}

function showError(message) {
    const error = document.getElementById('error');
    error.classList.add('show-error');

    const errorMessage = error.querySelector('.message');
    empty(errorMessage);
    errorMessage.appendChild(document.createTextNode(message));

    const errorButton = error.querySelector('.button');
    errorButton.addEventListener('click', () => {
        hideError();
        errorButton.removeEventListener('click', () => 0);
    });
}

function hideError(callback) {
    const error = document.getElementById('error');
    error.classList.remove('show-error');
    if (callback) {
        callback();
    }
}

function createText(content, args) {
    const el = document.createElement(args.el || 'div');
    el.appendChild(document.createTextNode(content));
    el.className = args.className || '';
    el.id = args.id || '';
    return el;
}

function flexSpacer() {
    const spacer = document.createElement('div');
    spacer.className = 'spacer';
    return spacer;
}

function getCollapseIcon() {
    const icon = document.createElement('i');
    icon.className = 'material-icons collapse-icon collapsed';
    icon.appendChild(document.createTextNode('expand_less'));
    return icon;
}

function expand(container) {
    const content = container.querySelector('.content-container');
    content.classList.remove('collapsed');
    content.classList.add('expanded');
    container.querySelector('.collapse-icon').classList.remove('collapsed');
}

function collapse(container) {
    const content = container.querySelector('.content-container');
    content.classList.add('collapsed');
    content.classList.remove('expanded');
    container.querySelector('.collapse-icon').classList.add('collapsed');
}

function sortByCategory(a, b) {
    return a.categoryId - b.categoryId;
}

function sortByPoints(a, b) {
    if (a.points === b.points) {
        return sortByTitle(a, b);
    }
    else {
        return b.points - a.points;
    }
}

function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
}

function showDebug(data) {
    const d = document.getElementById('debug');
    empty(d);
    try {
        d.appendChild(document.createTextNode(JSON.stringify(data, null, 2)));
    }
    catch (e) {
        d.appendChild(document.createTextNode(data));
    }
}

function showSortSelection(name) {
    const ids = ['sort_category', 'sort_points', 'sort_title'];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (name === id) {
            document.getElementById(id).classList.add('selected');
        }
        else {
            document.getElementById(id).classList.remove('selected');
        }
    }
}

function getFilter() {
    return document.getElementById('filter').value;
}

document.getElementById('filter').addEventListener('keyup', () => {
    displayList(sortByCategory, null, getFilter());
});
document.getElementById('sort_category').addEventListener('click', () => {
    const f = getFilter();
    if (f) {
        displayList(sortByCategory, 'category', f);
    }
    else {
        displayCategorised();
    }
    showSortSelection('sort_category');
});
document.getElementById('sort_points').addEventListener('click', () => {
    showSortSelection('sort_points');
    displayList(sortByPoints, 'points', getFilter());
});
document.getElementById('sort_title').addEventListener('click', () => {
    showSortSelection('sort_title');
    displayList(sortByTitle, 'title', getFilter());
});
// document.getElementById('expand_all').addEventListener('click', () => {
//     document.querySelectorAll('.category,.subcategory').forEach((category) => {
//         expand(category);
//     });
// });
// document.getElementById('collapse_all').addEventListener('click', () => {
//     document.querySelectorAll('.category,.subcategory').forEach((category) => {
//         collapse(category);
//     });
// });

loadProfile(user);