
const STORAGE_KEY_TABS = 'analytics_tabs';
const STORAGE_KEY_POMODORO = 'analytics_pomodoro';

export function initAnalytics() {
    // Listen for tab events
    chrome.tabs.onCreated.addListener(() => {
        logTabEvent('created');
    });

    chrome.tabs.onRemoved.addListener(() => {
        logTabEvent('removed');
    });

    // Initialize storage if empty
    chrome.storage.local.get([STORAGE_KEY_TABS, STORAGE_KEY_POMODORO], (result) => {
        if (!result[STORAGE_KEY_TABS]) {
            chrome.storage.local.set({ [STORAGE_KEY_TABS]: {} });
        }
        if (!result[STORAGE_KEY_POMODORO]) {
            chrome.storage.local.set({ [STORAGE_KEY_POMODORO]: [] });
        }
    });

    setupAnalyticsUI();
}

function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

function logTabEvent(type) {
    const date = getTodayDateString();
    chrome.storage.local.get([STORAGE_KEY_TABS], (result) => {
        const data = result[STORAGE_KEY_TABS] || {};
        if (!data[date]) {
            data[date] = { created: 0, removed: 0 };
        }
        
        if (type === 'created') data[date].created++;
        if (type === 'removed') data[date].removed++;
        
        chrome.storage.local.set({ [STORAGE_KEY_TABS]: data });
    });
}

export function logPomodoroSession(mode, durationMinutes) {
    const session = {
        timestamp: Date.now(),
        date: getTodayDateString(),
        mode: mode, // 'work', 'shortBreak', 'longBreak'
        duration: durationMinutes
    };

    chrome.storage.local.get([STORAGE_KEY_POMODORO], (result) => {
        const sessions = result[STORAGE_KEY_POMODORO] || [];
        sessions.push(session);
        chrome.storage.local.set({ [STORAGE_KEY_POMODORO]: sessions });
    });
}

export function getAnalyticsData(days = 7) {
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY_TABS, STORAGE_KEY_POMODORO], (result) => {
            const tabData = result[STORAGE_KEY_TABS] || {};
            const pomodoroData = result[STORAGE_KEY_POMODORO] || [];
            
            const dates = [];
            for (let i = 0; i < days; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dates.push(d.toISOString().split('T')[0]);
            }
            dates.reverse(); // Oldest to newest

            const chartData = dates.map(date => {
                const tabs = tabData[date] || { created: 0, removed: 0 };
                const sessions = pomodoroData.filter(p => p.date === date && p.mode === 'work');
                const focusTime = sessions.reduce((acc, curr) => acc + curr.duration, 0);
                
                return {
                    date,
                    tabsCreated: tabs.created,
                    tabsRemoved: tabs.removed,
                    focusTimeMinutes: focusTime
                };
            });

            resolve(chartData);
        });
    });
}

function setupAnalyticsUI() {
    const openBtn = document.getElementById('analytics-toggle');
    const modal = document.getElementById('analytics-modal');
    const closeBtn = document.getElementById('close-analytics');
    
    if (openBtn && modal) {
        openBtn.addEventListener('click', async () => {
             const isHidden = modal.classList.toggle('hidden');
             openBtn.setAttribute('aria-expanded', !isHidden);
             
             if (!isHidden) {
                 const data = await getAnalyticsData(7);
                 renderCharts(data);
                 if (closeBtn) closeBtn.focus();
             } else {
                 openBtn.focus();
             }
        });
        
        const closeModal = () => {
            modal.classList.add('hidden');
            openBtn.setAttribute('aria-expanded', 'false');
            openBtn.focus();
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

function renderCharts(data) {
    const container = document.getElementById('analytics-charts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create Tab Usage Chart
    const tabChart = createBarChart(data, 'tabsCreated', 'Tabs Created (Last 7 Days)', '#4285f4');
    container.appendChild(tabChart);

    // Create Focus Time Chart
    const focusChart = createBarChart(data, 'focusTimeMinutes', 'Focus Time (Minutes)', '#34a853');
    container.appendChild(focusChart);
}

function createBarChart(data, dataKey, title, color) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chart-wrapper';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    wrapper.appendChild(titleEl);
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d[dataKey]), 1); // Avoid div by zero
    
    data.forEach(day => {
        const barGroup = document.createElement('div');
        barGroup.className = 'bar-group';
        
        const value = day[dataKey];
        const heightPercent = (value / maxValue) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${heightPercent}%`;
        bar.style.backgroundColor = color;
        bar.setAttribute('title', `${day.date}: ${value}`);
        
        const label = document.createElement('span');
        label.className = 'bar-label';
        // Format date to MM-DD
        const dateParts = day.date.split('-');
        label.textContent = `${dateParts[1]}/${dateParts[2]}`;
        
        const valueLabel = document.createElement('span');
        valueLabel.className = 'value-label';
        valueLabel.textContent = value;
        
        barGroup.appendChild(valueLabel); // Show value on top
        barGroup.appendChild(bar);
        barGroup.appendChild(label); // Show date at bottom
        
        chartContainer.appendChild(barGroup);
    });
    
    wrapper.appendChild(chartContainer);
    return wrapper;
}
