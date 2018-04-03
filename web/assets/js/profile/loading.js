(() => {
    function buildSvg(parentEl, icon, basename) {
        console.log(parentEl);
        basename = basename || 'default';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 240 240');
        svg.setAttribute('class', basename + '-svg ' + (icon.className || ''));

        const paths = icon.paths;
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', basename + '-path ' + (icon.className || ''));
        for (let j = 0; j < paths.length; j++) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', paths[j]);
            group.appendChild(path);
        }
        svg.appendChild(group);
        parentEl.appendChild(svg);
    }

    function buildLoader() {
        const loader = document.getElementById('loader');
        console.log(loader);
        const icons = ['4325379', '4330138', '4325410'];
        for (let i = 0; i < icons.length; i++) {
            const k = icons[i];
            const ic = CATEGORY_ICONS[k]
            buildSvg(loader, ic, 'loader');
        }
    }

    buildLoader();
})();

function showLoading() {
    const loader = document.getElementById('loader');
    loader.classList.add('loading');
}

function hideLoading() {
    const loader = document.getElementById('loader');
    loader.classList.remove('loading');
}