import '../css/reset.css';
import '../css/index.css';
import '../css/pomodoro.css';
import '../css/analytics.css';
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';
import { renderTabs } from './renderTabs.js';
import { getTabs, getTabGroups } from './getTabs.js';
import { isUrl } from './isUrl.js';
import { closeTab, openTab, focusTab, unfocusAllTabs } from "./tabs";
import { initFolderHandlers } from './bookmarkFolders.js';
import { getFocusedBookmarkIndex, focusNextBookmark, focusPrevBookmark } from './bookmarks.js';
import { handleTabsKeyDown, handleDocumentKeyDown } from './keyboardNavigation.js';
import { initTheme, toggleTheme } from './theme.js';
import { saveTabOrder, restoreTabOrder } from './tabPersistence.js';
import { initSettings } from './settings.js';
import { initQuickNotes } from './quickNotes.js';
import { initStaleTabs } from './staleTabs.js';
import { initRecentHistory, openRecentHistoryModal } from './recentHistory.js';
import { initPomodoro } from './pomodoro.js';
import { initAnalytics } from './analytics.js';
import { initSessionSnapshots } from './sessionSnapshots.js';
import { initReadingList } from './readingList.js';


// Initialize theme immediately to prevent flash of wrong theme
initTheme();

function toggleBookmarksPanel() {
    const bmsContainerEl = document.querySelector('#bookmarks');
    bmsContainerEl.classList.toggle('hidden');
    if (!bmsContainerEl.classList.contains('hidden')) {
        bmsContainerEl.focus();
    }
}


