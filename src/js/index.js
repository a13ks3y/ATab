import '../css/reset.css';
import '../css/index.css';

if (window['chrome'] && window['chrome']['tabs']) {
    function renderTabs() {
        chrome.windows.getCurrent(wnd => {
            const tabsEl = document.getElementById('tabs');
            window.chrome.tabs.query({}, (tabs) => {
                tabsEl.innerHTML = '';
                let currentSideIndex = 0;
                tabs.filter(tab => !tab.active && tab.windowId === wnd.id).forEach(tab => {
                    const tabEl = document.createElement('a');
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
                        closeTab(tab);
                        return false;
                    });
                    tabEl.appendChild(closeBtnEl);

                    tabEl.title = tab["title"];
                    const sides = [
                        'from-left-top',
                        'from-right-top',
                        'from-left-bottom',
                        'from-right-bottom'
                    ];
                    tabEl.classList.add(sides[currentSideIndex]);
                    tabEl.id = 'tab-' + tab.id;
                    currentSideIndex = currentSideIndex >= sides.length - 1 ? 0 : currentSideIndex + 1;
                    setTimeout(() => tabEl.classList.remove(...sides), 333);
                    tabEl.addEventListener('click', e => openTab(tab));
                    tabsEl.appendChild(tabEl);
                });
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
        console.log('open tab', tab);
        window.chrome.tabs.update(tab.id, {active: true});
    }

    function closeTab(tab) {
        console.log('close tab', tab);
        window.chrome.tabs.remove(tab.id);
    }

    window.chrome.bookmarks.getTree((bookmarks) => {
        console.log(bookmarks);
    });
}

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
