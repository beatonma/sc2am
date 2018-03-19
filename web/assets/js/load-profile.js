let achievements = null;

function loadProfile(params, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/profile');

    xhr.onload = () => {
        if (xhr.status === 200) {
            const profile = JSON.parse(xhr.response);
            achievements = profile.achievements.achievements;
            displayProfile(profile);
        }
        else {
            // TODO show loading error
        }
    };
    const payload = new URLSearchParams();
    for (key in user) {
        payload.append(key, user[key]);
    }
    console.log('request payload: ' + payload);

    xhr.send(payload);
}

function displayProfile(profile) {
    document.getElementById('achievements').innerHTML = JSON.stringify(profile);
}