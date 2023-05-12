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
    bmEl.focus();
    bmEl && bmEl.scrollIntoView && bmEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    });
}

exports.selectBookmark = selectBookmark;
exports.unselectBookmarks = unselectBookmarks;