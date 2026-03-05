const { getTabs } = require('./getTabs');
const { getSettings } = require('./settings');

let staleTabs = [];

function initStaleTabs() {
    const checkBtn = document.getElementById('btn-clean-stale-tabs');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkStaleTabs);
    }
    
    const cancelBtn = document.getElementById('btn-cancel-stale');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideStaleTabsModal);
    }
    
    const confirmBtn = document.getElementById('btn-confirm-stale');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmCloseStaleTabs);
    }

    // Close on click outside
    const modal = document.getElementById('stale-tabs-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideStaleTabsModal();
            }
        });
    }
}

async function checkStaleTabs() {
    const settings = getSettings();
    const thresholdMs = parseInt(settings.staleThreshold) || 604800000; // Default 1 week
    const now = Date.now();
    
    const allTabs = await getTabs({});
    
    staleTabs = allTabs.filter(tab => {
        // Skip current tab and pinned tabs
        if (tab.active || tab.pinned) return false;
        
        // Skip bookmarks pretending to be tabs
        if (tab.isBookmark) return false;
        
        // Check if lastAccessed is available and older than threshold
        if (tab.lastAccessed) {
            return (now - tab.lastAccessed) > thresholdMs;
        }
        return false;
    });
    
    if (staleTabs.length === 0) {
        alert('No stale tabs found based on the current threshold.');
        return;
    }
    
    showStaleTabsModal(staleTabs);
}

function showStaleTabsModal(tabs) {
    const modal = document.getElementById('stale-tabs-modal');
    const list = document.getElementById('stale-tabs-list');
    
    if (!modal || !list) return;
    
    list.innerHTML = '';
    
    tabs.forEach(tab => {
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.dataset.tabId = tab.id;
        checkbox.id = `stale-tab-${tab.id}`;
        checkbox.setAttribute('aria-label', `Select ${tab.title} to close`);
        
        const label = document.createElement('label');
        label.htmlFor = `stale-tab-${tab.id}`;
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.flex = '1';
        label.style.cursor = 'pointer';

        const icon = document.createElement('img');
        const favIconUrl = tab.favIconUrl || (tab.url === "chrome://newtab/" ? "icons/ATab-128x128.png" : null);
        icon.src = favIconUrl ? favIconUrl : 'icons/gear.png';
        icon.className = 'tab-favIcon';
        icon.alt = ""; // Decorative
        icon.onerror = () => { icon.src = 'icons/gear.png'; };
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'tab-info';
        
        const titleSpan = document.createElement('div');
        titleSpan.className = 'tab-title';
        titleSpan.textContent = tab.title;
        
        const dateSpan = document.createElement('div');
        dateSpan.className = 'tab-date';
        if (tab.lastAccessed) {
            try {
               const date = new Date(tab.lastAccessed);
               dateSpan.textContent = `Last accessed: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            } catch (e) {
                dateSpan.textContent = 'Last accessed: Unknown';
            }
        }
        
        infoDiv.appendChild(titleSpan);
        infoDiv.appendChild(dateSpan);
        
        label.appendChild(icon);
        label.appendChild(infoDiv);
        
        li.appendChild(checkbox);
        li.appendChild(label); // Use label for clicking
        
        list.appendChild(li);
    });
    
    // Hide settings modal if open
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal && !settingsModal.classList.contains('hidden')) {
        settingsModal.classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
    
    // Focus first checkbox or cancel button
    const firstCheckbox = list.querySelector('input');
    if (firstCheckbox) firstCheckbox.focus();
    else {
        const cancelBtn = document.getElementById('btn-cancel-stale');
        if (cancelBtn) cancelBtn.focus();
    }
}

function hideStaleTabsModal() {
    const modal = document.getElementById('stale-tabs-modal');
    if (modal) modal.classList.add('hidden');
}

function confirmCloseStaleTabs() {
    const list = document.getElementById('stale-tabs-list');
    if (!list) return;
    
    const checkboxes = list.querySelectorAll('input[type="checkbox"]:checked');
    const tabIdsToClose = Array.from(checkboxes).map(cb => parseInt(cb.dataset.tabId, 10));
    
    if (tabIdsToClose.length > 0) {
        chrome.tabs.remove(tabIdsToClose, () => {
            hideStaleTabsModal();
        });
    } else {
        hideStaleTabsModal();
    }
}

module.exports = { initStaleTabs };