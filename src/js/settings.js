
import { initWeather } from './weather.js';

const defaultSettings = {
    gridDensity: 'normal', // 'compact', 'normal', 'spacious'
    backgroundImage: '', // empty means default
    animationsEnabled: true,
    staleThreshold: 604800000, // 1 week in ms
    weatherEnabled: false,
    weatherCity: '', 
    weatherUnit: 'celsius',
    pomodoroWork: 25,
    pomodoroShort: 5,
    pomodoroLong: 15
};

let currentSettings = { ...defaultSettings };

function initSettings() {
    // Listen for changes from other devices (Sync) or Local
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, area) => {
            // Check for Sync settings changes
            if (area === 'sync' && changes.settings) {
                const newSettings = changes.settings.newValue;
                if (newSettings) {
                    loadSettings().then(() => {
                        applySettings();
                        updateUI();
                    });
                }
            }
            
            // Check for Local custom background changes
            if (area === 'local' && changes.customBackgroundImage) {
                loadSettings().then(() => {
                    applySettings();
                    updateUI();
                });
            }
        });
    }

    return loadSettings().then(() => {
        applySettings();
        initUI();
    });
}

function loadSettings() {
    return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.storage) {
            console.warn('chrome.storage not available');
            resolve();
            return;
        }

        const handleSettings = (settings, customBg) => {
            currentSettings = { ...defaultSettings, ...settings };
            if (customBg) {
                currentSettings.backgroundImage = customBg;
            }
            resolve();
        };

        // Try syncing first
        if (chrome.storage.sync) {
            chrome.storage.sync.get(['settings'], (syncResult) => {
                // Check local for custom background
                if (chrome.storage.local) {
                    chrome.storage.local.get(['customBackgroundImage'], (localResult) => {
                         // Fallback logic for migration if needed
                         if ((!syncResult || !syncResult.settings) && (!localResult || !localResult.customBackgroundImage)) {
                             // Try local 'settings' fallback
                             chrome.storage.local.get(['settings'], (localSettingsResult) => {
                                 if (localSettingsResult && localSettingsResult.settings) {
                                     handleSettings(localSettingsResult.settings, null);
                                 } else {
                                     handleSettings({}, null);
                                 }
                             });
                         } else {
                             const bg = localResult ? localResult.customBackgroundImage : null;
                             handleSettings(syncResult ? syncResult.settings : {}, bg);
                         }
                    });
                } else {
                    handleSettings(syncResult ? syncResult.settings : {}, null);
                }
            });
        } else if (chrome.storage.local) {
             // No sync available
            chrome.storage.local.get(['settings', 'customBackgroundImage'], (result) => {
                handleSettings(result.settings, result.customBackgroundImage);
            });
        } else {
            resolve();
        }
    });
}

function saveSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        const isDataUrl = currentSettings.backgroundImage && currentSettings.backgroundImage.startsWith('data:');
        
        // Prepare settings for Sync (exclude data URL)
        const settingsForSync = { ...currentSettings };
        if (isDataUrl) {
            settingsForSync.backgroundImage = ''; // Don't sync large data
        }

        if (chrome.storage.sync) {
            chrome.storage.sync.set({ settings: settingsForSync });
        } else if (chrome.storage.local) {
            chrome.storage.local.set({ settings: settingsForSync });
        }

        // Handle Custom Background Image (Local Only)
        if (chrome.storage.local) {
            if (isDataUrl) {
                chrome.storage.local.set({ customBackgroundImage: currentSettings.backgroundImage });
            } else {
                chrome.storage.local.remove('customBackgroundImage');
            }
        }
    }
}

function applySettings() {
    const body = document.body;
    
    // Grid Density
    body.classList.remove('density-compact', 'density-spacious');
    if (currentSettings.gridDensity !== 'normal') {
        body.classList.add(`density-${currentSettings.gridDensity}`);
    }

    // Background Image
    if (currentSettings.backgroundImage) {
        body.style.backgroundImage = `url("${currentSettings.backgroundImage}")`;
    } else {
        body.style.backgroundImage = ''; // fallback to CSS default
    }

    // Animations
    if (currentSettings.animationsEnabled) {
        body.classList.remove('no-animations');
    } else {
        body.classList.add('no-animations');
    }

    // Weather
    initWeather(currentSettings);
}

