const { showContextMenu } = require('./contextMenu');

describe('contextMenu', () => {
    let mockRefreshTab;
    let mockTab;
    let mockEvent;
    
    beforeEach(() => {
        document.body.innerHTML = '';
        
        mockRefreshTab = {
            id: 123,
            pinned: false,
            active: false,
            discarded: false,
            mutedInfo: { muted: false }
        };

        mockTab = {
            id: 123
        };

        mockEvent = {
            preventDefault: jest.fn(),
            pageX: 100,
            pageY: 100
        };

        global.chrome = {
            tabs: {
                get: jest.fn((id, callback) => callback(mockRefreshTab)),
                duplicate: jest.fn(),
                update: jest.fn(),
                discard: jest.fn()
            },
            runtime: {
                lastError: null
            }
        };
    });

    test('should show Discard option for inactive, non-discarded tabs', () => {
        showContextMenu(mockEvent, mockTab, jest.fn());
        
        const menu = document.querySelector('.context-menu');
        expect(menu).not.toBeNull();
        
        const items = Array.from(menu.querySelectorAll('li')).map(li => li.textContent);
        expect(items).toContain('Discard (Memory Saver)');
    });

    test('should NOT show Discard option for active tabs', () => {
        mockRefreshTab.active = true;
        
        showContextMenu(mockEvent, mockTab, jest.fn());
        
        const menu = document.querySelector('.context-menu');
        const items = Array.from(menu.querySelectorAll('li')).map(li => li.textContent);
        expect(items).not.toContain('Discard (Memory Saver)');
    });

    test('should NOT show Discard option for already discarded tabs', () => {
        mockRefreshTab.discarded = true;
        
        showContextMenu(mockEvent, mockTab, jest.fn());
        
        const menu = document.querySelector('.context-menu');
        const items = Array.from(menu.querySelectorAll('li')).map(li => li.textContent);
        expect(items).not.toContain('Discard (Memory Saver)');
    });

    test('should call chrome.tabs.discard when Discard option is clicked', () => {
        showContextMenu(mockEvent, mockTab, jest.fn());
        
        const menu = document.querySelector('.context-menu');
        const discardOption = Array.from(menu.querySelectorAll('li')).find(li => li.textContent === 'Discard (Memory Saver)');
        
        discardOption.click();
        expect(chrome.tabs.discard).toHaveBeenCalledWith(123);
    });
});