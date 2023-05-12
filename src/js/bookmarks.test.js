// @todo: move it to "mock-chrome-extension-bookmarks-api.js" ?
window['chrome'] = {bookmarks: {
        update: () => {},
        remove: () => {}
    }};
const {unselectBookmarks, selectBookmark} = require("./bookmarks");
describe('bookmarks feature', () => {
    let bookmarks, bookmarksContainer;

    it('unselect should unselect all bookmarks', () => {
        bookmarksContainer = document.createElement('div');
        bookmarks = [
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
        ];
        bookmarks[0].classList.add('selected');
        bookmarks[2].classList.add('selected');

        unselectBookmarks(bookmarksContainer);
        expect(bookmarks[0].classList.contains('selected')).toBeFalsy();
        expect(bookmarks[1].classList.contains('selected')).toBeFalsy();
        expect(bookmarks[2].classList.contains('selected')).toBeFalsy();

    });

    it('selectBookmark should unselect all bookmarks, then select one', () => {
        bookmarksContainer = document.createElement('div');
        bookmarks = [
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
            bookmarksContainer.appendChild(document.createElement('a')),
        ];
        bookmarks[0].classList.add('selected');
        bookmarks[2].classList.add('selected');

        selectBookmark(bookmarksContainer, 1);
        // todo: expect unselectBookmarks function was called with bookmarksContainer parameter
        expect(bookmarks[0].classList.contains('selected')).toBeFalsy();
        expect(bookmarks[1].classList.contains('selected')).toBeTruthy();
        expect(bookmarks[2].classList.contains('selected')).toBeFalsy();

    });

    // todo: it('closeBookmark should call bookmarks.remove function')
    // todo: it('openBookmark should call bookmarks.update function')
});
