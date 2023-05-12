// @todo: move it to "mock-chrome-extension-tabs-api.js" ?
window['chrome'] = {tabs: {
    update: () => {},
    remove: () => {}
}};
const {deselectTabs, selectTab} = require("./tabs");
describe('tabs feature', () => {
    let tabs, tabsContainer;

    it('deselect should deselect all tabs', () => {
        tabsContainer = document.createElement('div');
        tabs = [
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
        ];
        tabs[0].classList.add('selected');
        tabs[2].classList.add('selected');

        deselectTabs(tabsContainer);
        expect(tabs[0].classList.contains('selected')).toBeFalsy();
        expect(tabs[1].classList.contains('selected')).toBeFalsy();
        expect(tabs[2].classList.contains('selected')).toBeFalsy();

    });

    it('selectTab should deselect all tabs, then select one', () => {
        tabsContainer = document.createElement('div');
        tabs = [
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
            tabsContainer.appendChild(document.createElement('a')),
        ];
        tabs[0].classList.add('selected');
        tabs[2].classList.add('selected');

        selectTab(tabsContainer, 1);
        // todo: expect unselectTabs function was called with tabsContainer parameter
        expect(tabs[0].classList.contains('selected')).toBeFalsy();
        expect(tabs[1].classList.contains('selected')).toBeTruthy();
        expect(tabs[2].classList.contains('selected')).toBeFalsy();

    });

    // todo: it('closeTab should call tabs.remove function')
    // todo: it('openTab should call tabs.update function')
});
