
const { initQuickNotes } = require('./quickNotes');

let mockStore = {};

const chromeMock = {
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        const result = {};
        if (Array.isArray(keys)) {
            keys.forEach(k => {
                if (mockStore[k]) result[k] = mockStore[k];
            });
        }
        callback(result);
      }),
      set: jest.fn((items, callback) => {
        Object.keys(items).forEach(k => {
            mockStore[k] = items[k];
        });
        if (callback) callback();
      })
    }
  }
};

global.chrome = chromeMock;

describe('Quick Notes Widget', () => {
    let toggleBtn, widget, closeBtn, textarea;

    beforeEach(() => {
        // Set window.chrome here too, as JSDOM might reset window properties
        window.chrome = chromeMock;
        
        document.body.innerHTML = `
            <button id="notes-toggle">Notes</button>
            <div id="quick-notes-widget" class="hidden">
                <button id="close-notes">X</button>
                <textarea id="quick-notes-area"></textarea>
            </div>
        `;

        toggleBtn = document.getElementById('notes-toggle');
        widget = document.getElementById('quick-notes-widget');
        closeBtn = document.getElementById('close-notes');
        textarea = document.getElementById('quick-notes-area');
        
        mockStore = {};
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes and loads saved notes', () => {
        mockStore['quickNotes'] = 'Saved note';
        initQuickNotes();
        expect(chrome.storage.local.get).toHaveBeenCalledWith(['quickNotes'], expect.any(Function));
        expect(textarea.value).toBe('Saved note');
    });

    test('toggles visibility', () => {
        initQuickNotes();
        expect(widget.classList.contains('hidden')).toBe(true);
        
        toggleBtn.click();
        expect(widget.classList.contains('hidden')).toBe(false);
        
        // Should focus textarea when opened
        expect(document.activeElement).toBe(textarea);
        
        toggleBtn.click();
        expect(widget.classList.contains('hidden')).toBe(true);
    });

    test('closes via close button', () => {
        initQuickNotes();
        toggleBtn.click();
        expect(widget.classList.contains('hidden')).toBe(false);

        closeBtn.click();
        expect(widget.classList.contains('hidden')).toBe(true);
    });

    test('saves notes with debounce', () => {
        initQuickNotes();
        
        textarea.value = 'New note';
        textarea.dispatchEvent(new Event('input'));
        
        expect(chrome.storage.local.set).not.toHaveBeenCalled();
        
        jest.advanceTimersByTime(500);
        
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ quickNotes: 'New note' });
    });
});
