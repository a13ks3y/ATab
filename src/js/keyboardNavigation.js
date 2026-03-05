const { focusTab, unfocusAllTabs, toggleMuteTab, togglePinTab } = require("./tabs");
const { getFocusedBookmarkIndex, focusNextBookmark, focusPrevBookmark } = require('./bookmarks.js');
const { toggleReadingList } = require('./readingList.js');

function getFocusedTabIndex(tabsEl) {
    try {
        const tabEl = tabsEl.querySelector('a:focus, a:hover, a.focused');
        return tabEl ? parseInt(tabEl.tabIndex) : -1;
    } catch {
        return -1;
    }
}

function getFocusedTabElement(tabsEl) {
    try {
        return tabsEl.querySelector('a:focus, a:hover, a.focused');
    } catch {
        return null; 
    }
}

function getTabsColumnCount(tabsEl) {
    const tabs = Array.from(tabsEl.querySelectorAll('a'));
    if (tabs.length < 2) return 1;
    
    // We assume tabs are sorted by DOM order.
    // We compare offsetTop of the first element with subsequent elements.
    const firstTop = tabs[0].offsetTop;
    let cols = 0;
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].offsetTop > firstTop) {
            break;
        }
        cols++;
    }
    return cols > 0 ? cols : 1; 
}

function handleTabsKeyDown(e, tabsEl) {
    // Only handle navigation keys
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!navKeys.includes(e.code)) return;

    const focusedTabIndex = getFocusedTabIndex(tabsEl);
    if (focusedTabIndex === -1) return; // Should we focus first?

    const cols = getTabsColumnCount(tabsEl);
    
    switch(e.code) {
        case 'ArrowLeft': 
            e.preventDefault();
            focusTab(tabsEl, focusedTabIndex - 1); 
            break;
        case 'ArrowRight': 
            e.preventDefault();
            focusTab(tabsEl, focusedTabIndex + 1); 
            break;
        case 'ArrowUp':
            e.preventDefault();
            focusTab(tabsEl, focusedTabIndex - cols);
            break;
        case 'ArrowDown':
            e.preventDefault();
            focusTab(tabsEl, focusedTabIndex + cols);
            break;
    }
}

function handleDocumentKeyDown(e, tabsEl, bmsContainerEl, toggleBookmarksPanel, shortcutsModal, openRecentHistory) {
    if (e.code === 'Tab') {
        unfocusAllTabs(tabsEl);
        return;
    }
    
    const searchForm = document.getElementById('search-form');
    const searchInput = searchForm ? searchForm.querySelector('input[name="q"]') : null;
    const isSearchFocused = document.activeElement === searchInput;

    // Initial check for shortcut toggles
    if ((e.key === '?' || e.code === 'KeyH') && !isSearchFocused && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (shortcutsModal) {
            e.preventDefault();
            shortcutsModal.classList.toggle('hidden');
        }
        return;
    }
    
    // Recent History shortcut (R)
    if (e.code === 'KeyR' && !isSearchFocused && !e.ctrlKey && !e.metaKey && !e.altKey && openRecentHistory) {
        e.preventDefault();
        openRecentHistory();
        return;
    }

    // If shortcuts modal is open, only allow closing it or ignore other inputs
    if (shortcutsModal && !shortcutsModal.classList.contains('hidden')) {
        if (e.code === 'Escape') {
            e.preventDefault();
            shortcutsModal.classList.add('hidden');
        }
        return;
    }
    
    // If recent history modal is open (we can check by ID or passed element, but let's assume openRecentHistory handles the toggle or we check DOM)
    const recentHistoryModal = document.getElementById('recent-history-modal');
    if (recentHistoryModal && !recentHistoryModal.classList.contains('hidden')) {
        if (e.code === 'Escape') {
            e.preventDefault();
            recentHistoryModal.classList.add('hidden');
        }
        // Allow navigation within the modal?
        // For now just block other navigation
        return;
    }

    if (e.code === 'KeyB') {
        if (!isSearchFocused && toggleBookmarksPanel) {
            toggleBookmarksPanel();
        }
    }

    if (e.code === 'KeyL') {
        if (!isSearchFocused && !e.ctrlKey && !e.metaKey && !e.altKey) {
            toggleReadingList();
        }
    }
    
    // Handle bookmark navigation if bookmarks panel is visible
    if (bmsContainerEl && !bmsContainerEl.classList.contains('hidden')) {
        const focusedIndex = getFocusedBookmarkIndex(bmsContainerEl);
        switch(e.code) {
            case 'ArrowUp':
                e.preventDefault();
                focusPrevBookmark(bmsContainerEl, focusedIndex);
                break;
            case 'ArrowDown': 
                e.preventDefault();
                focusNextBookmark(bmsContainerEl, focusedIndex);
                break;
            case 'Escape':
                e.preventDefault();
                if (toggleBookmarksPanel) toggleBookmarksPanel();
                break;
        }
    }

    // Handle Mute/Pin shortcuts
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (e.code === 'KeyM' || e.code === 'KeyP') {
            const focusedTabEl = getFocusedTabElement(tabsEl);
            if (focusedTabEl && focusedTabEl.dataset.tabId) {
                const tabId = parseInt(focusedTabEl.dataset.tabId);
                // Ensure it's not a bookmark masquerading as a tab (though likely won't happen if tabId is parsed)
                if (focusedTabEl.dataset.isBookmark === 'true') return;

                if (e.code === 'KeyM') {
                    e.preventDefault();
                    toggleMuteTab(tabId);
                } else if (e.code === 'KeyP') {
                    e.preventDefault();
                    togglePinTab(tabId);
                }
            }
        }
    }
}

exports.handleTabsKeyDown = handleTabsKeyDown;
exports.handleDocumentKeyDown = handleDocumentKeyDown;
