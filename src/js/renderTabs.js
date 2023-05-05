import {createTabEl} from "./createTabEl";

export function renderTabs(tabsEl, tabs, openTab, closeTab) {
    tabsEl.innerHTML = '';
    const tabEls = tabs.map((tab, i) => {
        const tabEl = createTabEl(tab, openTab, closeTab, i % 4);
        tabsEl.appendChild(tabEl);
        return tabEl;
    });
    // @todo: refactor this part, decide wich effect fits best (or make it optional?)
    // JUST APEAR
    // setTimeout(()=> {
    //     for (let tabEl of tabEls) {
    //         const sides = [
    //             'from-left-top',
    //             'from-right-top',
    //             'from-left-bottom',
    //             'from-right-bottom'
    //         ];
        
    //         tabEl.classList.remove(...sides);                
    //     }
    // }, 0);
    // APEAR ONE BY ONE:
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