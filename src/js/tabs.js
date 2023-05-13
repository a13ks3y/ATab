function unselectAllTabs(tabsEl) {
    const els = Array.from(tabsEl.querySelectorAll('a'));
    els.forEach(tabEl => {
        tabEl.classList.remove('selected');
        tabEl.blur();
    });
}

function selectTab(tabsEl, selectedTabIndex = 0) {
    // console.log('selectTab has been called', selectedTabIndex);
    const els = Array.from(tabsEl.querySelectorAll('a'));
    // remove selected class from all tab elements
    unselectAllTabs(tabsEl);
    // add selected class to the selected tab element
    let selectedTabEl = els.find(e => e.tabIndex == selectedTabIndex);
    if (!selectedTabEl) {
        selectedTabEl = selectedTabIndex >= els.length ? els[0] : els[els.length - 1];
    }
    if (selectedTabEl) {
        // @todo: consider using just focus, and do not bother with "selected" class
        selectedTabEl.classList.add('selected');
        selectedTabEl.focus();
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

exports.unselectAllTabs = unselectAllTabs;
exports.selectTab = selectTab;
exports.closeTab = closeTab;
exports.openTab = openTab;