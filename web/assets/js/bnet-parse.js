function parseProfileUrl() {
    const url = document.getElementById('profile_url').value;
    const regex = /.*?(\w+)\.battle\.net\/?sc2\/(\w+)\/profile\/(\d+)\/(\d+)\/(.*?)\//g;
    const m = regex.exec(url);

    if (m) {
        window.location.href = '/' + m.slice(1).join('/');
        return false;
    }
    // TODO show error message
    console.log('NOPE');
    return false;
}