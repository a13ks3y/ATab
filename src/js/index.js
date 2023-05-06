import '../css/reset.css';
import '../css/index.css';
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';
import { renderTabs } from './renderTabs.js';
import { getTabs } from './getTabs.js';
import { isUrl } from './isUrl.js';


if (!(window['chrome'] && window['chrome']['tabs'])) {
    throw new Error("THIS CODE SHOULD RUN ONLY AS CHROME EXTENSION!!!");
}

const state = {
    context: 'tabs', // or 'bookmarks'
    selectedTabIndex: -1,     // currently selected tab index. -1 for no selection.
    selectedBmIndex: -1,  // currently selected bookmark folder index. -1 for no selection.
    isFolderSelection: () => (state.selectedTabIndex === -1 && state.selectedBmIndex !== -1),
    isTabSelction: () => (state.selectedBmIndex === -1 && state.selectedTabIndex !== -1)
};
  

function openTab(tab) {
    if (!tab || !tab.id) return;
    window.chrome.tabs.update(Number(tab.id), {active: true});
}

function closeTab(tab) {
    if (!tab || !tab.id) return;
    window.chrome.tabs.remove(Number(tab.id));
}
function deselectTabs() {
    state.selectedTabIndex = -1; // Important!
    const els = Array.from(document.querySelectorAll('#tabs a'));
    els.forEach(tabEl => tabEl.classList.remove('selected'));
}
function selectTab(selectedTabIndex = 0) {
    const els = Array.from(document.querySelectorAll('#tabs a'));
    // remove selected class from all tab elements
    deselectTabs();
    // add selected class to the selected tab element
    const selectedTabEl = els[selectedTabIndex] ? els[selectedTabIndex] : els[0];

    // @todo: path state as parameter (kind of DI), better for Unit-testing
    state.selectedTabIndex = els[selectedTabIndex] ? selectedTabIndex : 0;

    if (selectedTabEl) {
        selectedTabEl.classList.add('selected');        
    }
}

document.addEventListener('readystatechange', async () => {
    const tabsEl = document.getElementById('tabs');
    const bmsEl = document.querySelector('#bookmarks div');    
    function selectBookmark(index) {
        deselectTabs();
        const bmEls = document.querySelectorAll('#bookmarks div a');
        for (let bmEl of bmEls) {
            bmEl.classList.remove('selected');
        }
        const bmEl = bmEls[index] || bmEls[0];
        state.selectedBmIndex = bmEls[index] ? index : 0;
        bmEl && bmEl.classList.add('selected');
        //bmEl.focus();
        bmEl && bmEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });        
    }    


    const clockEl = document.getElementById('clock');
    clockEl && setInterval(updateClock, 1000) && updateClock();

    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString();
    }

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const searchQuery = searchForm.q.value;

        if (isUrl(searchQuery)) {
            location.replace(searchQuery);
        } else {
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            location.replace(googleSearchUrl);
        }
        return false;
    });
    const bookmarks = (await getBookmarks()).filter(b => b.title && b.title.length);
    function renderBookmarks(bms) {
        bmsEl.innerHTML = '';
        bms.forEach(bookmark => {
            const el = createBookmarkEl(bookmark);
            bmsEl.appendChild(el);
        });
    }
    renderBookmarks(bookmarks);
    async function loadAndRenderTabs() {
        const tabs = await getTabs({
            currentWindow: true,
            active: false
        });
    
        renderTabs(tabsEl, tabs, openTab, closeTab);        
    }
    loadAndRenderTabs();
    window.chrome.tabs.onUpdated.addListener(async tabId => {
        const currentTab = await chrome.tabs.query({active:true})[0];
        if (currentTab && tabId !== currentTab.id) setTimeout(loadAndRenderTabs, 0);
    });
    window.chrome.tabs.onActivated.addListener(e => setTimeout(loadAndRenderTabs, 0));
    window.chrome.tabs.onRemoved.addListener(e => {
    const tabEl = document.getElementById('tab-' + e);
        if (tabEl) {
            tabEl.parentNode.removeChild(tabEl);
        }
    });

    tabsEl.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
            if (state.isTabSelction()) {
                const selectedTabEl = tabEls[newIndex];
                const selectedTabId = selectedTabEl.getAttribute('data-tab-id');
                openTabHandler({id: selectedTabId});
            } else {
                const selectedBm = bookmarks[state.selectedBmIndex];
                if (selectedBm && selectedBm.children) {
                    const selectedBm = bookmarks[state.selectedBmIndex];
                    if (selectedBm && selectedBm.children) {                    
                        renderBookmarks(selectedBm.children);
                    }            
                } else {
                    const selectedBmEl = document.querySelector('#bookmarks a.selected'); 
                    if (!isUrl(selectedBmEl.href)) {                        
                        chrome.tabs.update({url: 'https://google.com/search?q=' + selectedBmEl.href});
                    } else {
                        chrome.tabs.update({url: selectedBmEl.href});
                    }
                }            
    
            }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    tabsEl.addEventListener('keyup', e => {
        const tabEls = Array.from(document.querySelectorAll('#tabs a'));
        state.selectedTabIndex = handleTabKeyPress(
            e.key,
            e.keyCode,
            e.shiftKey,
            e.altKey,
            tabEls,
            state.selectedTabIndex,
            selectTab,
            closeTab,
            openTab
        );
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    // todo: move it to outer scope, unit test it.
    function handleTabKeyPress(key, keyCode, shiftKey = false, altKey = false, tabEls, currentIndex, selectTabHandler, closeTabHandler, openTabHandler) {
        if (isNaN(currentIndex) || currentIndex >= tabEls.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = tabEls.length;
        let newIndex = currentIndex;
        if (key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) { // left arrow or Alt+Tab keys
            if (state.isTabSelction()) {
                newIndex = (currentIndex - 1);
                if (newIndex < 0) newIndex = tabEls.length - 1;
                selectTabHandler(newIndex);
            }
        } else if (key === 'ArrowRight' || key === 'Tab') { // right arrow or tab key
            if (state.isTabSelction()) {
                newIndex = (currentIndex + 1);
                selectTabHandler(newIndex);
            } else {
                // check if bookmark is a folder
                const selectedBm = bookmarks[state.selectedBmIndex];
                if (selectedBm && selectedBm.children) {                    
                    renderBookmarks(selectedBm.children);
                }            
            }
        } else if (key == 'ArrowUp') {
            state.selectedBmIndex = (state.selectedBmIndex === 0) 
                ? bookmarks.length - 1 
                : state.selectedBmIndex - 1;

            if (altKey) {
                selectBookmark(state.selectedBmIndex - 10);
            } else {
                selectBookmark(state.selectedBmIndex);
            }
        } else if (key == 'ArowDown') {
            state.selectedBmIndex = (state.selectedBmIndex === bookmarks.length - 1) ? 0 : state.selectedBmIndex + 1;
            if (altKey) {
                selectBookmark(state.selectedBmIndex + 10);
            } else {
                selectBookmark(state.selectedBmIndex);
            }
        } else if (keyCode === 88) { // x
            const selectedTabEl = tabEls[newIndex];
            if (!selectedTabEl) return;
            const selectedTabId = selectedTabEl.getAttribute('data-tab-id');

            closeTabHandler({id: selectedTabId});
        }
        return newIndex;
    }
    
});
