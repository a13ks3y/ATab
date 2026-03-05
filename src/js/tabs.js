function unfocusAllTabs(tabsEl) {
    const els = Array.from(tabsEl.querySelectorAll('a'));
    els.forEach(tabEl => {
        tabEl.classList.remove('focused');
        tabEl.blur();
    });
}

function focusTab(tabsEl, focusedTabIndex = 0) {
    // console.log('focusTab has been called', focusedTabIndex);
    const els = Array.from(tabsEl.querySelectorAll('a'));
    // remove focused class from all tab elements
    unfocusAllTabs(tabsEl);
    // add focused class to the focused tab element
    let focusedTabEl = els.find(e => e.tabIndex == focusedTabIndex);
    if (!focusedTabEl) {
        focusedTabEl = focusedTabIndex >= els.length ? els[0] : els[els.length - 1];
    }
    if (focusedTabEl) {
        // @todo: consider using just focus, and do not bother with "focused" class
        focusedTabEl.classList.add('focused');
        focusedTabEl.focus();
    }
}

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
function closeOtherTabs(currentTabId) {
    if (!currentTabId) return;
    window.chrome.tabs.query({currentWindow: true}, tabs => {
        tabs.forEach(tab => {
            if (tab.id !== Number(currentTabId)) {
                closeTab(tab);
            }
        });
    });
}

function toggleMuteTab(tabId) {
    if (!tabId) return;
    const id = Number(tabId);
    window.chrome.tabs.get(id, (tab) => {
        if (window.chrome.runtime.lastError || !tab) return;
        const currentMuted = tab.mutedInfo ? tab.mutedInfo.muted : false;
        window.chrome.tabs.update(id, { muted: !currentMuted });
    });
}

function togglePinTab(tabId) {
    if (!tabId) return;
    const id = Number(tabId);
    window.chrome.tabs.get(id, (tab) => {
        if (window.chrome.runtime.lastError || !tab) return;
        window.chrome.tabs.update(id, { pinned: !tab.pinned });
    });
}

exports.unfocusAllTabs = unfocusAllTabs;
exports.focusTab = focusTab;
exports.closeTab = closeTab;
exports.openTab = openTab;
exports.closeOtherTabs = closeOtherTabs;
exports.toggleMuteTab = toggleMuteTab;
exports.togglePinTab = togglePinTab;
