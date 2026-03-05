// @todo: move it to "mock-chrome-extension-bookmarks-api.js" ?
window['chrome'] = {bookmarks: {
        update: () => {},
        remove: () => {}
    }};
const {unfocusBookmarks, focusBookmark} = require("./bookmarks");
describe('bookmarks feature', () => {
    let bookmarks, bookmarksContainer;

    it('unfocus should unfocus all bookmarks', () => {
        bookmarksContainer = document.createElement('div');
        bookmarks = [
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
        ];
        bookmarks[0].classList.add('focused');
        bookmarks[2].classList.add('focused');

        unfocusBookmarks(bookmarksContainer);
        expect(bookmarks[0].classList.contains('focused')).toBeFalsy();
        expect(bookmarks[1].classList.contains('focused')).toBeFalsy();
        expect(bookmarks[2].classList.contains('focused')).toBeFalsy();

    });

    it('focusBookmark should unfocus all bookmarks, then focus one', () => {
        bookmarksContainer = document.createElement('div');
        bookmarks = [
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
        ];
        bookmarks[0].classList.add('focused');
        bookmarks[2].classList.add('focused');

        focusBookmark(bookmarksContainer, 1);
        // todo: expect unfocusBookmarks function was called with bookmarksContainer parameter
        expect(bookmarks[0].classList.contains('focused')).toBeFalsy();
        expect(bookmarks[1].classList.contains('focused')).toBeTruthy();
        expect(bookmarks[2].classList.contains('focused')).toBeFalsy();

    });

    // todo: it('closeBookmark should call bookmarks.remove function')
    // todo: it('openBookmark should call bookmarks.update function')
});
