function parseProfileUrl() {
    const url = document.getElementById('profile_url').value;
    const regex = /.*?(\w+)\.battle\.net\/?sc2\/(\w+)\/profile\/(\d+)\/(\d+)\/(.*?)\//g;
    const m = regex.exec(url);

    if (m) {
        window.location.href = '/' + m.slice(1).join('/');
        document.getElementById('form_error').classList.add('hidden');
        return false;
    }
    document.getElementById('form_error').classList.remove('hidden');
    return false;
}
