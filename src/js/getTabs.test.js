require('./getTabs.js');
const {getTabs} = require("./getTabs");

describe('getTabs function', () => {
    it('should return at least one tab', async () => {
        chrome.tabs.query.mockImplementation((o, c) => c([{}]));
        const tabs = await getTabs();
        expect(tabs.length).toBeGreaterThan(0);
    });
    // todo: implement tests:
    // it('should return only NOT active tabs', () => {})
    // it('should return tabs for current window only')
});
