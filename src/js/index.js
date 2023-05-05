import '../css/reset.css';
import '../css/index.css';
import {getTabs} from "./getTabs";
import {createTabEl} from "./createTabEl";
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';

if (!(window['chrome'] && window['chrome']['tabs'])) {
    throw new Error("THIS CODE SHOULD RUN ONLY AS CHROME EXTENSION!!!");
}
function renderTabs(withEffect = false) {
    chrome.windows.getCurrent(async wnd => {
        const tabsEl = document.getElementById('tabs');
        const tabs = await getTabs({
            currentWindow: true,
            active: false
        });

        tabsEl.innerHTML = '';
        let currentSideIndex = 0;
        const tabEls = tabs.map(tab => {
            currentSideIndex = currentSideIndex >= 3 ? 0 : currentSideIndex + 1;
            const tabEl = createTabEl(tab, openTab, closeTab, currentSideIndex);
            tabsEl.appendChild(tabEl);
            return tabEl;
        });
        // @todo: refactor this part, decide wich effect fits best (or make it optional?)
        // JUST APEAR
        // setTimeout(()=> {
        //     for (let tabEl of tabEls) {
        //         const sides = [
        //             'from-left-top',
        //             'from-right-top',
        //             'from-left-bottom',
        //             'from-right-bottom'
        //         ];
            
        //         tabEl.classList.remove(...sides);                
        //     }
        // }, 0);
        // APEAR ONE BY ONE:
        tabEls.forEach((tabEl, i) => {
            setTimeout(() => removeSides(tabEl), 66 * (i + 1));
        });
        function removeSides(tabEl) {
            requestAnimationFrame(() => {
                const sides = [
                    'from-left-top',
                    'from-right-top',
                    'from-left-bottom',
                    'from-right-bottom'
                ];
            
                tabEl.classList.remove(...sides);    
            });
        }
    });
}



function openTab(tab) {
    if (!tab || !tab.id) return;
    window.chrome.tabs.update(Number(tab.id), {active: true});
}

function closeTab(tab) {
    if (!tab || !tab.id) return;
    window.chrome.tabs.remove(Number(tab.id));
}

function selectTab(selectedTabIndex = 0) {
    const els = Array.from(document.querySelectorAll('#tabs a'));
    // remove selected class from all tab elements
    els.forEach(tabEl => tabEl.classList.remove('selected'));
    // add selected class to the selected tab element
    const selectedTabEl = els[selectedTabIndex] ? els[selectedTabIndex] : els[0];
    if (selectedTabEl) {
        selectedTabEl.classList.add('selected');        
    }
}

document.addEventListener('readystatechange', async () => {
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

    const bookmarks = (await getBookmarks()).filter(b => b.title.length > 2);
    const bookmarksEl = document.getElementById('bookmarks');
    bookmarks.forEach(bookmark => {
        const el = createBookmarkEl(bookmark);
        bookmarksEl.appendChild(el);
    });
    renderTabs(true);
    
    window.chrome.tabs.onUpdated.addListener(async tabId => {
        console.log(tabId);
        const currentTab = await chrome.tabs.query({active:true})[0];
        if (currentTab && tabId !== currentTab.id) setTimeout(renderTabs, 0);
    });
    window.chrome.tabs.onActivated.addListener(e => setTimeout(renderTabs));
    window.chrome.tabs.onRemoved.addListener(e => {
    const tabEl = document.getElementById('tab-' + e);
        if (tabEl) {
            tabEl.parentNode.removeChild(tabEl);
        }
    });

    // add event listeners to document to capture key presses
    let currentIndex = 0;
    document.addEventListener('keyup', e => {
        const tabEls = Array.from(document.querySelectorAll('#tabs a'));
        currentIndex = handleTabKeyPress(
            e.key,
            e.keyCode,
            e.shiftKey,
            tabEls,
            currentIndex,
            selectTab,
            closeTab,
            openTab
        );
        e.preventDefault();
        e.stopPropagation();
    });
    // todo: move it to outer scope, unit test it.
    function handleTabKeyPress(key, keyCode, shiftKey = false, tabEls, currentIndex, selectTabHandler, closeTabHandler, openTabHandler) {
        if (isNaN(currentIndex) || currentIndex >= tabEls.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = tabEls.length;
        let newIndex = currentIndex;
        if (key === 'ArrowLeft' || (key === 'Tab' && shiftKey)) { // left arrow or Alt+Tab keys
            newIndex = (currentIndex - 1);
            if (newIndex < 0) newIndex = tabEls.length - 1;
            selectTabHandler(newIndex);
        } else if (key === 'ArrowRight' || key === 'Tab') { // right arrow or tab key
            newIndex = (currentIndex + 1);
            selectTabHandler(newIndex);
        } else if (key === 'Enter') { // enter
            const selectedTabEl = tabEls[newIndex];
            if (!selectedTabEl) return;
            const selectedTabId = selectedTabEl.getAttribute('data-tab-id');

            openTabHandler({id: selectedTabId});
        } else if (keyCode === 88) { // x
            const selectedTabEl = tabEls[newIndex];
            if (!selectedTabEl) return;
            const selectedTabId = selectedTabEl.getAttribute('data-tab-id');

            closeTabHandler({id: selectedTabId});
        }
        return newIndex;
    }
    
});

// @todo: Deside: Do I need input or the document focused by default???
// setTimeout(() => {
//     const searchInputEl = document.getElementById('q');
//     searchInputEl.focus({
//         focusVisible: true
//     });
// }, 666);


function isUrl(value) {
    try {
        new URL(value);
        return true;
    } catch (e) {
        return false;
    }
}