function updateUI() {
    const densitySelect = document.getElementById('setting-density');
    const bgInput = document.getElementById('setting-bg-image');
    const animCheckbox = document.getElementById('setting-animations');
    const staleThresholdSelect = document.getElementById('setting-stale-threshold');
    const bgFileInfo = document.getElementById('bg-file-info');
    
    // Weather Inputs
    const weatherEnabled = document.getElementById('setting-weather-enabled');
    const weatherCity = document.getElementById('setting-weather-city');
    const weatherUnit = document.getElementById('setting-weather-unit');
    const weatherDetails = document.getElementById('weather-details');

    // Pomodoro Inputs
    const pomodoroWork = document.getElementById('setting-pomodoro-work');
    const pomodoroShort = document.getElementById('setting-pomodoro-short');
    const pomodoroLong = document.getElementById('setting-pomodoro-long');

    if (densitySelect) densitySelect.value = currentSettings.gridDensity;
    if (animCheckbox) animCheckbox.checked = currentSettings.animationsEnabled;
    if (staleThresholdSelect) staleThresholdSelect.value = currentSettings.staleThreshold;

    if (pomodoroWork) pomodoroWork.value = currentSettings.pomodoroWork;
    if (pomodoroShort) pomodoroShort.value = currentSettings.pomodoroShort;
    if (pomodoroLong) pomodoroLong.value = currentSettings.pomodoroLong;

    if (weatherEnabled) {
        weatherEnabled.checked = currentSettings.weatherEnabled;
        if (weatherDetails) {
            if (currentSettings.weatherEnabled) weatherDetails.classList.remove('hidden');
            else weatherDetails.classList.add('hidden');
        }
    }
    if (weatherCity) weatherCity.value = currentSettings.weatherCity;
    if (weatherUnit) weatherUnit.value = currentSettings.weatherUnit;

    if (bgInput) {
        if (currentSettings.backgroundImage && currentSettings.backgroundImage.startsWith('data:')) {
            bgInput.value = '';
            bgInput.placeholder = "Using uploaded image";
            bgInput.disabled = true;
            if (bgFileInfo) bgFileInfo.style.display = 'flex';
        } else {
            bgInput.value = currentSettings.backgroundImage || '';
            bgInput.placeholder = "https://example.com/image.jpg";
            bgInput.disabled = false;
            if (bgFileInfo) bgFileInfo.style.display = 'none';
        }
    }
}

