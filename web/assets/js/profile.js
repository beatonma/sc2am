(() => {
const CATEGORY_ICONS = {
    // Liberty Campaign
    '4325379': {
        paths: [
            'M 1.2,235.5C 2.2,231.5,44.7,149.5,45.7,149.5C 46.7,149.5,60.7,159.5,60.7,160.5C 60.7,160.5,54.7,173.5,46.7,188.5L 32.7,215.5H 47.7C 55.7,215.5,61.7,215.5,62.7,216.5C 62.7,216.5,60.7,221.5,58.7,226.5L 53.7,236.5H 26.7C 6.2,236.5,1.2,236.5,1.2,235.5Z M 181.7,226.5C 178.7,221.5,176.7,216.5,177.7,216.5C 177.7,215.5,184.7,215.5,192.7,215.5H 206.7L 192.7,188.5C 184.7,172.5,178.7,160.5,178.7,159.5C 179.7,158.5,193.7,149.5,194.7,149.5C 194.7,149.5,198.7,155.5,201.7,162.5C 205.7,170.5,215.7,189.5,223.7,206.5L 238.7,236.5H 212.7H 186.7Z M 66.7,232.5C 66.7,232.5,73.7,219.5,80.7,202.5C 87.7,186.5,93.7,172.5,94.7,171.5C 94.7,170.5,94.7,170.5,92.7,171.5C 91.7,171.5,90.7,172.5,89.7,171.5C 89.7,171.5,89.7,172.5,88.7,174.5C 87.7,177.5,85.7,180.5,82.7,180.5C 81.7,180.5,81.7,179.5,81.7,176.5C 82.7,173.5,82.7,172.5,79.7,171.5C 77.7,169.5,77.7,169.5,74.7,170.5C 70.7,172.5,69.7,174.5,69.7,179.5C 69.7,183.5,69.7,183.5,66.7,180.5C 63.7,177.5,62.7,174.5,63.7,169.5C 65.7,164.5,68.7,161.5,76.7,160.5C 84.7,158.5,88.7,156.5,87.7,154.5C 86.7,154.5,87.7,151.5,89.7,146.5C 92.7,141.5,93.7,139.5,92.7,137.5C 92.7,134.5,90.7,132.5,88.7,132.5C 85.7,132.5,80.7,138.5,77.7,145.5C 75.7,150.5,73.7,153.5,72.7,153.5C 72.7,153.5,64.7,147.5,58.7,141.5C 56.7,140.5,57.7,140.5,59.7,137.5C 61.7,135.5,63.7,132.5,64.7,130.5C 66.7,126.5,66.7,118.5,65.7,116.5C 61.7,112.5,52.7,115.5,45.7,122.5C 41.7,125.5,35.7,136.5,35.7,139.5C 35.7,140.5,35.7,140.5,34.7,139.5C 33.7,139.5,33.7,132.5,33.7,121.5V 102.5H 39.7C 48.7,101.5,52.7,96.5,51.7,87.5C 50.7,83.5,48.7,80.5,42.7,80.5C 38.7,79.5,36.7,80.5,30.7,83.5C 26.7,84.5,23.7,85.5,23.7,84.5C 23.7,84.5,25.7,79.5,28.7,72.5L 33.7,60.6L 68.7,60.5C 86.7,60.5,102.7,60.8,102.7,61.3C 102.7,61.7,100.7,63.1,97.7,64.4C 88.7,69.4,79.7,79.5,81.7,83.5C 82.7,83.5,82.7,83.5,86.7,81.5C 90.7,78.5,95.7,75.5,96.7,77.5C 96.7,77.5,95.7,79.5,93.7,81.5L 90.7,84.5H 93.7C 96.7,84.5,96.7,84.5,96.7,86.5C 94.7,92.5,94.7,93.5,96.7,95.5C 100.7,97.5,108.7,93.5,106.7,89.5C 106.7,87.5,103.7,87.5,101.7,90.5C 99.7,93.5,98.7,91.5,98.7,86.5C 98.7,83.5,99.7,82.5,100.7,81.5C 102.7,80.5,103.7,79.5,104.7,79.5C 104.7,79.5,107.7,77.5,109.7,76.5C 116.7,72.5,126.7,72.5,129.7,75.5C 131.7,77.5,132.7,80.5,132.7,82.5C 133.7,83.5,133.7,86.5,133.7,88.5C 134.7,92.5,137.7,95.5,142.7,94.5C 145.7,94.5,146.7,90.5,143.7,88.5C 141.7,85.5,142.7,84.5,146.7,84.5H 148.7L 145.7,81.5C 144.7,79.5,143.7,77.5,143.7,77.5C 144.7,75.5,149.7,78.5,153.7,81.5C 158.7,85.5,159.7,83.5,156.7,78.5C 154.7,73.5,146.7,66.5,140.7,63.7C 138.7,62.8,137.7,61.8,137.7,61.3C 137.7,60.8,152.7,60.6,171.7,60.7L 204.7,61.0L 210.7,72.5C 213.7,79.5,215.7,84.5,215.7,84.5C 215.7,85.5,212.7,84.5,208.7,83.5C 200.7,78.5,194.7,78.5,190.7,82.5C 188.7,84.5,187.7,85.5,187.7,89.5C 187.7,97.5,193.7,103.5,201.7,102.5L 204.7,101.5V 120.5C 204.7,138.5,204.7,144.5,202.7,137.5C 200.7,126.5,188.7,114.5,179.7,114.5C 170.7,114.5,170.7,126.5,178.7,136.5L 182.7,140.5L 179.7,143.5C 172.7,149.5,166.7,153.5,166.7,153.5C 166.7,153.5,164.7,149.5,162.7,145.5C 156.7,134.5,150.7,129.5,147.7,134.5C 145.7,137.5,146.7,142.5,150.7,147.5C 151.7,150.5,152.7,152.5,152.7,154.5C 151.7,157.5,154.7,159.5,160.7,160.5C 166.7,160.5,173.7,163.5,174.7,166.5C 176.7,169.5,175.7,176.5,173.7,179.5C 170.7,183.5,169.7,183.5,169.7,178.5C 169.7,175.5,168.7,174.5,166.7,172.5C 162.7,169.5,162.7,169.5,159.7,171.5C 157.7,172.5,157.7,173.5,157.7,176.5C 158.7,180.5,158.7,180.5,156.7,180.5C 153.7,180.5,151.7,177.5,150.7,174.5C 150.7,172.5,149.7,171.5,149.7,172.5C 148.7,172.5,147.7,172.5,146.7,171.5C 146.7,170.5,145.7,170.5,145.7,170.5C 145.7,171.5,151.7,185.5,159.7,202.5C 166.7,219.5,172.7,232.5,172.7,233.5C 171.7,233.5,169.7,232.5,166.7,231.5C 159.7,227.5,153.7,226.5,144.7,226.5C 139.7,227.5,134.7,227.5,133.7,228.5C 131.7,228.5,130.7,228.5,125.7,216.5L 119.7,205.5L 114.7,216.5C 109.7,227.5,108.7,228.5,106.7,227.5C 105.7,227.5,100.7,227.5,95.7,226.5C 85.7,226.5,77.7,227.5,70.7,231.5C 67.7,233.5,66.7,233.5,66.7,232.5Z M 95.7,51.0C 95.7,49.4,119.7,3.5,119.7,3.5C 120.7,3.5,144.7,49.1,144.7,50.7C 144.7,51.2,139.7,51.5,134.7,51.5H 123.7L 121.7,48.3L 120.7,45.0L 118.7,48.3L 117.7,51.5H 106.7C 100.7,51.5,95.7,51.3,95.7,51.0Z',
        ],
        className: 'terran',
    },
    // Swarm Campaign
    '4325410': {
        paths: [
            'M 61.0,234.0C 49.0,229.0,38.0,220.0,33.0,207.0C 31.0,196.0,40.0,215.0,45.0,215.0C 56.0,221.0,75.0,227.0,82.0,213.0C 90.0,204.0,80.0,188.0,69.0,189.0C 58.0,193.0,60.0,207.0,65.0,214.0C 51.0,210.0,44.0,195.0,44.0,181.0C 41.0,173.0,52.0,182.0,56.0,176.0C 62.0,173.0,56.0,167.0,55.0,162.0C 43.0,158.0,36.0,176.0,37.0,186.0C 38.0,191.0,37.0,201.0,34.0,191.0C 29.0,182.0,25.0,169.0,31.0,159.0C 29.0,153.0,32.0,141.0,39.0,150.0C 53.0,153.0,52.0,126.0,38.0,132.0C 26.0,136.0,22.0,149.0,19.0,160.0C 16.0,152.0,18.0,140.0,21.0,131.0C 24.0,123.0,28.0,116.0,34.0,110.0C 38.0,114.0,48.0,122.0,51.0,113.0C 58.0,98.0,37.0,94.0,29.0,102.0C 23.0,106.0,18.0,117.0,13.0,119.0C 16.0,100.0,27.0,84.0,43.0,75.0C 48.0,72.0,56.0,71.0,51.0,79.0C 49.0,89.0,65.0,95.0,67.0,83.0C 75.0,73.0,55.0,63.0,46.0,64.0C 40.0,62.0,25.0,68.0,22.0,67.0C 29.0,61.0,35.0,55.0,44.0,52.0C 55.0,47.0,68.0,44.0,79.0,48.0C 78.0,53.0,73.0,67.0,84.0,68.0C 100.0,68.0,98.0,50.0,90.0,41.0C 82.0,31.0,68.0,29.0,57.0,25.0C 76.0,11.0,104.0,17.0,121.0,33.0C 128.0,41.0,103.0,44.0,114.0,55.0C 125.0,64.0,138.0,52.0,136.0,40.0C 137.0,28.0,131.0,17.0,122.0,9.2C 121.0,7.2,113.0,2.2,119.0,3.2C 129.0,3.2,136.0,9.2,144.0,13.0C 155.0,22.0,163.0,34.0,167.0,47.0C 159.0,45.0,145.0,57.0,155.0,63.0C 166.0,70.0,175.0,62.0,177.0,51.0C 179.0,40.0,177.0,29.0,175.0,18.0C 186.0,27.0,192.0,42.0,198.0,55.0C 199.0,63.0,200.0,74.0,195.0,80.0C 188.0,73.0,175.0,77.0,181.0,87.0C 184.0,100.0,201.0,89.0,203.0,81.0C 207.0,73.0,207.0,63.0,208.0,53.0C 214.0,64.0,217.0,77.0,214.0,90.0C 212.0,97.0,209.0,111.0,203.0,113.0C 190.0,98.0,185.0,131.0,200.0,124.0C 214.0,119.0,219.0,103.0,226.0,91.0C 227.0,103.0,224.0,116.0,221.0,127.0C 212.0,142.0,202.0,158.0,189.0,171.0C 181.0,178.0,164.0,200.0,158.0,197.0C 138.0,188.0,115.0,183.0,100.0,165.0C 92.0,158.0,87.0,146.0,88.0,135.0C 88.0,122.0,94.0,110.0,105.0,102.0C 114.0,97.0,127.0,98.0,134.0,104.0C 142.0,113.0,144.0,127.0,135.0,136.0C 131.0,142.0,121.0,145.0,128.0,135.0C 135.0,123.0,108.0,117.0,110.0,132.0C 109.0,142.0,117.0,155.0,129.0,154.0C 144.0,154.0,156.0,139.0,156.0,124.0C 158.0,112.0,152.0,100.0,146.0,92.0C 137.0,85.0,127.0,80.0,115.0,82.0C 105.0,85.0,93.0,89.0,88.0,98.0C 82.0,105.0,76.0,113.0,75.0,122.0C 71.0,131.0,73.0,142.0,73.0,152.0C 79.0,160.0,77.0,173.0,87.0,179.0C 95.0,186.0,104.0,193.0,114.0,198.0C 121.0,205.0,135.0,206.0,141.0,212.0C 133.0,220.0,123.0,224.0,113.0,228.0C 103.0,233.0,91.0,236.0,79.0,236.0C 73.0,236.0,67.0,236.0,61.0,234.0Z',
        ],
        className: 'zerg',
    },
    // Void Campaign
    '4330138': {
        paths: [
            'M 69.3,230.2C 61.3,217.2,57.3,191.2,61.3,173.2C 62.3,165.2,68.3,152.2,71.3,150.2C 73.3,148.2,73.3,148.2,76.3,151.2C 81.3,155.2,83.3,156.2,88.3,156.2C 94.3,156.2,98.3,152.2,100.3,142.2C 100.3,137.2,99.3,131.2,95.3,124.2C 91.3,114.2,85.3,110.2,76.3,110.2H 71.3V 57.2C 71.3,28.2,71.3,4.7,72.3,4.7C 72.3,4.7,74.3,7.7,75.3,12.2C 78.3,25.2,87.3,41.2,95.3,50.2C 103.3,59.2,110.3,70.2,110.3,71.2C 110.3,73.2,109.3,73.2,107.3,71.2C 105.3,70.2,100.3,69.2,97.3,70.2C 91.3,72.2,91.3,83.2,96.3,94.2C 101.3,104.2,109.3,109.2,115.3,104.2C 119.3,101.2,120.3,92.2,116.3,83.2C 115.3,81.2,115.3,79.2,115.3,79.2C 116.3,77.2,120.3,79.2,125.3,82.2C 134.3,88.2,140.3,100.2,140.3,110.2V 115.2L 138.3,113.2C 131.3,107.2,124.3,117.2,131.3,124.2C 134.3,127.2,142.3,127.2,149.3,123.2C 158.3,119.2,163.3,109.2,164.3,94.2C 164.3,83.2,162.3,71.2,156.3,65.2C 155.3,65.2,155.3,63.2,155.3,63.2C 157.3,62.2,170.3,76.2,173.3,83.2C 178.3,91.2,179.3,101.2,179.3,113.2C 178.3,123.2,174.3,138.2,171.3,141.2C 170.3,142.2,169.3,144.2,169.3,146.2C 169.3,148.2,168.3,150.2,167.3,152.2C 165.3,153.2,164.3,156.2,164.3,157.2C 164.3,159.2,163.3,161.2,161.3,164.2C 159.3,165.2,157.3,167.2,157.3,168.2C 156.3,173.2,142.3,189.2,130.3,197.2C 122.3,204.2,108.3,212.2,107.3,211.2C 107.3,210.2,108.3,208.2,110.3,205.2C 119.3,192.2,119.3,179.2,110.3,174.2C 102.3,171.2,90.3,181.2,82.3,196.2C 76.3,208.2,75.3,215.2,75.3,226.2C 75.3,232.2,74.3,235.2,73.3,235.2C 73.3,235.2,71.3,233.2,69.3,230.2Z M 78.3,144.2C 74.3,141.2,71.3,137.2,71.3,132.2C 71.3,129.2,72.3,127.2,74.3,124.2C 77.3,122.2,79.3,121.2,82.3,121.2C 87.3,121.2,91.3,123.2,93.3,127.2C 95.3,132.2,95.3,133.2,94.3,137.2C 91.3,143.2,84.3,146.2,78.3,144.2Z',
        ],
        className: 'protoss',
    },
    // Mission Packs
    '4364473': {
        paths: [
            'M 83.25,200.95L 47.25,165.95V 151.95C 47.25,141.95,47.25,138.95,49.25,137.95C 50.25,135.95,50.25,132.95,49.25,130.95C 47.25,128.95,47.25,120.95,47.25,78.85V 28.75L 60.25,24.05C 68.25,21.55,75.25,19.45,76.25,19.45 77.25,19.45,79.25,18.85,80.25,18.05C 81.25,17.35,90.25,13.85,101.75,10.45L 120.75,4.05L 148.75,13.449999999999998C 163.75,18.549999999999997,179.75,24.049999999999997,184.75,25.65L 192.75,28.65V 97.25V 165.95L 156.75,200.95C 137.75,219.95,120.75,235.95,120.75,235.95C 119.75,235.95,102.75,219.95,83.25,200.95Z M 151.75,180.95L 180.75,150.95V 129.95V 109.95L 178.75,113.95C 177.75,115.95,174.75,124.95,172.75,131.95L 168.75,145.95L 145.75,169.95C 132.75,182.95,121.75,193.95,121.75,193.95C 120.75,193.95,109.75,182.95,97.25,168.95L 74.25,144.95V 96.25L 75.25,48.05L 98.25,39.849999999999994L 120.75,31.549999999999997L 142.75,39.949999999999996C 155.75,44.55,165.75,48.55,166.75,48.949999999999996C 168.75,49.55,168.75,51.349999999999994,168.75,66.35000000000001V 82.95L 161.75,86.95L 155.75,90.85000000000001V 99.95C 155.75,108.95,155.75,108.95,152.75,109.95C 151.75,110.95,143.75,113.95,135.75,117.95C 123.75,122.95,121.75,123.95,119.75,122.95C 118.75,121.95,111.75,114.95,103.75,107.95C 94.25,99.95,87.25,93.45,85.25,92.05L 83.25,90.15V 106.95V 123.95L 98.25,139.95C 106.75,148.95,115.75,157.95,117.75,159.95L 121.75,163.95L 144.75,142.95C 162.75,125.95,168.75,119.95,173.75,112.95L 180.75,102.95V 71.75V 39.849999999999994L 150.75,29.15L 121.75,18.449999999999996L 91.25,29.15L 61.25,39.849999999999994V 95.45V 150.95L 90.25,180.95C 106.75,197.95,120.75,211.95,121.75,211.95C 121.75,211.95,135.75,197.95,151.75,180.95Z M 113.75,82.95L 121.75,78.35000000000001L 130.75,83.05C 134.75,85.55,138.75,87.45,139.75,87.15C 139.75,86.95,138.75,83.65,137.75,79.95C 135.75,76.25,134.75,72.75,134.75,72.05C 134.75,71.45,138.75,68.65,142.75,65.95L 149.75,60.95L 139.75,60.45L 129.75,59.95L 125.75,50.75C 123.75,45.65,121.75,41.45,121.75,41.45C 121.75,41.45,119.75,45.65,117.75,50.65L 113.75,59.95L 103.75,60.45L 94.25,60.95L 101.75,65.85C 105.75,68.55,108.75,71.35,108.75,71.95C 108.75,72.55,107.75,75.95,106.75,79.45C 103.75,86.15,103.75,87.45,104.75,87.45C 104.75,87.45,108.75,85.45,113.75,82.95Z',
        ],
        className: 'terran-dominion',
    },
    // Co-op Missions
    '4386911': {
        paths: [
            'M 36.1,15.3 L 80.9,5.77 L 110,15.3 V 234 C 92.8,226 77.4,214 64.4,197 V 194 V 44.8 C 64.3,30.2 50.9,22.4 36.1,15.3 Z',
            'M 204,14.5 L 159,5.94 L 131,14.5 V 234 C 147,226 162,214 175,196 V 195 V 45.3 C 176,29.9 189,23 204,14.5 Z',
        ],
        className: 'coop',
    },
    // Versus
    '4325377': {
        paths: [
            'M 121.2,4.5L 15.9,58.5V 180.85L 121.2,235.85L 224.2,180.85V 59.5Z M 121.2,32.5L 141.2,90.65L 198.2,90.65L 151.2,124.5L 170.2,179.85L 121.2,146.85L 73.8,179.85L 91.8,124.5L 43.8,90.65H 102.2Z',
        ],
        className: 'versus',
    }
};

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

let gAchievements = null;
let gSortType = null;
let gSortReverse = false;


function loadProfile(params, callback) {
    show('loading');
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
            hide('loading');
            showError('Unable to load data [' + xhr.status + '] - please try again');
        }
    };
    xhr.onerror = err => {
        hide('loading');
        showError('Unable to load data [' + xhr.status + '] - please try again');
        console.error('LOADING ERROR: ' + err);
    }
    const payload = new URLSearchParams();
    for (key in user) {
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
function displayList(sortfn, name) {
    hide('achievements_container');
    show('loading');

    if (name === gSortType) {
        gSortReverse = !gSortReverse;
    }
    gSortType = name;

    const el = document.getElementById('achievements');
    empty(el);

    const achievements = getAchievementsList();
    achievements.sort(sortfn);
    if (gSortReverse) {
        achievements.reverse();
    }

    buildAchievements(el, achievements);
    console.log('built ' + achievements.length + ' achievements');

    show('achievements_container');
    hide('loading');
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
    show('loading');
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
    hide('loading');
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

    if (baseClassName === 'category' && category.parent) {
        // DEBUG ONLY
        header.appendChild(createText(category.parent, {className: 'debug-warning'}));
    }
    header.appendChild(createText(category.categoryId, {className: 'debug-warning'}));
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
 * Args may contain:
 *     - showParents: Show the path of each achievement's parents
 *                    e.g. Wings of Liberty/Mar Sara Missions
 */
function buildAchievements(parentEl, achievements, args) {
    if (achievements) {
        const len = achievements.length;
        for (let i = 0; i < len; i++) {
            buildAchievement(parentEl, achievements[i]);
        }
        return achievements.length;
    }
    return 0;
}

/*
 * showParents: Show the path of the achievement's parents
 *              e.g. Wings of Liberty/Mar Sara Missions
 */
function buildAchievement(parentEl, achievement) {
    const container = document.createElement('div');
    container.className = 'achievement';

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

function showLoading() {
    const loading = document.getElementById('loading');

}

function hideLoading() {
    const loading = document.getElementById('loading');
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


document.getElementById('sort_category').addEventListener('click', () => {
    displayCategorised();
    showSortSelection('sort_category');
});
document.getElementById('sort_points').addEventListener('click', () => {
    showSortSelection('sort_points');
    displayList(sortByPoints, 'points');
});
document.getElementById('sort_title').addEventListener('click', () => {
    showSortSelection('sort_title');
    displayList(sortByTitle, 'title');
});
document.getElementById('expand_all').addEventListener('click', () => {
    document.querySelectorAll('.category,.subcategory').forEach((category) => {
        expand(category);
    });
});
document.getElementById('collapse_all').addEventListener('click', () => {
    document.querySelectorAll('.category,.subcategory').forEach((category) => {
        collapse(category);
    });
});

loadProfile(user);
setTimeout(() => {
    showError('This is a testing error');
}, 1000);
})();