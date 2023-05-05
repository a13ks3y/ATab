import '../css/reset.css';
import '../css/index.css';
import {getTabs} from "./getTabs";
import {createTabEl} from "./createTabEl";
import { getBookmarks } from './getBookmarks.js';
import { createBookmarkEl } from './createBookmarkEl.js';

if (!(window['chrome'] && window['chrome']['tabs'])) {
    throw new Error("THIS CODE SHOULD RUN ONLY AS CHROME EXTENSION!!!");
}
function renderTabs() {
    chrome.windows.getCurrent(async wnd => {
        const tabsEl = document.getElementById('tabs');
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
    });
}

renderTabs();

window.chrome.tabs.onUpdated.addListener(e => setTimeout(renderTabs));
window.chrome.tabs.onActivated.addListener(e => setTimeout(renderTabs));
window.chrome.tabs.onRemoved.addListener(e => {
    const tabEl = document.getElementById('tab-' + e);
    if (tabEl) {
        tabEl.parentNode.removeChild(tabEl);
    }
});

function openTab(tab) {
    window.chrome.tabs.update(tab.id, {active: true});
}

function closeTab(tab) {
    window.chrome.tabs.remove(tab.id);
}

document.addEventListener('readystatechange', async () => {
    const clockEl = document.getElementById('clock');
    clockEl && setInterval(updateClock, 1000) && updateClock();

    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString();
    }

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const searchQuery = searchForm.q.value;

        if (isUrl(searchQuery)) {
            location.replace(searchQuery);
        } else {
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            location.replace(googleSearchUrl);
        }
        return false;
    });

    const bookmarks = (await getBookmarks()).filter(b => b.title.length > 2);
    const bookmarksEl = document.getElementById('bookmarks');
    bookmarks.forEach(bookmark => {
        const el = createBookmarkEl(bookmark);
        bookmarksEl.appendChild(el);
    });

});
setTimeout(() => {
    const searchInputEl = document.getElementById('q');
    searchInputEl.focus({
        focusVisible: true
    });
}, 666);


function isUrl(value) {
    try {
        new URL(value);
        return true;
    } catch (e) {
        return false;
    }
}
