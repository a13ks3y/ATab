function unfocusBookmarks(bmsEl) {
    const bmEls = bmsEl.querySelectorAll('a');
    for (let bmEl of bmEls) {
        bmEl.classList.remove('focused');
    }
}

function focusBookmark(bmsEl, index) {
    unfocusBookmarks(bmsEl);
    const bmEls = bmsEl.querySelectorAll('a');
    const bmEl = bmEls[index] || bmEls[0];
    bmEl && bmEl.classList.add('focused');
    bmEl && bmEl.focus();

    bmEl && bmEl.scrollIntoView && bmEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });
}

/**
 * Navigate to the next bookmark (supports folder structure)
 * @param {HTMLElement} bmsEl - The bookmarks container
 * @param {number} currentIndex - The current bookmark index
 */
function focusNextBookmark(bmsEl, currentIndex) {
    const bmEls = bmsEl.querySelectorAll('a');
    const nextIndex = currentIndex + 1 >= bmEls.length ? 0 : currentIndex + 1;
    focusBookmark(bmsEl, nextIndex);
}

/**
 * Navigate to the previous bookmark (supports folder structure)
 * @param {HTMLElement} bmsEl - The bookmarks container
 * @param {number} currentIndex - The current bookmark index
 */
function focusPrevBookmark(bmsEl, currentIndex) {
    const bmEls = bmsEl.querySelectorAll('a');
    const prevIndex = currentIndex - 1 < 0 ? bmEls.length - 1 : currentIndex - 1;
    focusBookmark(bmsEl, prevIndex);
}

/**
 * Get the index of the currently focused bookmark
 * @param {HTMLElement} bmsEl - The bookmarks container
 * @returns {number} - The index of the focused bookmark, or -1 if none
 */
function getFocusedBookmarkIndex(bmsEl) {
    const bmEls = bmsEl.querySelectorAll('a');
    for (let i = 0; i < bmEls.length; i++) {
        if (bmEls[i].classList.contains('focused') || document.activeElement === bmEls[i]) {
            return i;
        }
    }
    return -1;
}

exports.focusBookmark = focusBookmark;
exports.unfocusBookmarks = unfocusBookmarks;
exports.focusNextBookmark = focusNextBookmark;
exports.focusPrevBookmark = focusPrevBookmark;
exports.getFocusedBookmarkIndex = getFocusedBookmarkIndex;