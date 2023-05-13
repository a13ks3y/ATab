import '../css/reset.css';
import '../css/index.css';
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';
import { renderTabs } from './renderTabs.js';
import { getTabs } from './getTabs.js';
import { isUrl } from './isUrl.js';
import {closeTab, openTab, selectTab, unselectAllTabs} from "./tabs";
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