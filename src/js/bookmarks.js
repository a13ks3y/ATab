function unselectBookmarks(bmsEl) {
    const bmEls = bmsEl.querySelectorAll('a');
    for (let bmEl of bmEls) {
        bmEl.classList.remove('selected');
    }
}

function selectBookmark(bmsEl, index) {
    unselectBookmarks(bmsEl);
    const bmEls = bmsEl.querySelectorAll('a');
    const bmEl = bmEls[index] || bmEls[0];
    bmEl && bmEl.classList.add('selected');
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
function selectNextBookmark(bmsEl, currentIndex) {
    const bmEls = bmsEl.querySelectorAll('a');
    const nextIndex = currentIndex + 1 >= bmEls.length ? 0 : currentIndex + 1;
    selectBookmark(bmsEl, nextIndex);
}

/**
 * Navigate to the previous bookmark (supports folder structure)
 * @param {HTMLElement} bmsEl - The bookmarks container
 * @param {number} currentIndex - The current bookmark index
 */
function selectPrevBookmark(bmsEl, currentIndex) {
    const bmEls = bmsEl.querySelectorAll('a');
    const prevIndex = currentIndex - 1 < 0 ? bmEls.length - 1 : currentIndex - 1;
    selectBookmark(bmsEl, prevIndex);
}

/**
 * Get the index of the currently selected bookmark
 * @param {HTMLElement} bmsEl - The bookmarks container
 * @returns {number} - The index of the selected bookmark, or -1 if none
 */
function getSelectedBookmarkIndex(bmsEl) {
    const bmEls = bmsEl.querySelectorAll('a');
    for (let i = 0; i < bmEls.length; i++) {
        if (bmEls[i].classList.contains('selected') || document.activeElement === bmEls[i]) {
            return i;
        }
    }
    return -1;
}

exports.selectBookmark = selectBookmark;
exports.unselectBookmarks = unselectBookmarks;
exports.selectNextBookmark = selectNextBookmark;
exports.selectPrevBookmark = selectPrevBookmark;
exports.getSelectedBookmarkIndex = getSelectedBookmarkIndex;