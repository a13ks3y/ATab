const {createTabEl} = require('./createTabEl.js');
describe('Create Tab Element Function', () => {
    it('should render a tab', () => {
        const tabMock = {
            id: Math.random(),
            title: 'Tab Title',
            favIconUrl: 'https://placehold.it/32x32'
        };
        const tabEl = createTabEl(tabMock);
        expect(tabEl).toBeInstanceOf(HTMLElement);
        expect(tabEl.id).toEqual('tab-' + tabMock.id);
        const tabImgEl = tabEl.querySelector('img');
        expect(tabImgEl.src).toEqual(tabMock.favIconUrl);

        const closeBtnEl = tabEl.querySelector('button');
        expect(closeBtnEl).toBeInstanceOf(HTMLButtonElement);
        // todo: test clicking on the closeBtn, closeTab callback should be triggered
    });
    it('tab element title attribute should be set', () => {
        const tabEl = createTabEl({title: 'The Title'});
        expect(tabEl.title).toEqual('The Title');
    });
    it('should render a tab with title if no favicon', () => {
        const tabMock = {
            title: 'Tab Title',
        };
        const tabEl = createTabEl(tabMock);
        expect(tabEl.textContent.search(tabMock.title)).not.toBe(-1);
    });
    it('should replace favicon for chrome://newtab/ url', () => {
        const tabMock = {
            url: "chrome://newtab/"
        };
        const tabEl = createTabEl(tabMock);
        const tabImgEl = tabEl.querySelector('img');
        expect(tabImgEl.src).toEqual('http://localhost/icons/ATab-128x128.png');
    });
});
