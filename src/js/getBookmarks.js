function getBookmarks() {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(tree => {
            try {
                let result = tree[0].children[0].children;
                resolve(result);    
            } catch (e) {
                console.error(e);
                resolve(tree);
            }
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
