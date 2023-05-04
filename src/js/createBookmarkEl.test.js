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
    // @todo: implement folowing tetsts:
    // it('should handle title.length === 0 situation');
});