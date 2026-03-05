
const { isUrl } = require("./isUrl.js");

let isReadingListOpen = false;

function initReadingList() {
    if (!chrome.readingList) {
        console.warn("Reading List API not available");
        const btn = document.getElementById('reading-list-toggle');
        if (btn) btn.style.display = 'none';
        return;
    }

    const toggleBtn = document.getElementById('reading-list-toggle');
    const sidebar = document.getElementById('reading-list-sidebar');
    const closeBtn = document.getElementById('close-reading-list');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleReadingList);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
             const sidebar = document.getElementById('reading-list-sidebar');
             if (sidebar) sidebar.classList.add('hidden');
             const toggle = document.getElementById('reading-list-toggle');
             if (toggle) {
                 toggle.setAttribute('aria-expanded', 'false');
                 toggle.focus();
             }
             isReadingListOpen = false;
        });
    }

    // Escape listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isReadingListOpen) {
             const sidebar = document.getElementById('reading-list-sidebar');
             if (sidebar && !sidebar.classList.contains('hidden')) {
                 sidebar.classList.add('hidden');
                 const toggle = document.getElementById('reading-list-toggle');
                 if (toggle) {
                     toggle.setAttribute('aria-expanded', 'false');
                     toggle.focus();
                 }
                 isReadingListOpen = false;
             }
        }
    });

    // Listen for changes
    chrome.readingList.onEntryAdded.addListener(renderReadingList);
    chrome.readingList.onEntryRemoved.addListener(renderReadingList);
    chrome.readingList.onEntryUpdated.addListener(renderReadingList);
}

async function toggleReadingList() {
    if (!chrome.readingList) return;

    const sidebar = document.getElementById('reading-list-sidebar');
    const toggleBtn = document.getElementById('reading-list-toggle');

    if (!sidebar) return;

    // Close bookmark panel if open, to avoid overlap or clutter
    const bookmarksPanel = document.getElementById('bookmarks');
    if (bookmarksPanel && !bookmarksPanel.classList.contains('hidden')) {
        bookmarksPanel.classList.add('hidden');
    }

    // Toggle
    if (!sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
        isReadingListOpen = false;
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        }
    } else {
        sidebar.classList.remove('hidden');
        isReadingListOpen = true;
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
        
        // Render first
        await renderReadingList();

        // Then focus close button or first item
        const closeBtn = document.getElementById('close-reading-list');
        if (closeBtn) closeBtn.focus();
    }
}

async function renderReadingList() {
    const sidebar = document.getElementById('reading-list-sidebar');
    if (!sidebar || sidebar.classList.contains('hidden')) return;

    const content = sidebar.querySelector('.reading-list-content');
    if (!content) return;

    // Only show loading if empty? 
    if (!content.hasChildNodes()) {
        content.innerHTML = '<div class="reading-list-loading" style="padding:1rem; text-align:center; color:var(--text-color);">Loading...</div>';
    }

    try {
        const items = await chrome.readingList.query({});
        
        // Sort: Unread first, then by creation time descending (newest first)
        items.sort((a, b) => {
            if (a.hasBeenRead !== b.hasBeenRead) {
                // Unread (false) first
                return a.hasBeenRead ? 1 : -1; 
            }
            return (b.creationTime || 0) - (a.creationTime || 0);
        });

        content.innerHTML = '';

        if (items.length === 0) {
            content.innerHTML = '<div class="reading-list-empty" style="padding:1rem; text-align:center; color:var(--text-color); opacity:0.7;">Reading list is empty</div>';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = `reading-list-item ${item.hasBeenRead ? 'read' : 'unread'}`;
            
            // Content Container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'reading-list-item-content';
            
            // Title Link
            const titleLink = document.createElement('a');
            titleLink.href = item.url;
            titleLink.textContent = item.title || item.url;
            titleLink.className = 'reading-list-title';
            titleLink.title = item.title;
            
            // Just standard link behavior for now

            // Domain/URL
            const urlSpan = document.createElement('span');
            try {
                const urlObj = new URL(item.url);
                urlSpan.textContent = urlObj.hostname;
            } catch (e) {
                urlSpan.textContent = item.url;
            }
            urlSpan.className = 'reading-list-url';

            contentDiv.appendChild(titleLink);
            contentDiv.appendChild(urlSpan);

            // Actions Container
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'reading-list-actions';

            // Mark Read/Unread Button
            const toggleReadBtn = document.createElement('button');
            toggleReadBtn.className = 'reading-list-btn mark-read-btn';
            
            if (item.hasBeenRead) {
                toggleReadBtn.innerHTML = '●'; // Dot to mark unread? Or circle?
                toggleReadBtn.title = "Mark as unread";
                toggleReadBtn.style.opacity = '0.5';
            } else {
                toggleReadBtn.innerHTML = '✓'; // Checkmark to mark read
                toggleReadBtn.title = "Mark as read";
                toggleReadBtn.style.color = 'var(--bookmark-color)';
                toggleReadBtn.style.fontWeight = 'bold';
            }
            
            toggleReadBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    await chrome.readingList.updateEntry({
                        url: item.url,
                        hasBeenRead: !item.hasBeenRead
                    });
                } catch (err) {
                    console.error("Failed to update entry", err);
                }
            };

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'reading-list-btn delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Remove';
            
            deleteBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Remove from reading list?')) {
                    try {
                        await chrome.readingList.removeEntry({
                            url: item.url
                        });
                    } catch (err) {
                        console.error("Failed to remove entry", err);
                    }
                }
            };

            actionsDiv.appendChild(toggleReadBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(contentDiv);
            li.appendChild(actionsDiv);
            ul.appendChild(li);
        });

        content.appendChild(ul);
    } catch (err) {
        console.error("Failed to load reading list", err);
        var msg = '<div class="reading-list-error" style="color:red; padding:1rem;">Failed to load reading list.</div>';
        if (err.message && err.message.includes('permission')) {
             msg += '<div style="font-size:0.8em; opacity:0.8;">Please grant "readingList" permission in manifest.</div>';
        }
        content.innerHTML = msg;
    }
}

exports.initReadingList = initReadingList;
exports.toggleReadingList = toggleReadingList;
