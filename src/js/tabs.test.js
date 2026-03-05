// @todo: move it to "mock-chrome-extension-tabs-api.js" ?
window['chrome'] = {tabs: {
    update: () => {},
    remove: () => {}
}};
const {unfocusAllTabs, focusTab} = require("./tabs");
describe('tabs feature', () => {
    let tabs, tabsContainer;

    it('unfocus should unfocus all tabs', () => {
        tabsContainer = document.createElement('div');
        tabs = [
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
        ];
        tabs[0].classList.add('focused');
        tabs[2].classList.add('focused');

        unfocusAllTabs(tabsContainer);
        expect(tabs[0].classList.contains('focused')).toBeFalsy();
        expect(tabs[1].classList.contains('focused')).toBeFalsy();
        expect(tabs[2].classList.contains('focused')).toBeFalsy();
        // @todo: expect(tabs[0].blur).hasBeenCalled();
        // @todo: expect(tabs[1].blur).hasBeenCalled();
    });

    it('focusTab should unfocus all tabs, then focus one', () => {
        tabsContainer = document.createElement('div');
        tabs = [
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
        ];
        tabs[0].classList.add('focused');
        tabs[1].tabIndex = 27;
        tabs[2].classList.add('focused');

        focusTab(tabsContainer, 27);
        // todo: expect unfocusTabs function was called with tabsContainer parameter
        expect(tabs[0].classList.contains('focused')).toBeFalsy();
        expect(tabs[1].classList.contains('focused')).toBeTruthy();
        expect(tabs[2].classList.contains('focused')).toBeFalsy();
        // todo: expect(tabs[1].focus).hasBeenCalled();
    });

    // todo: it('closeTab should call tabs.remove function')
    // todo: it('openTab should call tabs.update function')
});
