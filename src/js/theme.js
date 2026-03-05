
const THEME_STORAGE_KEY = 'atab-theme';

/**
 * Initializes the theme based on stored preference or system setting.
 */
export function initTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to stored theme, otherwise check system preference
    // If no preference and no system preference (which is rare, usually light or dark), default to 'dark' as per original design
    let theme = storedTheme;
    if (!theme) {
        theme = prefersDark ? 'dark' : 'light';
    }
    
    setTheme(theme);
}

/**
 * Sets the theme by updating the data-theme attribute on the document element.
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateToggleIcon(theme);
}

/**
 * Toggles between dark and light themes.
 */
export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * Updates the toggle button icon/text if it exists.
 * @param {string} theme 
 */
function updateToggleIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        // Simple text for now, can be replaced with icons
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        toggleBtn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
}
