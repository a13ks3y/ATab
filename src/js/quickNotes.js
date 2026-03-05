
const STORAGE_KEY = 'quickNotes';
const DEBOUNCE_DELAY = 500;

let saveTimeout;

function initQuickNotes() {
    const toggleBtn = document.getElementById('notes-toggle');
    const widget = document.getElementById('quick-notes-widget');
    const closeBtn = document.getElementById('close-notes');
    const textarea = document.getElementById('quick-notes-area');

    if (!toggleBtn || !widget || !textarea) return;

    // Load saved notes
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
            textarea.value = result[STORAGE_KEY];
        }
    });

    // Toggle visibility
    toggleBtn.addEventListener('click', () => {
        const isHidden = widget.classList.toggle('hidden');
        toggleBtn.setAttribute('aria-expanded', !isHidden);
        
        if (!isHidden) {
            textarea.focus();
        }
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            widget.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        });
    }

    // Close on Escape
    widget.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            widget.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        }
    });

    // click outside to close (optional, but good UX)
    // deciding against it for now as it might be annoying if you click away to copy something

    // Auto-save with debounce
    textarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            chrome.storage.local.set({ [STORAGE_KEY]: textarea.value });
        }, DEBOUNCE_DELAY);
    });
}
exports.initQuickNotes = initQuickNotes;
