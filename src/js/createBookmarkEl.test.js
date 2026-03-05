const { createBookmarkEl } = require("./createBookmarkEl.js");

describe("Test createBookmarkEl function", () => {
    const bookmark = {
        url: "http://test.com/",
        title: "Bookmark Title"
    };
    const emojiBookmark = {
        url: "http://test.com",
        title: "🦜"
    };
    it("Should create a link element, with href, title and other attrs set", () => {
        const el = createBookmarkEl(bookmark);
        expect(el).toBeInstanceOf(HTMLAnchorElement);
        expect(el.href).toBe(bookmark.url);
        expect(el.title).toBe(bookmark.title);
        expect(el.textContent).toBe(bookmark.title);
    });
    it("Should add bookmark-emoji class to element, if title is a single emoji character", () => {
        const el = createBookmarkEl(emojiBookmark);
        expect(el.classList.contains('bookmark-emoji')).toBe(true);
    });

    it("Should detect a folder even if children array is empty (no url)", () => {
        const emptyFolderString = {
            id: '1',
            title: "Empty FolderString",
            children: [] 
        };
        const el = createBookmarkEl(emptyFolderString);
        expect(el.classList.contains('bookmark-folder')).toBe(true);
        expect(el.getAttribute('href')).toBe('#');
    });

    it("Should detect a folder even if children property is missing but url is missing", () => {
       const folderNoChildren = {
           id: '2',
           title: "Folder No Children",
       };
       const el = createBookmarkEl(folderNoChildren);
       expect(el.classList.contains('bookmark-folder')).toBe(true);
       expect(el.getAttribute('href')).toBe('#');
    });

    // @todo: implement folowing tetsts:
    // it('should handle title.length === 0 situation');
});