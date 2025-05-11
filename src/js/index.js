import '../css/reset.css';
import '../css/index.css';
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';
import { renderTabs } from './renderTabs.js';
import { getTabs } from './getTabs.js';
import { isUrl } from './isUrl.js';
import { closeTab, openTab, selectTab, unselectAllTabs } from "./tabs";
import { initFolderHandlers } from './bookmarkFolders.js';
import { getSelectedBookmarkIndex, selectNextBookmark, selectPrevBookmark } from './bookmarks.js';


function toggleBookmarksPanel() {
    const bmsContainerEl = document.querySelector('#bookmarks');
    bmsContainerEl.classList.toggle('hidden');
    if (!bmsContainerEl.classList.contains('hidden')) {
        bmsContainerEl.focus();
    }
}

function getSelectedTabIndex(tabsEl) {
    try {
        const tabEl = tabsEl.querySelector('a:focus, a:hover, a.selected');
        return tabEl ? parseInt(tabEl.tabIndex) : -1;
    } catch {
        return -1;
    }
}

document.addEventListener('readystatechange', async () => {
    const tabsEl = document.getElementById('tabs');
    const bmsEl = document.querySelector('#bookmarks div');
    const bmsContainerEl = document.getElementById('bookmarks');

    tabsEl.addEventListener('keydown', e => {
        const selectedTabIndex = getSelectedTabIndex(tabsEl);
        // console.log('tabsEl:keydown:', e.code, 'selectedTabIndex:', selectedTabIndex);
        switch(e.code) {
            case 'ArrowLeft': selectTab(tabsEl, selectedTabIndex - 1); break;
            case 'ArrowRight': selectTab(tabsEl, selectedTabIndex + 1); break;
        }
    });

    document.addEventListener('keydown', e => {
        switch(e.code) {
            case 'Tab': unselectAllTabs(tabsEl); break;
            case 'KeyB': if (e.target !== searchForm.q) toggleBookmarksPanel(); break;
        }
        
        // Handle bookmark navigation if bookmarks panel is visible
        if (!bmsContainerEl.classList.contains('hidden')) {
            const selectedIndex = getSelectedBookmarkIndex(bmsContainerEl);
            switch(e.code) {
                case 'ArrowUp':
                    e.preventDefault();
                    selectPrevBookmark(bmsContainerEl, selectedIndex);
                    break;
                case 'ArrowDown': 
                    e.preventDefault();
                    selectNextBookmark(bmsContainerEl, selectedIndex);
                    break;
            }
        }
    })

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
        } else if (/^[a-zA-Z]+\.com$/i.test(searchQuery)) {
            location.replace('https://' + searchQuery);
        } else {
            // Use Chrome Search API instead of hardcoding Google search
            chrome.search.query({
                text: searchQuery,
                disposition: 'CURRENT_TAB'
            }, () => {
                // Handle any errors or fallback if needed
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    // Fallback to opening a new tab with the query
                    // without specifying the search provider
                    chrome.tabs.update({ url: `search:${searchQuery}` });
                }
            });
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
        
        // Initialize folder handlers after rendering bookmarks
        initFolderHandlers(bmsContainerEl, bookmarks, createBookmarkEl);
    }
    renderBookmarks(bookmarks);
    let lastTabs = [];
    async function loadAndRenderTabs() {
        const tabs = await getTabs({
            currentWindow: true,
            active: false
        });
        if (tabs.length !== lastTabs.length) {
            lastTabs = tabs;
            renderTabs(tabsEl, tabs, openTab, closeTab);
        }
    }
    loadAndRenderTabs();
    window.chrome.tabs.onUpdated.addListener(async tabId => {
        window.chrome.tabs.query({active:true}, tabs => {
            const currentTab = tabs[0];
            if (currentTab && tabId !== currentTab.id) {
                setTimeout(loadAndRenderTabs, 0);
            }
        });
    });
    window.chrome.tabs.onActivated.addListener(() => setTimeout(loadAndRenderTabs, 0));
    window.chrome.tabs.onRemoved.addListener(e => {
    const tabEl = document.getElementById('tab-' + e);
        if (tabEl) {
            tabEl.parentNode.removeChild(tabEl);
        }
    });
});