
const { initSessionSnapshots } = require('./sessionSnapshots.js');
const { getTabs } = require('./getTabs.js');

// Mock getTabs
jest.mock('./getTabs.js');

describe('Session Snapshots Module', () => {
    let mockLocalStorageAdd = jest.fn();
    let mockLocalStorageGet = jest.fn();
    let mockLocalStorageSet = jest.fn();
    let mockTabsCreate = jest.fn();
    let sessionNameInput;
    let saveBtn;
    let toggleBtn;
    let sessionsList;
    let modal;

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <button id="sessions-toggle" class="sessions-toggle">💾</button>
            <div id="sessions-modal" class="modal hidden">
                <input type="text" id="session-name-input" />
                <button id="btn-save-session">Save</button>
                <ul id="sessions-list"></ul>
                <span class="close-modal">&times;</span>
            </div>
        `;

        sessionNameInput = document.getElementById('session-name-input');
        saveBtn = document.getElementById('btn-save-session');
        toggleBtn = document.getElementById('sessions-toggle');
        sessionsList = document.getElementById('sessions-list');
        modal = document.getElementById('sessions-modal');

        // Reset Mocks
        mockLocalStorageGet.mockImplementation((keys, cb) => cb({}));
        mockLocalStorageSet.mockImplementation((data, cb) => cb && cb());
        
        global.chrome = {
            storage: {
                local: {
                    get: mockLocalStorageGet,
                    set: mockLocalStorageSet
                }
            },
            tabs: {
                create: mockTabsCreate
            },
            runtime: {
                getURL: (path) => 'chrome-extension://id/' + path
            }
        };
        
        global.alert = jest.fn();
        global.confirm = jest.fn(() => true);
        
        jest.clearAllMocks();
    });

    test('should initialize and toggle modal', () => {
        initSessionSnapshots();
        
        expect(modal.classList.contains('hidden')).toBe(true);
        toggleBtn.click();
        expect(modal.classList.contains('hidden')).toBe(false);
        expect(mockLocalStorageGet).toHaveBeenCalled();
    });

    test('should save a session', async () => {
        getTabs.mockResolvedValue([
            { title: 'Tab 1', url: 'https://example.com', favIconUrl: 'icon.png', pinned: false },
            { title: 'Tab 2', url: 'https://google.com', favIconUrl: 'icon2.png', pinned: true }
        ]);

        initSessionSnapshots();
        
        sessionNameInput.value = 'My Session';
        saveBtn.click();
        
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(getTabs).toHaveBeenCalled();
        expect(mockLocalStorageSet).toHaveBeenCalled();
        const savedData = mockLocalStorageSet.mock.calls[0][0];
        expect(savedData.atab_session_snapshots).toHaveLength(1);
        expect(savedData.atab_session_snapshots[0].name).toBe('My Session');
        expect(savedData.atab_session_snapshots[0].tabs).toHaveLength(2);
    });

    test('should restore a session', async () => {
        const mockSessions = [{
            id: '123',
            name: 'Test Session',
            timestamp: Date.now(),
            tabs: [
                { url: 'https://example.com', pinned: false },
                { url: 'https://google.com', pinned: true }
            ]
        }];
        
        mockLocalStorageGet.mockImplementation((keys, cb) => cb({ atab_session_snapshots: mockSessions }));

        initSessionSnapshots();
        toggleBtn.click(); // Open calls updateSessionsList
        
        await new Promise(resolve => setTimeout(resolve, 10)); // wait for getStoredSessions

        const restoreBtn = sessionsList.querySelector('.btn-restore-session');
        expect(restoreBtn).toBeTruthy();
        
        restoreBtn.click();
        
        await new Promise(resolve => setTimeout(resolve, 10)); // wait for restoreSession

        expect(mockTabsCreate).toHaveBeenCalledTimes(2);
        expect(mockTabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com', pinned: false }));
        expect(mockTabsCreate).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://google.com', pinned: true }));
    });

    test('should delete a session', async () => {
        const mockSessions = [{
            id: '123',
            name: 'Test Session',
            timestamp: Date.now(),
            tabs: []
        }];
        
        mockLocalStorageGet.mockImplementation((keys, cb) => cb({ atab_session_snapshots: mockSessions }));

        initSessionSnapshots();
        toggleBtn.click();
        
        await new Promise(resolve => setTimeout(resolve, 10));

        const deleteBtn = sessionsList.querySelector('.btn-delete-session');
        expect(deleteBtn).toBeTruthy();
        
        deleteBtn.click();
        
        await new Promise(resolve => setTimeout(resolve, 10)); // wait for deleteSession

        expect(mockLocalStorageSet).toHaveBeenCalled();
        const savedData = mockLocalStorageSet.mock.calls[0][0];
        expect(savedData.atab_session_snapshots).toHaveLength(0);
    });
});
