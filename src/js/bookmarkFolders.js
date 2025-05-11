/**
 * Handles expanding and collapsing bookmark folders
 */

// Map to store expanded state of folders
const expandedFolders = new Map();

/**
 * Toggles the expanded/collapsed state of a bookmark folder
 * @param {HTMLElement} folderEl - The folder element to toggle
 * @param {Array} bookmarks - The full bookmarks array for reference
 * @param {Function} renderFunction - Function to render child bookmarks
 * @returns {boolean} - The new expanded state
 */
function toggleFolder(folderEl, bookmarks, renderFunction) {
    const folderId = folderEl.dataset.bookmarkId;
    const isExpanded = expandedFolders.get(folderId) || false;
    const newState = !isExpanded;
    
    // Set the new state
    expandedFolders.set(folderId, newState);
    
    // Update aria attributes
    folderEl.setAttribute('aria-expanded', newState);
    
    // Update visual indicator
    updateFolderIcon(folderEl, newState);
    
    // Find the bookmark data
    const bookmark = findBookmarkById(bookmarks, folderId);
    
    // Handle children visibility
    const containerEl = document.createElement('div');
    containerEl.classList.add('folder-children');
    containerEl.id = `folder-children-${folderId}`;
    
    // Remove existing children container if it exists
    const existingContainer = document.getElementById(`folder-children-${folderId}`);
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // Add new children if expanded
    if (newState && bookmark && bookmark.children) {
        bookmark.children.forEach(child => {
            const childEl = renderFunction(child);
            containerEl.appendChild(childEl);
        });
        
        // Insert after the folder element
        folderEl.insertAdjacentElement('afterend', containerEl);
    }
    
    return newState;
}

/**
 * Updates the folder icon based on expanded state
 * @param {HTMLElement} folderEl - The folder element
 * @param {boolean} isExpanded - Whether the folder is expanded
 */
function updateFolderIcon(folderEl, isExpanded) {
    const icon = isExpanded ? '📂' : '📁';
    // Completely replace the content with proper icon and original text
    const folderText = folderEl.textContent.replace(/^[📁📂]+\s*/, '').trim();
    folderEl.innerHTML = `${icon} ${folderText}`;
}

/**
 * Find a bookmark by its ID in the bookmarks tree
 * @param {Array} bookmarks - The bookmarks array to search in
 * @param {string} id - The ID to search for
 * @returns {Object|null} - The found bookmark or null
 */
function findBookmarkById(bookmarks, id) {
    if (!bookmarks) return null;
    
    for (const bookmark of bookmarks) {
        if (bookmark.id === id) {
            return bookmark;
        }
        
        if (bookmark.children) {
            const found = findBookmarkById(bookmark.children, id);
            if (found) return found;
        }
    }
    
    return null;
}

/**
 * Handles keyboard navigation for folders
 * @param {Event} event - The keyboard event
 * @param {HTMLElement} folderEl - The folder element
 * @param {Array} bookmarks - The bookmarks array
 * @param {Function} renderFunction - Function to render bookmarks
 */
function handleFolderKeyDown(event, folderEl, bookmarks, renderFunction) {
    if (event.code === 'Enter' || event.code === 'Space') {
        event.preventDefault();
        toggleFolder(folderEl, bookmarks, renderFunction);
    }
}

/**
 * Initialize folder event handlers
 * @param {HTMLElement} containerEl - The container element
 * @param {Array} bookmarks - The bookmarks array
 * @param {Function} renderFunction - Function to render bookmarks
 */
function initFolderHandlers(containerEl, bookmarks, renderFunction) {
    // Handle click events
    containerEl.addEventListener('click', (e) => {
        const folderEl = e.target.closest('a.bookmark-folder');
        if (folderEl) {
            e.preventDefault();
            toggleFolder(folderEl, bookmarks, renderFunction);
        }
    });
    
    // Handle keyboard events
    containerEl.addEventListener('keydown', (e) => {
        const folderEl = e.target.closest('a.bookmark-folder');
        if (folderEl) {
            handleFolderKeyDown(e, folderEl, bookmarks, renderFunction);
        }
    });
}

exports.toggleFolder = toggleFolder;
exports.initFolderHandlers = initFolderHandlers;
exports.expandedFolders = expandedFolders;
