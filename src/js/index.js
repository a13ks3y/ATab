import '../css/reset.css';
import '../css/index.css';
import {getTabs} from "./getTabs";
import {createTabEl} from "./createTabEl";

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
        tabs.forEach(tab => {
            const tabEl = createTabEl(tab, openTab, closeTab, currentSideIndex);
            currentSideIndex = currentSideIndex >= 4 ? 0 : currentSideIndex + 1;
            tabsEl.appendChild(tabEl);
        });
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

window.chrome.bookmarks.getTree((bookmarks) => {
    console.log(bookmarks);
});


document.addEventListener('readystatechange', () => {
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
