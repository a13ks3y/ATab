const { initAnalytics, logPomodoroSession, getAnalyticsData } = require('./analytics.js');

// Mock chrome API
const chromeMock = {
    storage: {
        local: {
            get: jest.fn(),
            set: jest.fn()
        }
    },
    tabs: {
        onCreated: { addListener: jest.fn() },
        onRemoved: { addListener: jest.fn() }
    }
};

global.chrome = chromeMock;

describe('Analytics Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup initial storage state
        chromeMock.storage.local.get.mockImplementation((keys, callback) => {
            const data = {};
            keys.forEach(key => {
                if (key === 'analytics_tabs') data[key] = {};
                if (key === 'analytics_pomodoro') data[key] = [];
            });
            callback(data);
        });
    });

    test('initAnalytics initializes storage and listeners', () => {
        initAnalytics();
        
        expect(chromeMock.tabs.onCreated.addListener).toHaveBeenCalled();
        expect(chromeMock.tabs.onRemoved.addListener).toHaveBeenCalled();
        expect(chromeMock.storage.local.get).toHaveBeenCalledWith(
            ['analytics_tabs', 'analytics_pomodoro'], 
            expect.any(Function)
        );
    });

    test('logPomodoroSession saves session correctly', () => {
        const mode = 'work';
        const duration = 25;
        
        // Determine today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Mock get to return empty array
        chromeMock.storage.local.get.mockImplementation((keys, callback) => {
            callback({ analytics_pomodoro: [] });
        });

        logPomodoroSession(mode, duration);

        expect(chromeMock.storage.local.set).toHaveBeenCalledTimes(1);
        const setCall = chromeMock.storage.local.set.mock.calls[0][0];
        expect(setCall.analytics_pomodoro).toHaveLength(1);
        expect(setCall.analytics_pomodoro[0]).toEqual(expect.objectContaining({
            date: today,
            mode: 'work',
            duration: 25
        }));
    });

    test('getAnalyticsData retrieves correctly formatted data', async () => {
        const today = new Date().toISOString().split('T')[0];
        
        // Mock storage with some data
        chromeMock.storage.local.get.mockImplementation((keys, callback) => {
            const result = {
                analytics_tabs: {
                    [today]: { created: 5, removed: 3 }
                },
                analytics_pomodoro: [
                    { date: today, mode: 'work', duration: 25 },
                    { date: today, mode: 'shortBreak', duration: 5 }
                ]
            };
            callback(result);
        });

        const data = await getAnalyticsData(7);
        
        // Find today's entry (last one)
        const todayEntry = data.find(d => d.date === today);
        
        expect(todayEntry).toBeDefined();
        expect(todayEntry.tabsCreated).toBe(5);
        expect(todayEntry.tabsRemoved).toBe(3);
        // Only work sessions count towards focus time
        expect(todayEntry.focusTimeMinutes).toBe(25);
    });
});
