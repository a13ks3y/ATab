
const { openRecentHistoryModal, initRecentHistory } = require('./recentHistory');

describe('Recent History', () => {
    let mockSessions;
    let modal, list;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div id="recent-history-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <ul id="recent-history-list"></ul>
                </div>
            </div>
        `;
        modal = document.getElementById('recent-history-modal');
        list = document.getElementById('recent-history-list');

        // Mock Chrome API
        mockSessions = [
            { 
                lastModified: 1234567890,
                tab: {
                    sessionId: 'session1',
                    title: 'Test Tab 1',
                    url: 'http://example.com/1',
                    favIconUrl: 'http://example.com/favicon.ico'
                },
                sessionId: 'session1'
            },
            {
                lastModified: 1234567891,
                window: {
                    sessionId: 'session2',
                    tabs: [{}, {}]
                },
                sessionId: 'session2'
            }
        ];

        global.chrome = {
            sessions: {
                getRecentlyClosed: jest.fn((options, callback) => callback(mockSessions)),
                restore: jest.fn((sessionId, callback) => callback && callback())
            }
        };
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    test('openRecentHistoryModal fetches sessions and populates list', () => {
        openRecentHistoryModal();

        expect(chrome.sessions.getRecentlyClosed).toHaveBeenCalledWith({ maxResults: 25 }, expect.any(Function));
        expect(modal.classList.contains('hidden')).toBe(false);
        expect(list.children.length).toBe(2);

        const firstItem = list.children[0];
        expect(firstItem.querySelector('.recent-history-title').textContent).toBe('Test Tab 1');
        expect(firstItem.querySelector('.btn-restore')).toBeTruthy();
    });

    test('openRecentHistoryModal handles empty sessions', () => {
        chrome.sessions.getRecentlyClosed.mockImplementation((opts, cb) => cb([]));
        
        openRecentHistoryModal();

        expect(list.children.length).toBe(1);
        expect(list.textContent).toContain('No recently closed tabs');
    });

    test('restore button calls chrome.sessions.restore', () => {
        openRecentHistoryModal();
        
        const firstItem = list.children[0];
        const restoreBtn = firstItem.querySelector('.btn-restore');
        restoreBtn.click();

        expect(chrome.sessions.restore).toHaveBeenCalledWith('session1', expect.any(Function));
        // Should close modal
        expect(modal.classList.contains('hidden')).toBe(true);
    });
    
    test('initRecentHistory sets up close handlers', () => {
        initRecentHistory();
        
        modal.classList.remove('hidden');
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.click();
        
        expect(modal.classList.contains('hidden')).toBe(true);
    });
});
