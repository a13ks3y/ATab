function createTabEl(tab, openTabHandler = () => {
}, closeTabHandler = () => {
}, currentSideIndex = 0, tabIndex = null) {
    const tabEl = document.createElement('a');
    tabEl.id = 'tab-' + tab.id;
    tabEl.setAttribute('data-tab-id', tab.id);
    if (tab.url === "chrome://newtab/") {
        tab["favIconUrl"] = "icons/ATab-128x128.png"
    }
    if (tabIndex !== null) {
        tabEl.tabIndex = tabIndex;
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
    closeBtnEl.innerHTML = '<svg stroke="white" width="32px" height="32px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>';
    closeBtnEl.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        closeTabHandler(tab);
        return false;
    });
    tabEl.appendChild(closeBtnEl);

    // todo: unit-test next lines
    // todo: move it to global scope and export
    const sides = [
        'from-left-top',
        'from-right-top',
        'from-left-bottom',
        'from-right-bottom'
    ];
    
    const sideClass = sides[currentSideIndex] || sides[0];
    if (currentSideIndex !== -1) tabEl.classList.add(sideClass);
    // setTimeout(() => tabEl.classList.remove(...sides), 333 * (currentSideIndex + 1));
    
    tabEl.addEventListener('click', e => openTabHandler(tab));
    tabEl.addEventListener('keydown', e => {
        console.log(e.code);
        if (e.code === 'KeyX') {
            closeTabHandler(tab);
        }
        if (e.code === 'Enter') {
            openTabHandler(tab);
        }
        if ((e.code === 'KeyX') || (e.code === 'Enter')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    tabEl.title = tab["title"];
    return tabEl;
}

exports.createTabEl = createTabEl;
