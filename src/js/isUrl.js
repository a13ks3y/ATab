function isUrl(value) {
    try {
        if (value.substr(0, 3) === 'www') return true;
        new URL(value);
        return true;
    } catch (e) {
        return false;
    }
}

exports.isUrl = isUrl;