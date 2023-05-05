// @todo: recive tabs as argument (good for unit-testing)
async function renderTabs(tabsEl) {
    const tabs = await getTabs({
        currentWindow: true,
        active: false
    });

    tabsEl.innerHTML = '';
    let currentSideIndex = 0;
    const tabEls = tabs.map(tab => {
        currentSideIndex = currentSideIndex >= 3 ? 0 : currentSideIndex + 1;
        const tabEl = createTabEl(tab, openTab, closeTab, currentSideIndex);
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

exports.renderTabs = renderTabs;