# Awesome Tab (ATab)

## Overview
Awesome Tab is a Chrome Extension that replaces the New Tab page, providing a clean interface for managing tabs and bookmarks. This PRD focuses on refining keyboard navigation, improving bookmark interactions, adding UI animations, and cleaning up the codebase based on the project's roadmap and todo list.

## Tasks
- [x] Add at least 5 more task to this list, the last one should be copy of the very this one.
- [x] **Implement Tab Search Feature**: Allow filtering and switching to open tabs via the search bar. This should perform fuzzy matching on tab titles and URLs.
- [x] **Add Tab Grid Drag-and-Drop**: Implement drag-and-drop mechanics for reordering tiles in the tab grid view. Persist the custom order if possible or clarify limitations.
- [x] **Create Custom Context Menu**: Add a custom right-click context menu on tab tiles with actions: "Close", "Duplicate", "Pin", and "Mute Tab".
- [x] Add at least 5 more task to this list, the last one should be copy of the very this one.
- [x] **Implement Dark Mode**: Add support for dark and light themes, respecting the system preference by default but allowing user override.
- [x] **Persist Tab Order**: Ensure that the custom order of tabs created via drag-and-drop is saved in `chrome.storage.local` and restored on new tab open.
- [x] **Keyboard Shortcuts Help Overlay**: Display a help modal with a list of all keyboard shortcuts when the user presses '?' or 'H'.
- [x] **Settings Panel**: Create a settings UI to configure options like grid density, background image, and toggle animations.
- [x] Add at least 5 more task to this list, the last one should be copy of the very this one.
- [x] **Integrate Bookmark Search**: Expand the search functionality to include bookmarks in the results, differentiated visually from open tabs.
- [x] **Tab Groups Visualization**: Display Chrome Tab Groups visually in the grid, perhaps by grouping tiles together or using color indicators matching the group color.
- [x] **Memory Saver (Tab Discarding)**: Add a "Discard" option to the context menu to free up memory for specific tabs without closing them.
- [x] **Import/Export Settings**: Add functionality in the Settings Panel to export user configuration to a JSON file and import it back.
- [x] Add at least 5 more task to this list, the last one should be copy of the very this one.
- [x] **Close Stale Tabs**: Detect and close tabs that haven't been accessed for a configurable duration (e.g. > 1 week), with user confirmation.
- [x] **Sync Tabs Across Devices**: Use `chrome.storage.sync` to synchronize settings and potentially custom tab order or pinned tabs across devices.
- [x] **Keyboard Shortcut for Mute/Pin**: Add dedicated keyboard shortcuts for toggling Mute (e.g. `Alt+M`) and Pin (e.g. `Alt+P`) states on the currently focused tab.
- [x] **Recent History Panel**: Add a floating panel or modal to view and restore recently closed tabs quickly without navigating away.
- [x] **Customizable Background Upload**: Enhance the settings panel to allow users to upload a local image file for the background instead of just a URL.
- [x] Add at least 5 more task to this list, the last one should be copy of the very this one.
- [x] **Quick Notes Widget**: Add a simple, persistent text area on the dashboard for jotting down quick thoughts or to-dos.
- [x] **Weather Integration**: Display current weather conditions and temperature in a widget, configurable by city or detected location.
- [x] **Pomodoro Timer**: Integrate a focus timer with customizable work/break intervals to help users stay productive.
- [x] **Zen Mode**: Add a toggle button to hide all distractions (bookmarks, top sites) and display only the clock and search bar.
- [x] Add at least 5 more task to this list, the last one should be copy of the very this one.
- [x] **Session Snapshots**: Save the current state of open tabs as a named session that can be restored later, similar to OneTab but integrated into the grid.
- [x] **Reading List Integration**: Display and manage items from the Chrome Reading List in a dedicated sidebar or widget area.
- [x] **Usage Analytics**: Visual charts showing tab usage statistics or Pomodoro session history over time (e.g., last 7 days).
- [x] **Accessibility Audit**: Conduct an accessibility audit and improve ARIA labels, focus management, and screen reader support across all UI elements.
- [ ] Remove bookmarks feature compleatly. No one use it.
- [ ] Make sure to follow latest Google Chrome Extention development guides/bestpractices.
- [ ] Update changelog, version, commit and push.

## Previous Iteration
- [x] **Refactor Keyboard Navigation**: Refactor existing keyboard handling to specific handlers. Implement Arrow Up and Arrow Down navigation for multi-row tab layouts. Add comprehensive unit tests for navigation logic.
- [x] **Enhance Bookmarks & Folders**: Implement mouse event handlers for bookmarks and folders. Fix the anchor `href` attribute issue for folders (it should not be undefined). 
- [x] **Implement UI Animations**: Create and integrate a generic close-tab animation that triggers when the close button is clicked, improving the user experience.
- [x] **Code Refactoring & Cleanup**: Audit code to rename "select" related variables/functions to "focus" where it is more semantically accurate.
- [x] **Update Documentation**: Update the README code and instructions. Prepare the project description for the screenshot and video updates.


## Technical Details
- **Project Structure**: Chrome Extension using Vanilla JS and Webpack.
- **Testing**: Jest is used for unit testing. New keyboard features must include tests in `src/js/`.
- **Styling**: CSS located in `src/css/`. Animations should be CSS-based for performance.
