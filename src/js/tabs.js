function unselectAllTabs(tabsEl) {
    const els = Array.from(tabsEl.querySelectorAll('a'));
    els.forEach(tabEl => tabEl.classList.remove('selected'));
}

function selectTab(tabsEl, selectedTabIndex = 0) {
    const els = Array.from(tabsEl.querySelectorAll('a'));
    // remove selected class from all tab elements
    unselectAllTabs(tabsEl);
    // add selected class to the selected tab element
    const selectedTabEl = selectedTabIndex === -1
        ? els[els.length - 1]
        : (els[selectedTabIndex] ? els[selectedTabIndex] : els[0]);

    if (selectedTabEl) {
        selectedTabEl.classList.add('selected');
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

exports.deselectTabs = unselectAllTabs;
exports.selectTab = selectTab;
exports.closeTab = closeTab;
exports.openTab = openTab;