function initUI() {
    const settingsToggleBtn = document.getElementById('settings-toggle');
    const settingsModal = document.getElementById('settings-modal');
    
    if (!settingsToggleBtn || !settingsModal) return;

    const closeBtn = settingsModal.querySelector('.close-modal');
    
    // Inputs
    const densitySelect = document.getElementById('setting-density');
    const bgInput = document.getElementById('setting-bg-image');
    const bgFileInput = document.getElementById('setting-bg-file');
    const bgFileClear = document.getElementById('bg-file-clear');
    const animCheckbox = document.getElementById('setting-animations');
    const staleThresholdSelect = document.getElementById('setting-stale-threshold');

    // Toggle Modal
    settingsToggleBtn.addEventListener('click', () => {
        const isHidden = settingsModal.classList.toggle('hidden');
        settingsToggleBtn.setAttribute('aria-expanded', !isHidden);
        if (!isHidden) {
            updateUI();
            // Focus trap or at least focus inside
            const firstInput = settingsModal.querySelector('input, select, button.close-modal');
            if (firstInput) firstInput.focus();
        } else {
             settingsToggleBtn.focus();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            settingsToggleBtn.setAttribute('aria-expanded', 'false');
            settingsToggleBtn.focus();
        });
    }

    // Close on click outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
            settingsToggleBtn.setAttribute('aria-expanded', 'false');
            settingsToggleBtn.focus();
        }
    });

    // Close on Esc
    settingsModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
             settingsModal.classList.add('hidden');
             settingsToggleBtn.setAttribute('aria-expanded', 'false');
             settingsToggleBtn.focus();
        }
    });

    // Event Listeners for inputs
    if (densitySelect) {
        densitySelect.addEventListener('change', (e) => {
            currentSettings.gridDensity = e.target.value;
            applySettings();
            saveSettings();
        });
    }

    if (bgInput) {
        bgInput.addEventListener('input', (e) => {
            currentSettings.backgroundImage = e.target.value;
            applySettings();
            saveSettings();
        });
    }

    if (bgFileInput) {
        bgFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentSettings.backgroundImage = event.target.result;
                    applySettings();
                    saveSettings();
                    updateUI();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (bgFileClear) {
        bgFileClear.addEventListener('click', () => {
            currentSettings.backgroundImage = '';
            // Reset file input
            if (bgFileInput) bgFileInput.value = '';
            applySettings();
            saveSettings();
            updateUI();
        });
    }

    if (animCheckbox) {
        animCheckbox.addEventListener('change', (e) => {
            currentSettings.animationsEnabled = e.target.checked;
            applySettings();
            saveSettings();
        });
    }

    if (staleThresholdSelect) {
        staleThresholdSelect.addEventListener('change', (e) => {
            currentSettings.staleThreshold = parseInt(e.target.value, 10);
            saveSettings();
        });
    }

    // Weather Listeners
    const weatherEnabled = document.getElementById('setting-weather-enabled');
    const weatherCity = document.getElementById('setting-weather-city');
    const weatherUnit = document.getElementById('setting-weather-unit');

    if (weatherEnabled) {
        weatherEnabled.addEventListener('change', (e) => {
            currentSettings.weatherEnabled = e.target.checked;
            applySettings();
            saveSettings();
            updateUI();
        });
    }

    if (weatherCity) {
        weatherCity.addEventListener('change', (e) => {
            currentSettings.weatherCity = e.target.value;
            applySettings();
            saveSettings();
        });
    }
if (pomodoroWork) {
        pomodoroWork.addEventListener('change', (e) => {
            currentSettings.pomodoroWork = parseInt(e.target.value, 10) || 25;
            saveSettings();
        });
    }
    if (pomodoroShort) {
        pomodoroShort.addEventListener('change', (e) => {
            currentSettings.pomodoroShort = parseInt(e.target.value, 10) || 5;
            saveSettings();
        });
    }
    if (pomodoroLong) {
        pomodoroLong.addEventListener('change', (e) => {
            currentSettings.pomodoroLong = parseInt(e.target.value, 10) || 15;
            saveSettings();
        });
    }

    
    if (weatherUnit) {
        weatherUnit.addEventListener('change', (e) => {
            currentSettings.weatherUnit = e.target.value;
            applySettings();
            saveSettings();
        });
    }

    // Export/Import
    const exportBtn = document.getElementById('export-settings-btn');
    const importBtn = document.getElementById('import-settings-btn');
    const importInput = document.getElementById('import-settings-file');

    if (exportBtn) {
        exportBtn.addEventListener('click', exportConfig);
    }

    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', importConfig);
    }
}

function exportConfig() {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        console.warn('chrome.storage not available');
        return;
    }

    // Get tabOrder from local storage (it's always local)
    const getLocal = () => new Promise(resolve => {
        if (chrome.storage.local) {
            chrome.storage.local.get(['tabOrder'], resolve);
        } else {
            resolve({});
        }
    });

    getLocal().then(result => {
        const exportData = {
            settings: currentSettings, // Use current memory state
            tabOrder: result.tabOrder || [],
            exportedAt: new Date().toISOString(),
            app: 'ATab',
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atab-config-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function importConfig(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.app === 'ATab' && data.settings) {
                // Update memory
                currentSettings = { ...defaultSettings, ...data.settings };
                applySettings();
                saveSettings(); // Handles sync/local split

                // Update tabOrder in Local
                if (data.tabOrder && chrome.storage.local) {
                    chrome.storage.local.set({ tabOrder: data.tabOrder }, () => {
                         window.location.reload();
                    });
                } else {
                    window.location.reload();
                }

            } else {
                alert('Invalid configuration file.');
            }
        } catch (err) {
            console.error('Error importing settings:', err);
            alert('Error parsing configuration file.');
        }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    event.target.value = '';
}

function getSettings() {
    return { ...currentSettings };
}

export { initSettings, getSettings };
