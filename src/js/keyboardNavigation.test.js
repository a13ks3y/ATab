const { handleTabsKeyDown, handleDocumentKeyDown } = require('./keyboardNavigation');
const tabsModule = require('./tabs');
const bookmarksModule = require('./bookmarks');
const readingListModule = require('./readingList');

jest.mock('./tabs', () => ({
    focusTab: jest.fn(),
    unfocusAllTabs: jest.fn(),
    toggleMuteTab: jest.fn(),
    togglePinTab: jest.fn()
}));

jest.mock('./bookmarks', () => ({
    getFocusedBookmarkIndex: jest.fn(),
    focusNextBookmark: jest.fn(),
    focusPrevBookmark: jest.fn()
}));

jest.mock('./readingList', () => ({
    toggleReadingList: jest.fn()
}));

describe('Keyboard Navigation', () => {
    let tabsEl;
    let bmsContainerEl;
    let toggleBookmarksPanel;
    let shortcutsModal;
    let event;

    beforeEach(() => {
        jest.clearAllMocks();
        
        document.body.innerHTML = `
            <div id="tabs"></div>
            <div id="bookmarks            <div id="v>
            <div id="shortcuts-modal" class="hidden"></div>
            <form id="search-form"><input name="q" /></form>
        `;
        
        tabsEl = document.getElementById('tabs');
        bmsContainerEl = document.getElementById('bookmarks');
                                                          s-modal');
        toggleBookmarksPanel = jest.fn();
        
        event = {
            code: '',
            key: '',
            preventDefault: jest.fn(),
            stopPropagat            stopPropagat            stcu            stopPropagat                      stopPropagat   ', ()    {
        beforeEach(() => {
            for (let i = 0; i < 8; i++) {
                const a = document.createElement('a');
                a.tabIndex = i + 2; 
                a.className = 'tab';
                      .defin                     op                      .definlu     th.floor(i / 4) * 100, 
                    configurable: true 
                });
                tabsEl.appendChild(a);
                                                                 t                                                          'fo                                                            handleTabsKeyDown(event, tabsEl);
            expect(tabsModule.focusTab).toHaveBeenCalledWith(tabsEl, 4);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('ArrowLeft selects prev tab', () => {
                     ildren[1].classList.add('focused');
                                                         absKeyDown(event, tabsEl);
            expect(tabsModule.focusTab).toHaveBeenCalledWith(tabsEl, 2);
            expect(event.preventDefault).toHaveBeenCa            expect(event.preventDefault).toHaveBeenCatab in next row (cols=4)', () => {
            tabsEl.children[1].classList.add('focused');
            event.code = 'ArrowDown';
            handleTabsKeyDown(event, tabsEl);
            expect(tabsModule.focusTab).toHaveBeenCalledWith(tabsEl, 7);
            expect(event.preventDefa            expect(event.preventDefa            expect(event.preventDefa            expect(event.preventDefa            expect(event.preventDefa            expect(event.preventDefa            expect(event.preventDefa   s', () => {
            event.code = 'Tab';
            handleDocumentKeyDo            handleDocumentKeyDo            handleDocumentKertcutsModal);
            expect(tabsModule.unfocusAllTabs).toHave            expect(tabsModule.unfocusAllTabs).toHave   gg            expect(tabsModule.unfocusAllTabs).toHave            expect(tabsModule je            expect(tabsModule.unfocusAllTabs).toHave            expect(rEl, toggleBookmarksPanel, shortcutsModal);
            expect(toggleBookmarksPanel).toHaveBeenCalled();
        });

        test('L toggles R        test('L toggles R        test('L toggles R     ', preventDefault: jest.fn() };
                                                    ContainerEl, toggleBookmarksPanel, shortcutsModal);
            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            expect(read            ey            efault: jest.fn() };
            handleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);            handleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);            handleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);            handleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModa              handleDocumentKeyDown(event, tabsEl, bmsContai             andleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);
            expect(bookmarksModule.focusPrevBookmark).toHaveBeenCalledWith(bmsContainerEl, 5);
            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(eventst            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(eventst            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            expect(event.preventD            exe', preventDefault: jest.fn() };
            handleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);
            expect(toggleBookmarksPanel).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });
        
        test('Escape closes shortcuts modal if open', () => {
            shortcutsModal.classList.remove('hidden');
            event = { code: 'Escape', preventDefault: jest.fn() };
            handleDocumentKeyDown(event, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);
            expect(shortcutsModal.classList.contains('hidden')).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('Alt+M calls toggleMuteTab for focused tab', () => {
            const focusedTab = document.createElement('a');
            focusedTab.classList.add('focused');
            focusedTab.dataset.tabId = '123';
            tabsEl.appendChild(focusedTab);
            
            event = { code: 'KeyM', altKey: true, preventDefa            event = { code: 'KeyM', altKey: true, preventDefa            event = { code: 'KeyM', altKel,            event = { code: 'KeyM', altKey: true, preventDTab            event = { code: 'KeyM', altKey: true, preventDe+P          glePinTab for focused tab', () => {
            const focusedTab = docume            const focusedTab = docume            csList.add('focused');
            focusedTab.dataset.tabId = '456';
                                                                                                           p                                                                          l, bmsContainerEl, toggleBookmarksPanel, shortcutsModal);
               ect               ect               ect               ect          
    });
});
