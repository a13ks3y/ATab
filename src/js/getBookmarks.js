function getBookmarks() {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(tree => {
            let result = tree[0].children[0].children;
            resolve(result);
        });
    });
}
function removeImageFromTitle(title) {
    title = title.substr(0);
    title = title.replace(/Image [0-9]+\:/ig, '');    
    title = title.replace(/Post [0-9]+\:/ig, '');
    return title;
}
exports.getBookmarks = getBookmarks;
exports.removeImageFromTitle = removeImageFromTitle;
