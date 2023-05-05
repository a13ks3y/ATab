import '../css/reset.css';
import '../css/index.css';
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';
import { renderTabs } from './renderTabs.js';
import { getTabs } from './getTabs.js';
if (!(window['chrome'] && window['chrome']['tabs'])) {
    throw new Error("THIS CODE SHOULD RUN ONLY AS CHROME EXTENSION!!!");
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
    let currentBookmarkIndex = 0;
    const tabsEl = document.getElementById('tabs');
    const bmsEl = document.querySelector('#bookmarks div');    
    function selectBookmark(index) {
        const bmEls = document.querySelectorAll('#bookmarks div a');
        console.log('selectBookmark:', index);
        for (let bmEl of bmEls) {
            bmEl.classList.remove('selected');
        }
        const bmEl = bmEls[index] || bmEls[0];
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
    bookmarks.forEach(bookmark => {
        const el = createBookmarkEl(bookmark);
        bmsEl.appendChild(el);
    });
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

    // add event listeners to document to capture key presses
    let currentIndex = 0;
    tabsEl.addEventListener('keyup', e => {

        if (e.key === 'ArrowUp') {
            currentBookmarkIndex = (currentBookmarkIndex === 0) ? bookmarks.length - 1 : currentBookmarkIndex - 1;
            if (e.altKey) {
                selectBookmark(currentBookmarkIndex - 10);
            } else {
                selectBookmark(currentBookmarkIndex);
            }
        } else if (e.key === 'ArrowDown') {
            currentBookmarkIndex = (currentBookmarkIndex === bookmarks.length - 1) ? 0 : currentBookmarkIndex + 1;
            if (e.altKey) {
                selectBookmark(currentBookmarkIndex + 10);
            } else {
                selectBookmark(currentBookmarkIndex);
            }
        }

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
