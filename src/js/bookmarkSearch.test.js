const {createTabEl} = require('./createTabEl.js');

describe('Bookmark Search Integration', () => {
    it('should render a bookmark as a tab with is-bookmark class', () => {
        const bookmarkMock = {
            id: 'bm-123',
            title: 'Bookmark Title',
            url: 'https://example.com',
            isBookmark: true,
            favIconUrl: 'chrome://favicon/https://example.com'
        };
        const tabEl = createTabEl(bookmarkMock);
        expect(tabEl).toBeInstanceOf(HTMLElement);
        expect(tabEl.id).toEqual('bookmark-bm-123'); // Should match the ID logic
        expect(tabEl.classList.contains('is-bookmark')).toBe(true);
        expect(tabEl.getAttribute('data-is-bookmark')).toBe('true');
        
        // Should not have close buttons
        const closeBtnEl = tabEl.querySelector('.close-btn');
        expect(closeBtnEl).toBeNull();
        
        const closeOthersBtnEl = tabEl.querySelector('.close-others-btn');
        expect(closeOthersBtnEl).toBeNull();

        // Should have bookmark indicator
        const indicator = tabEl.querySelector('.bookmark-indicator');
        expect(indicator).not.toBeNull();
        expect(indicator.innerHTML).toBe('★');
    });

    it('should not include drag-and-drop logic for bookmarks', () => {
        const bookmarkMock = {
            id: 'bm-123',
            title: 'Bookmark Title',
            url: 'https://example.com',
            isBookmark: true
        };
        const tabEl = createTabEl(bookmarkMock);
        
        // Assuming draggable attribute is not set if skipped
        expect(tabEl.draggable).toBe(false);
    });
});
