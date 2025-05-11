const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;

function createBookmarkEl(bookmark) {
    const el = document.createElement('a');
    if (bookmark.title === ' ') bookmark.title = '🤷';
    
    // Check if it's a folder (has children)
    const isFolder = bookmark.children && bookmark.children.length > 0;
    
    // For folders, we'll set a special class and prepend a folder icon
    if (isFolder) {
        el.classList.add('bookmark-folder');
        el.innerHTML = '📁 ' + bookmark.title;
        // For folders, we don't want to navigate when clicked
        el.href = '#';
        // We could implement folder expansion here in the future
    } else {
        el.href = bookmark.url || '#';
        el.innerHTML = bookmark.title;
    }
    
    el.title = bookmark.title;
    
    if (
        (emojiRegex.test(bookmark.title)) && 
        (bookmark.title.length === 1 || bookmark.title.length === 2)
    ) {
        el.classList.add('bookmark-emoji');
    }
    
    return el;
}
exports.createBookmarkEl = createBookmarkEl;