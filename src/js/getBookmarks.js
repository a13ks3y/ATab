function getBookmarks() {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(tree => {
            const root = tree[0].children[0];
            const subroot = root.children.filter(ch => !ch.children);
            const subfolders = root.children.filter(ch => ch.children);
            let result = [...subroot];
            subfolders.forEach(subfolder => {
                result = [...result, ...subfolder.children.filter(ch => !ch.children)];
            });
            result = result.map(bm => ({...bm, title: removeImageFromTitle(bm.title)}));
            resolve(result);
        });
    });
}
function removeImageFromTitle(title) {
    title = title.substr();
    title = title.replace(/Image [0-9]+\:/ig, '');    
    title = title.replace(/Post [0-9]+\:/ig, '');
    return title;
}
exports.getBookmarks = getBookmarks;
exports.removeImageFromTitle = removeImageFromTitle;