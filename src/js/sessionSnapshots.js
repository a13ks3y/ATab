const { getTabs } = require('./getTabs');

const STORAGE_KEY = 'atab_session_snapshots';
let currentSessionOpen = false;

function initSessionSnapshots() {
    const toggleBtn = document.getElementById('sessions-toggle');
    const modal = document.getElementById('sessions-modal');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    const saveBtn = document.getElementById('btn-save-session');
    const sessionNameInput = document.getElementById('session-name-input');
    const sessionsList = document.getElementById('sessions-list');

    if (!toggleBtn || !modal) return;

    // Toggle Modal
    toggleBtn.addEventListener('click', () => {
        const isHidden = modal.classList.toggle('hidden');
        toggleBtn.setAttribute('aria-expanded', !isHidden);
        
        if (!isHidden) {
            updateSessionsList();
            sessionNameInput.focus();
            currentSessionOpen = true;
        } else {
            toggleBtn.focus();
            currentSessionOpen = false;
        }
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        currentSessionOpen = false;
        toggleBtn.focus();
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on click outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close on Escape
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Save Session
    if (saveBtn && sessionNameInput) {
        saveBtn.addEventListener('click', async () => {
            const name = sessionNameInput.value.trim() || `Session ${new Date().toLocaleString()}`;
            await saveCurrentSession(name);
            sessionNameInput.value = '';
            updateSessionsList();
        });

        // Allow Enter key to save
        sessionNameInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const name = sessionNameInput.value.trim() || `Session ${new Date().toLocaleString()}`;
                await saveCurrentSession(name);
                sessionNameInput.value = '';
                updateSessionsList();
            }
        });
    }

    // Initial render not needed until opened, but good to have prepared if needed.
}

async function saveCurrentSession(name) {
    const tabs = await getTabs();
    // Filter out the extension itself if needed, but usually users might want to save everything.
    // However, saving the "New Tab" page (this extension) is redundant if it's just the dashboard.
    // Let's filter out chrome://newtab and the extension URL.
    const validTabs = tabs.filter(t => !t.url.startsWith('chrome://newtab') && !t.url.startsWith(chrome.runtime.getURL('')));
    
    if (validTabs.length === 0) {
        alert('No tabs to save!');
        return;
    }

    const session = {
        id: Date.now().toString(),
        name: name,
        timestamp: Date.now(),
        tabs: validTabs.map(t => ({
            title: t.title,
            url: t.url,
            favIconUrl: t.favIconUrl,
            pinned: t.pinned
        }))
    };

    const sessions = await getStoredSessions();
    sessions.unshift(session); // Add to top
    await saveStoredSessions(sessions);
}

async function getStoredSessions() {
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            resolve(result[STORAGE_KEY] || []);
        });
    });
}

async function saveStoredSessions(sessions) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: sessions }, resolve);
    });
}

async function deleteSession(sessionId) {
    const sessions = await getStoredSessions();
    const newSessions = sessions.filter(s => s.id !== sessionId);
    await saveStoredSessions(newSessions);
    updateSessionsList();
}

async function restoreSession(sessionId) {
    const sessions = await getStoredSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Open all tabs
    for (const tab of session.tabs) {
        chrome.tabs.create({
            url: tab.url,
            active: false, // Open in background to not lose focus immediately? Or maybe active true for first one?
            pinned: tab.pinned
        });
    }
}

async function updateSessionsList() {
    const sessionsList = document.getElementById('sessions-list');
    if (!sessionsList) return;

    sessionsList.innerHTML = '';
    const sessions = await getStoredSessions();

    if (sessions.length === 0) {
        sessionListEmptyState(sessionsList);
        return;
    }

    sessions.forEach(session => {
        const li = document.createElement('li');
        li.className = 'session-item';
        
        const details = document.createElement('div');
        details.className = 'session-details';
        
        const name = document.createElement('div');
        name.className = 'session-name';
        name.textContent = session.name;
        
        const meta = document.createElement('div');
        meta.className = 'session-meta';
        meta.textContent = `${session.tabs.length} tabs • ${new Date(session.timestamp).toLocaleDateString()}`;

        details.appendChild(name);
        details.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'session-actions';

        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = 'Restore';
        restoreBtn.className = 'btn-restore-session';
        restoreBtn.setAttribute('aria-label', `Restore session ${session.name}`);
        restoreBtn.onclick = () => restoreSession(session.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;'; // Delete icon
        deleteBtn.className = 'btn-delete-session';
        deleteBtn.title = 'Delete Session';
        deleteBtn.setAttribute('aria-label', `Delete session ${session.name}`);
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Delete session "${session.name}"?`)) {
                deleteSession(session.id);
            }
        };

        actions.appendChild(restoreBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(details);
        li.appendChild(actions);
        
        sessionsList.appendChild(li);
    });
}

function sessionListEmptyState(container) {
    const div = document.createElement('div');
    div.style.padding = '20px';
    div.style.textAlign = 'center';
    div.style.opacity = '0.7';
    div.textContent = 'No saved sessions yet.';
    container.appendChild(div);
}

module.exports = {
    initSessionSnapshots
};
