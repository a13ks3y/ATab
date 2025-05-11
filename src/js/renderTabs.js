import {createTabEl} from "./createTabEl";

export function renderTabs(tabsEl, tabs, openTab, closeTab) {
    // Store the currently focused tab ID before clearing the container
    const focusedTabEl = tabsEl.querySelector('a:focus, a.selected');
    const focusedTabId = focusedTabEl ? focusedTabEl.getAttribute('data-tab-id') : null;
    
    tabsEl.innerHTML = '';
    const tabEls = tabs.map((tab, i) => {
        const tabEl = createTabEl(
            tab,
            openTab,
            closeTab,
            i % 4,
            i + 2);
        tabsEl.appendChild(tabEl);
        return tabEl;
    });
    
    // Restore focus to the previously focused tab if it still exists
    if (focusedTabId) {
        const tabToFocus = tabsEl.querySelector(`a[data-tab-id="${focusedTabId}"]`);
        if (tabToFocus) {
            tabToFocus.classList.add('selected');
            setTimeout(() => tabToFocus.focus(), 10);
        }
    }
    
    // Animation code (unchanged)
    tabEls.forEach((tabEl, i) => {
        setTimeout(() => removeSides(tabEl), 66 * (i + 1));
    });
    function removeSides(tabEl) {
        requestAnimationFrame(() => {
            const sides = [
                'from-left-top',
                'from-right-top',
                'from-left-bottom',
                'from-right-bottom'
            ];
        
            tabEl.classList.remove(...sides);    
        });
    }
}
//window.exports = window.exports || {};
//exports.renderTabs = renderTabs;