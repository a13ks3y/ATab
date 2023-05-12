import '../css/reset.css';
import '../css/index.css';
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';
import { renderTabs } from './renderTabs.js';
import { getTabs } from './getTabs.js';
import { isUrl } from './isUrl.js';
import {closeTab, openTab} from "./tabs";
document.addEventListener('readystatechange', async () => {
    const tabsEl = document.getElementById('tabs');
    const bmsEl = document.querySelector('#bookmarks div');

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
    window.chrome.tabs.onActivated.addListener(e => setTimeout(loadAndRenderTabs, 0));
    window.chrome.tabs.onRemoved.addListener(e => {
    const tabEl = document.getElementById('tab-' + e);
        if (tabEl) {
            tabEl.parentNode.removeChild(tabEl);
        }
    });
});