document.addEventListener('readystatechange', async () => {
    if (document.readyState !== 'complete') return;
    
    // Re-run initTheme to ensure toggle button state is correct now that DOM is loaded
    initTheme();
    initSettings();
    initQuickNotes();
    initAnalytics();
    initStaleTabs();
    initRecentHistory();
    initPomodoro();
    initSessionSnapshots();
    initReadingList();
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Zen Mode Toggle
    const zenToggleBtn = document.getElementById('zen-mode-toggle');
    if (zenToggleBtn) {
        // Restore state
        if (localStorage.getItem('zenMode') === 'true') {
            document.body.classList.add('zen-mode');
        }

        zenToggleBtn.addEventListener('click', () => {
            const isZen = document.body.classList.toggle('zen-mode');
            localStorage.setItem('zenMode', isZen);
        });
    }

    const tabsEl = document.getElementById('tabs');
    const bmsEl = document.querySelector('#bookmarks div');
    const bmsContainerEl = document.getElementById('bookmarks');
    
    const shortcutsModal = document.getElementById('shortcuts-modal');
    if (shortcutsModal) {
        const closeBtn = shortcutsModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                shortcutsModal.classList.add('hidden');
            });
        }
        shortcutsModal.addEventListener('click', (e) => {
            if (e.target === shortcutsModal) { // Close if clicked on backdrop
                shortcutsModal.classList.add('hidden');
            }
        });
    }

    tabsEl.addEventListener('keydown', e => handleTabsKeyDown(e, tabsEl));

    document.addEventListener('keydown', e => {
        handleDocumentKeyDown(e, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal, openRecentHistoryModal);
    });

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

    // Restore custom tab order if exists
    await restoreTabOrder();

    let allTabs = [];

    function getFilteredTabs() {
        const query = searchForm.q.value.toLowerCase();
        if (!query) return allTabs;
        
        const filteredTabs = allTabs.filter(tab => 
            (tab.title && tab.title.toLowerCase().includes(query)) || 
            (tab.url && tab.url.toLowerCase().includes(query))
        );

        // Filter bookmarks
        const filteredBookmarks = bookmarks.filter(bm => 
            bm.url && ( // Only bookmarks with URLs (not folders)
                (bm.title && bm.title.toLowerCase().includes(query)) || 
                (bm.url && bm.url.toLowerCase().includes(query))
            )
        );

        // Map bookmarks to tab-like objects
        const bookmarkTabs = filteredBookmarks.map(bm => ({
            id: 'bm-' + bm.id,
            title: bm.title,
            url: bm.url,
            isBookmark: true,
            favIconUrl: `chrome://favicon/${bm.url}`
        }));

        return [...filteredTabs, ...bookmarkTabs];
    }

    function handleOpenTab(item) {
        if (item.isBookmark) {
            window.chrome.tabs.create({ url: item.url, active: true });
        } else {
            openTab(item);
        }
    }

    function handleCloseTab(item) {
        if (!item.isBookmark) {
            closeTab(item);
        }
    }

    function renderCurrentTabs() {
        const filtered = getFilteredTabs();
        renderTabs(tabsEl, filtered, handleOpenTab, handleCloseTab);
    }

    searchForm.q.addEventListener('input', () => {
        renderCurrentTabs();
    });

    searchForm.q.addEventListener('keydown', e => {
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            const firstTab = tabsEl.querySelector('a');
            if (firstTab) {
                focusTab(tabsEl, parseInt(firstTab.getAttribute('tabIndex')));
            }
        }
    });

    async function loadAndRenderTabs() {
        const [tabs, groups] = await Promise.all([
            getTabs({
                currentWindow: true,
                active: false
            }),
            getTabGroups({
                windowId: chrome.windows.WINDOW_ID_CURRENT
            }).catch(() => [])
        ]);

        const groupMap = {};
        groups.forEach(g => groupMap[g.id] = g);

        const enrichedTabs = tabs.map(tab => {
            if (tab.groupId !== -1 && groupMap[tab.groupId]) {
                tab.groupColor = groupMap[tab.groupId].color;
                tab.groupTitle = groupMap[tab.groupId].title;
            }
            return tab;
        });
        
        // Check if tabs changed (length or content)
        const hasChanged = enrichedTabs.length !== allTabs.length || enrichedTabs.some((tab, i) => {
            const oldTab = allTabs[i];
            return !oldTab || 
                   tab.id !== oldTab.id || 
                   tab.title !== oldTab.title || 
                   tab.url !== oldTab.url || 
                   tab.pinned !== oldTab.pinned || 
                   (tab.mutedInfo && tab.mutedInfo.muted) !== (oldTab.mutedInfo && oldTab.mutedInfo.muted) ||
                   tab.favIconUrl !== oldTab.favIconUrl ||
                   tab.groupId !== oldTab.groupId ||
                   tab.groupColor !== oldTab.groupColor ||
                   tab.groupTitle !== oldTab.groupTitle ||
                   tab.discarded !== oldTab.discarded;
        });
        saveTabOrder(enrichedTabs);
            
        if (hasChanged) {
            allTabs = enrichedTabs;
            renderCurrentTabs();
        }
    }
    loadAndRenderTabs();
    window.chrome.tabs.onCreated.addListener(() => setTimeout(loadAndRenderTabs, 0));
    window.chrome.tabs.onUpdated.addListener(async tabId => {
        window.chrome.tabs.query({active:true}, tabs => {
            const currentTab = tabs[0];
            if (currentTab && tabId !== currentTab.id) {
                setTimeout(loadAndRenderTabs, 0);
            }
        });
    });
    window.chrome.tabs.onActivated.addListener(() => setTimeout(loadAndRenderTabs, 0));
    window.chrome.tabs.onMoved.addListener(() => setTimeout(loadAndRenderTabs, 0));
    window.chrome.tabs.onRemoved.addListener(tabId => {
        const tabEl = document.getElementById('tab-' + tabId);
        if (tabEl) {
            tabEl.classList.add('tab-closing');
            
            const removeTab = () => {
                if (tabEl && tabEl.parentNode) {
                    tabEl.parentNode.removeChild(tabEl);
                }
            };
            
            tabEl.addEventListener('animationend', removeTab);
            setTimeout(removeTab, 350);
        }
    });

    if (window.chrome.tabGroups) {
        const updateGroups = () => setTimeout(loadAndRenderTabs, 0);
        window.chrome.tabGroups.onCreated.addListener(updateGroups);
        window.chrome.tabGroups.onUpdated.addListener(updateGroups);
        window.chrome.tabGroups.onMoved.addListener(updateGroups);
        window.chrome.tabGroups.onRemoved.addListener(updateGroups);
    }
});