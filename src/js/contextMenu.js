function showContextMenu(event, tab, closeTabHandler) {
  event.preventDefault();

  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) existingMenu.remove();
  
  // Use try/catch for chrome API calls or check for existence
  if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.get) {
      console.warn('Chrome Tabs API not available (context menu disabled)');
      return;
  }

  // Fetch fresh tab data to ensure correct Pin/Mute state
  chrome.tabs.get(tab.id, (freshTab) => {
      if (chrome.runtime.lastError || !freshTab) {
          return;
      }
      
      const menu = document.createElement('ul');
      menu.role = 'menu';
      menu.setAttribute('aria-label', `Context menu for tab ${tab.title}`);
      menu.className = 'context-menu';
      
      // Calculate position to keep menu within viewport
      let { pageX, pageY } = event;
      
      // If triggered by keyboard (pageX/Y might be 0), align to target
      if ((pageX === 0 && pageY === 0) || (pageX === undefined && pageY === undefined)) {
            if (event.target) {
                const rect = event.target.getBoundingClientRect();
                pageX = rect.left + (rect.width / 2);
                pageY = rect.top + (rect.height / 2);
            }
      }
      
      // We will adjust position after appending to DOM to know dimensions
      menu.style.top = `${pageY}px`;
      menu.style.left = `${pageX}px`;

      const menuItems = [
        {
          label: 'Close',
          action: () => closeTabHandler(freshTab)
        },
        {
          label: 'Duplicate',
          action: () => chrome.tabs.duplicate(freshTab.id)
        },
        {
          label: freshTab.pinned ? 'Unpin' : 'Pin',
          action: () => chrome.tabs.update(freshTab.id, { pinned: !freshTab.pinned })
        },
        {
          label: (freshTab.mutedInfo && freshTab.mutedInfo.muted) ? 'Unmute Tab' : 'Mute Tab',
          action: () => {
              const currentMuted = freshTab.mutedInfo ? freshTab.mutedInfo.muted : false;
              chrome.tabs.update(freshTab.id, { muted: !currentMuted });
          }
        },
        {
          label: 'Discard (Memory Saver)',
          action: () => {
              chrome.tabs.discard(freshTab.id);
          },
          // Only show if not active and not already discarded
          visible: !freshTab.active && !freshTab.discarded && chrome.tabs.discard
        }
      ].filter(item => item.visible !== false);

      menuItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.label;
        li.className = 'context-menu-item';
        li.setAttribute('role', 'menuitem');
        li.tabIndex = -1;
        
        const performAction = () => {
            item.action();
            menu.remove();
            // Return focus
            const tabEl = document.getElementById(`tab-${tab.id}`);
            if (tabEl) tabEl.focus();
        };
        
        li.addEventListener('click', performAction);
        
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                performAction();
            }
        });
        
        menu.appendChild(li);
      });

      document.body.appendChild(menu);
      
      // Focus first item
      const firstItem = menu.querySelector('li');
      if (firstItem) {
          firstItem.tabIndex = 0;
          firstItem.focus();
      }

      // Menu Navigation
      menu.addEventListener('keydown', (e) => {
          const items = Array.from(menu.querySelectorAll('li'));
          const currentIndex = items.indexOf(document.activeElement);
          
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              const nextIndex = (currentIndex + 1) % items.length;
              items[currentIndex].tabIndex = -1;
              items[nextIndex].tabIndex = 0;
              items[nextIndex].focus();
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prevIndex = (currentIndex - 1 + items.length) % items.length;
              items[currentIndex].tabIndex = -1;
              items[prevIndex].tabIndex = 0;
              items[prevIndex].focus();
          } else if (e.key === 'Escape') {
              e.preventDefault();
              menu.remove();
              const tabEl = document.getElementById(`tab-${tab.id}`);
              if (tabEl) tabEl.focus();
          } else if (e.key === 'Tab') {
              e.preventDefault();
              menu.remove();
          }
      });
      
      // Adjust position if it goes offscreen
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (rect.right > viewportWidth) {
          menu.style.left = `${pageX - rect.width}px`;
      }
      if (rect.bottom > viewportHeight) {
          menu.style.top = `${pageY - rect.height}px`;
      }

      const closeMenu = (e) => {
          if (!menu.contains(e.target)) {
              menu.remove();
              document.removeEventListener('click', closeMenu);
              document.removeEventListener('contextmenu', closeMenu);
          }
      };

      // Use a small timeout to avoid the initial click event triggering closure
      setTimeout(() => {
        document.addEventListener('click', closeMenu);
        document.addEventListener('contextmenu', closeMenu);
      }, 0);
  });
}

module.exports = { showContextMenu };
