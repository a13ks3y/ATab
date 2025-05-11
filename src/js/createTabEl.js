function createTabEl(tab, openTabHandler = () => {
}, closeTabHandler = () => {
}, currentSideIndex = 0, tabIndex = 0) {
    const tabEl = document.createElement('a');
    tabEl.id = 'tab-' + tab.id;
    tabEl.setAttribute('data-tab-id', tab.id);
    tabEl.setAttribute('tabIndex', tabIndex.toString(10));
    if (tab.url === "chrome://newtab/") {
        tab["favIconUrl"] = "icons/ATab-128x128.png"
    }
    const favIconUrl = tab["favIconUrl"] || (tab.url === "chrome://newtab/" ? "icons/ATab-128x128.png" : null);
    const tabImgEl = document.createElement('img');
    tabImgEl.alt = tab["title"];
    tabEl.appendChild(tabImgEl);
    tabImgEl.src = favIconUrl ? favIconUrl : 'icons/gear.png';

    const tabElTitle = document.createElement('h6');
    tabElTitle.textContent = tab["title"];
    tabEl.appendChild(tabElTitle);

    // Close button
    const closeBtnEl = document.createElement('button');
    closeBtnEl.className = 'close-btn';
    closeBtnEl.innerHTML = '<svg stroke="white" width="32px" height="32px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>';
    closeBtnEl.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        closeTabHandler(tab);
        return false;
    });
    tabEl.appendChild(closeBtnEl);
    
    // Add "Close others" button
    const closeOthersBtnEl = document.createElement('button');
    closeOthersBtnEl.className = 'close-others-btn';
    closeOthersBtnEl.title = 'Close other tabs';
    closeOthersBtnEl.innerHTML = '<svg width="26px" height="26px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 19C9.06995 19 12 16.0699 12 12.5C12 8.93005 9.06995 6 5.5 6C1.93005 6 -1 8.93005 -1 12.5C-1 16.0699 1.93005 19 5.5 19Z" stroke="white" stroke-width="2"/><path d="M18 19C21.3137 19 24 16.3137 24 13C24 9.68629 21.3137 7 18 7C14.6863 7 12 9.68629 12 13C12 16.3137 14.6863 19 18 19Z" stroke="white" stroke-width="2"/><path d="M12 7L12 19" stroke="white" stroke-width="2"/></svg>';
    closeOthersBtnEl.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // This requires importing closeOtherTabs from tabs.js
        // To maintain backward compatibility, we'll use a global approach
        window.chrome.tabs.query({currentWindow: true}, tabs => {
            tabs.forEach(otherTab => {
                if (otherTab.id !== Number(tab.id)) {
                    closeTabHandler(otherTab);
                }
            });
        });
        return false;
    });
    tabEl.appendChild(closeOthersBtnEl);

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
    
    tabEl.addEventListener('click', () => openTabHandler(tab));
    tabEl.addEventListener('keydown', e => {
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
