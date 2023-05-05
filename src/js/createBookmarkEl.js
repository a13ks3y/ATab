const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;

function createBookmarkEl(bookmark) {
    const el = document.createElement('a');
    el.href = bookmark.url;
    el.title = bookmark.title;
    el.textContent = bookmark.title;
    if (
        (emojiRegex.test(bookmark.title)) && 
        (bookmark.title.length === 1 || bookmark.title.length === 2)
    ) {
        el.classList.add('bookmark-emoji');
    }
    return el;
}
exports.createBookmarkEl = createBookmarkEl;