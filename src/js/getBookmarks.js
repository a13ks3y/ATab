function getBookmarks() {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(tree => {
            const root = tree[0].children[0];
            const subroot = root.children.filter(ch => !ch.children);
            resolve([...subroot]);
        });
    });
}
exports.getBookmarks = getBookmarks;