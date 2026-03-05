
const { initSettings } = require('./settings.js');

// Mocks
const mockSyncStorage = {
    get: jest.fn(),
    set: jest.fn()
};
const mockLocalStorage = {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn()
};
const mockOnChanged = {
    addListener: jest.fn()
};

describe('Settings Module', () => {
    beforeEach(() => {
        // Setup global chrome mock
        global.chrome = {
            storage: {
                sync: mockSyncStorage,
                local: mockLocalStorage,
                onChanged: mockOnChanged
            },
            runtime: { lastError: null }
        };

        document.body.className = '';
        document.body.style.backgroundImage = '';
        
        // Use mockClear instead of mockReset to keep basic behavior if any (though jest.fn default is undefined)
        mockSyncStorage.get.mockClear();
        mockSyncStorage.set.mockClear();
        mockLocalStorage.get.mockClear();
        mockLocalStorage.set.mockClear();
        mockLocalStorage.remove.mockClear();
        mockOnChanged.addListener.mockClear();
        
        // Set default implementation
        mockSyncStorage.get.mockImplementation((k, cb) => { console.log('DEFAULT SYNC GET'); cb({}); });
        mockLocalStorage.get.mockImplementation((k, cb) => { console.log('DEFAULT LOCAL GET'); cb({}); });

        document.body.innerHTML = `
            <button id="settings-toggle"></button>
            <div id="settings-modal" class="hidden">
                <span class="close-modal"></span>
                <select id="setting-density">
                    <option value="compact">Compact</option>
                    <option value="normal" selected>Normal</option>
                    <option value="spacious">Spacious</option>
                </select>
                <div class="settings-group">
                    <input id="setting-bg-image" />
                    <input type="file" id="setting-bg-file" />
                    <button id="bg-file-clear"></button>
                    <div id="bg-file-info" style="display:none"></div>
                </div>
                <input type="checkbox" id="setting-animations" checked />
                <select id="setting-stale-threshold">
                    <option value="604800000" selected>1 Week</option>
                </select>
                <button id="export-settings-btn"></button>
                <button id="import-settings-btn"></button>
                <input type="file" id="import-settings-file" />
            </div>
        `;
    });

    // Test successful loading from Sync (should also check local for custom bg)
    test('should load settings from sync and check local', async () => {
        // Mock Sync Result
        mockSyncStorage.get.mockImplementation((keys, callback) => {
            callback({
                settings: {
                    gridDensity: 'compact',
                    backgroundImage: 'sync-bg.jpg',
                    animationsEnabled: false
                }
            });
        });
        
        // Mock Local Result (empty custom bg)
        mockLocalStorage.get.mockImplementation((keys, callback) => {
            // Check if asking for customBackgroundImage
            if (keys && keys.includes('customBackgroundImage')) {
                callback({});
            } else {
                callback({}); 
            }
        });

        await initSettings();
        
        expect(mockSyncStorage.get).toHaveBeenCalled();
        expect(mockLocalStorage.get).toHaveBeenCalled();
        
        expect(document.body.classList.contains('density-compact')).toBe(true);
        // Normalized URL value might lack quotes
        expect(document.body.style.backgroundImage).toMatch(/url\(.*sync-bg\.jpg.*\)/);
    });

    // Test custom background override
    test('should override sync background with local custom uploaded image', async () => {
        // Sync has a URL
        mockSyncStorage.get.mockImplementation((keys, callback) => {
            callback({
                settings: {
                    backgroundImage: 'https://example.com/sync.jpg' 
                }
            });
        });
        
        // Local has a data URL
        mockLocalStorage.get.mockImplementation((keys, callback) => {
            if (keys && keys.includes('customBackgroundImage')) {
                callback({ customBackgroundImage: 'data:image/png;base64,xxxx' });
            } else {
                callback({});
            }
        });

        await initSettings();
        
        expect(document.body.style.backgroundImage).toMatch(/url\(.*data:image\/png;base64,xxxx.*\)/);
        
        // Open settings to trigger UI update (inputs are populated on open)
        document.getElementById('settings-toggle').click();

        // Check UI reflects usage of uploaded image
        const bgInput = document.getElementById('setting-bg-image');
        expect(bgInput.placeholder).toContain("uploaded");
        expect(bgInput.disabled).toBe(true);
    });

    // Added wait step to allow promise resolution in listener test
    test('should apply changes when sync storage updates', async () => {
        mockSyncStorage.get.mockImplementation((keys, callback) => callback({})); // initial load
        mockLocalStorage.get.mockImplementation((keys, callback) => callback({}));

        await initSettings();

        const listener = mockOnChanged.addListener.mock.calls[0][0];
        
        // Mock subsequent load
        mockSyncStorage.get.mockImplementation((keys, callback) => {
            callback({
                 settings: { gridDensity: 'spacious' }
            });
        });
        mockLocalStorage.get.mockImplementation((keys, callback) => callback({}));

        // Trigger change
        listener({
            settings: { newValue: { gridDensity: 'spacious' } }
        }, 'sync');

        // Wait for microtasks
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(document.body.classList.contains('density-spacious')).toBe(true);
    });
});
