const { showContextMenu } = require('./contextMenu');

function createTabEl(tab, openTabHandler = () => {
}, closeTabHandler = () => {
}, currentSideIndex = 0, tabIndex = 0) {
    const tabEl = document.createElement('a');
    // Ensure ID is unique and valid for DOM
    const domId = tab.isBookmark ? `bookmark-${tab.id}` : `tab-${tab.id}`;
    tabEl.id = domId;
    tabEl.href = '#'; // Make it a valid link anchor
    tabEl.setAttribute('role', 'button'); // It acts as a button/trigger
    tabEl.setAttribute('aria-label', `Switch to ${tab.title}`);
    tabEl.setAttribute('data-tab-id', tab.id);
    tabEl.setAttribute('tabIndex', '0'); // Use natural tab order
    
    if (tab.groupColor) {
        tabEl.classList.add('has-group');
        tabEl.style.setProperty('--group-color', `var(--group-color-${tab.groupColor})`);
        
        const groupIndicator = document.createElement('div');
        groupIndicator.className = 'group-indicator';
        groupIndicator.title = tab.groupTitle || 'Group';
        tabEl.appendChild(groupIndicator);
    }

    if (tab.isBookmark) {
        tabEl.classList.add('is-bookmark');
        tabEl.setAttribute('data-is-bookmark', 'true');
    }

    if (tab.discarded) {
        tabEl.classList.add('discarded');
    }

    // Add context menu listener
    tabEl.addEventListener('contextmenu', (e) => {
        // Only show context menu for real tabs, or adapt for bookmarks later
        if (!tab.isBookmark) {
            showContextMenu(e, tab, closeTabHandler);
        }
    });

    if (tab.url === "chrome://newtab/") {
        tab["favIconUrl"] = "icons/ATab-128x128.png"
    }
    const favIconUrl = tab["favIconUrl"] || (tab.url === "chrome://newtab/" ? "icons/ATab-128x128.png" : null);
    const tabImgEl = document.createElement('img');
    tabImgEl.alt = ""; // Decorative or redundant with text below
    tabEl.appendChild(tabImgEl);
    tabImgEl.src = favIconUrl ? favIconUrl : 'icons/gear.png';

    const tabElTitle = document.createElement('h6');
    tabElTitle.textContent = tab["title"];
    tabEl.appendChild(tabElTitle);

    if (tab.isBookmark) {
        // Add bookmark indicator icon
        const bookmarkIcon = document.createElement('div');
        bookmarkIcon.className = 'bookmark-indicator';
        bookmarkIcon.innerHTML = '★';
        bookmarkIcon.title = 'Bookmark';
        tabEl.appendChild(bookmarkIcon);
        
        // Skip adding close buttons for bookmarks
    } else {
        // Close button
        const closeBtnEl = document.createElement('button');
        closeBtnEl.className = 'close-btn';
        closeBtnEl.setAttribute('aria-label', `Close ${tab.title}`);
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
    closeOthersBtnEl.setAttribute('aria-label', `Close other tabs`);
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
    }

    // Drag and Drop (Reorder Tabs)
    if (!tab.isBookmark) {
    tabEl.draggable = true;
    
    tabEl.addEventListener('dragstart', (e) => {
        document.body.classList.add('dragging-mode');
        tabEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        // We set the tab ID as data so we know what is being dragged
        const data = JSON.stringify({id: tab.id, index: tab.index});
        e.dataTransfer.setData('text/plain', data);
    });
    
    tabEl.addEventListener('dragend', () => {
        document.body.classList.remove('dragging-mode');
        tabEl.classList.remove('dragging');
        // Remove drag-over class from all potential drop targets
        document.querySelectorAll('#tabs a').forEach(el => el.classList.remove('drag-over'));
    });
    
    tabEl.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessary for drop to work
        e.dataTransfer.dropEffect = 'move';
        return false;
    });

    tabEl.addEventListener('dragenter', (e) => {
        e.preventDefault();
        tabEl.classList.add('drag-over');
    });

    tabEl.addEventListener('dragleave', (e) => {
        // With pointer-events: none on children during drag, 
        // we can simply check if relatedTarget is not inside the tabEl
        // or just rely on the fact that children won't trigger events.
        
        // However, if we move fast, we might leave the element.
        // If we leave the element, dragleave fires on tabEl.
        tabEl.classList.remove('drag-over');
    });

    tabEl.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop bubbling
        tabEl.classList.remove('drag-over');

        const dataStr = e.dataTransfer.getData('text/plain');
        if (!dataStr) return;

        try {
            const data = JSON.parse(dataStr);
            const sourceTabId = data.id;
            const targetIndex = tab.index;

            // If we are dropping on itself do nothing
            if (sourceTabId === tab.id) return;

            // Move the tab using chrome.tabs.move
            if (window.chrome && window.chrome.tabs) {
                // If moving to a higher index, chrome moves it and shifts others accordingly.
                // e.g. [0, 1, 2, 3]. Move 0 to 2. Result: [1, 2, 0, 3].
                // e.g. [0, 1, 2, 3]. Move 2 to 0. Result: [2, 0, 1, 3].
                // The API expects the *destination* index.
                 
                // One edge case: if we drag from left to right (sourceIndex < targetIndex),
                // dragging 0 onto 1. We want 0 to be *after* 1. 
                // But targetIndex is 1. If we move to 1, 0 takes 1's spot, 1 shifts to 2. Result: [0, 1]. NO.
                // Wait. 
                // [A(0), B(1)]. move(A, 1). 
                // Result: A is inserted at index 1.
                // Array before: [A, B]. Remove A -> [B]. Insert A at 1 -> [B, A].
                // So move(A, 1) results in index 0->B, index 1->A. Correct.
                
                // [A(0), B(1), C(2)]. Move A onto C(2).
                // move(A, 2).
                // Array before: [A, B, C]. Remove A -> [B, C]. Insert A at 2 -> [B, C, A].
                // Correct.
                
                // [A(0), B(1), C(2)]. Move C onto A(0).
                // move(C, 0).
                // Array before: [A, B, C]. Remove C -> [A, B]. Insert C at 0 -> [C, A, B].
                // Correct.
                
                // So simply moving to targetIndex works for "insert at this position".
                // If the user drops *on* a tab, they usually expect it to take that spot.
                
                window.chrome.tabs.move(Number(sourceTabId), { index: targetIndex });
            }
        } catch (err) {
            console.error('Drag drop error:', err);
        }
        return false;
    });
    }

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
        if (e.code === 'KeyX' && !tab.isBookmark) {
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
