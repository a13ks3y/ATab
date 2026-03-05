const { initFolderHandlers } = require('./bookmarkFolders.js');

describe('bookmarkFolders', () => {
    let containerEl;
    let bookmarks;
    let renderFunction;

    beforeEach(() => {
        containerEl = document.createElement('div');
        bookmarks = [];
        renderFunction = jest.fn();
    });

    it('should add selected class on mouseover', () => {
        const link = document.createElement('a');
        link.textContent = 'Bookmark';
        containerEl.appendChild(link);

        initFolderHandlers(containerEl, bookmarks, renderFunction);

        // Simulate mouseover
        const event = new MouseEvent('mouseover', {bubbles: true});
        link.dispatchEvent(event);

        expect(link.classList.contains('focused')).toBe(true);
    });

    it('should handle click on folder', () => {
        const folderLink = document.createElement('a');
        folderLink.classList.add('bookmark-folder');
        folderLink.textContent = 'Folder';
        folderLink.dataset.bookmarkId = '1';
        containerEl.appendChild(folderLink);

        const bookmark = { id: '1', title: 'Folder', children: [] };
        bookmarks.push(bookmark);

        initFolderHandlers(containerEl, bookmarks, renderFunction);

        // Expect renderFunction to be called or toggle logic to execute?
        // toggleFolder modifies expandedFolders map.
        // It's internal to module.
        // But we can check aria-expanded attribute change?
        
        // Mock toggleFolder if imported? No, it's defined in same file.
        // Since toggleFolder modifies DOM and map, we can check DOM.
        
        const clickEvent = new MouseEvent('click', {bubbles: true, cancelable: true});
        folderLink.dispatchEvent(clickEvent);
        
        // After click, aria-expanded should be 'true' (toggled from false/undefined)
        expect(folderLink.getAttribute('aria-expanded')).toBe('true');
    });
});
