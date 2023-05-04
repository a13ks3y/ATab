function createTabEl(tab, openTabHandler = () => {
}, closeTabHandler = () => {
}, currentSideIndex = 0) {
    const tabEl = document.createElement('a');
    tabEl.id = 'tab-' + tab.id;
    if (tab.url === "chrome://newtab/") {
        tab["favIconUrl"] = "icons/ATab-128x128.png"
    }
    const favIconUrl = tab["favIconUrl"] || (tab.url === "chrome://newtab/" ? "icons/ATab-128x128.png" : null);
    if (favIconUrl) {
        const tabImgEl = document.createElement('img');
        tabImgEl.src = favIconUrl;
        tabImgEl.alt = tab["title"];
        tabEl.appendChild(tabImgEl);
    } else {
        tabEl.textContent = tab["title"];
    }

    const closeBtnEl = document.createElement('button');
    closeBtnEl.textContent = 'X';
    closeBtnEl.addEventListener('click', e => {
        e.preventDefault();
        e.cancelBubble = true;
        closeTabHandler(tab);
        return false;
    });
    tabEl.appendChild(closeBtnEl);

    // todo: unit-test next lines
    const sides = [
        'from-left-top',
        'from-right-top',
        'from-left-bottom',
        'from-right-bottom'
    ];
    currentSideIndex = currentSideIndex >= sides.length - 1 ? 0 : currentSideIndex;
    tabEl.classList.add(sides[currentSideIndex]);
    setTimeout(() => tabEl.classList.remove(...sides), 333);
    tabEl.addEventListener('click', e => openTabHandler(tab));

    tabEl.title = tab["title"];
    return tabEl;
}

exports.createTabEl = createTabEl;
