
const recentHistoryModalId = 'recent-history-modal';
const recentHistoryListId = 'recent-history-list';

function openRecentHistoryModal() {
  const modal = document.getElementById(recentHistoryModalId);
  const list = document.getElementById(recentHistoryListId);
  
  if (!modal || !list) return;

  chrome.sessions.getRecentlyClosed({ maxResults: 25 }, (sessions) => {
    list.innerHTML = '';
    
    if (!sessions || sessions.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No recently closed tabs.';
      li.style.padding = '10px';
      li.style.color = 'var(--text-color)';
      list.appendChild(li);
    } else {
      sessions.forEach(session => {
        if (session.tab || session.window) {
          const li = createSessionElement(session);
          list.appendChild(li);
        }
      });
    }
    
    modal.classList.remove('hidden');
    // Focus the first restore button for keyboard access
    const firstBtn = list.querySelector('button');
    if (firstBtn) firstBtn.focus();
  });
}

function createSessionElement(session) {
//...
}

function initRecentHistory() {
  const modal = document.getElementById('recent-history-modal'); // Using ID string directly to match HTML
  if (!modal) return;
  
  const closeBtn = modal.querySelector('.close-modal');
  
  const closeModal = () => {
       modal.classList.add('hidden');
       // Return focus if possible? Hard to track previous focus here
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on click outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
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

function openRecentHistoryModal() {
  const modal = document.getElementById('recent-history-modal');
  const list = document.getElementById('recent-history-list');
  
  if (!modal || !list) return;

  chrome.sessions.getRecentlyClosed({ maxResults: 25 }, (sessions) => {
    list.innerHTML = '';
    
    if (!sessions || sessions.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No recently closed tabs.';
      li.style.padding = '10px';
      li.style.color = 'var(--text-color)';
      list.appendChild(li);
    } else {
      sessions.forEach(session => {
         const li = document.createElement('li');
         li.className = 'recent-history-item';
         li.style.display = 'flex';
         li.style.alignItems = 'center';
         li.style.gap = '10px';
         li.style.padding = '10px';
         li.style.borderBottom = '1px solid #444';
         
         const restore = () => {
             if (session.sessionId) {
                 chrome.sessions.restore(session.sessionId);
                 modal.classList.add('hidden');
             } else if (session.window && session.window.sessionId) {
                  chrome.sessions.restore(session.window.sessionId);
                  modal.classList.add('hidden');
             } else if (session.tab && session.tab.sessionId) {
                  chrome.sessions.restore(session.tab.sessionId);
                  modal.classList.add('hidden');
             }
         };

         let title = 'Untitled';
         let url = '';
         let iconUrl = 'icons/gear.png';

         if (session.tab) {
             title = session.tab.title || 'Untitled';
             url = session.tab.url;
             if (session.tab.favIconUrl) iconUrl = session.tab.favIconUrl;
         } else if (session.window) {
             title = `Window (${session.window.tabs.length} tabs)`;
             url = 'Restores entire window';
         }
         
         const btn = document.createElement('button');
         btn.className = 'restore-btn-item';
         btn.style.flex = '1';
         btn.style.textAlign = 'left';
         btn.style.background = 'none';
         btn.style.border = 'none';
         btn.style.color = 'var(--text-color)';
         btn.style.cursor = 'pointer';
         btn.style.display = 'flex';
         btn.style.alignItems = 'center';
         btn.style.gap = '10px';
         btn.setAttribute('aria-label', `Restore ${title}`);
         
         const img = document.createElement('img');
         img.src = iconUrl;
         img.style.width = '16px';
         img.style.height = '16px';
         
         const textDiv = document.createElement('div');
         const titleDiv = document.createElement('div');
         titleDiv.textContent = title;
         titleDiv.style.fontWeight = 'bold';
         const urlDiv = document.createElement('div');
         urlDiv.textContent = url;
         urlDiv.style.fontSize = '0.8em';
         urlDiv.style.opacity = '0.7';
         urlDiv.style.whiteSpace = 'nowrap';
         urlDiv.style.overflow = 'hidden';
         urlDiv.style.textOverflow = 'ellipsis';
         urlDiv.style.maxWidth = '300px';
         
         textDiv.appendChild(titleDiv);
         textDiv.appendChild(urlDiv);
         
         btn.appendChild(img);
         btn.appendChild(textDiv);
         
         btn.onclick = restore;

         li.appendChild(btn);
         list.appendChild(li);
      });
    }
    
    modal.classList.remove('hidden');
    
    // Focus first button
    const firstBtn = list.querySelector('button');
    if (firstBtn) firstBtn.focus();
    else if (closeBtn) closeBtn.focus();
  });
}

module.exports = {
  openRecentHistoryModal,
  initRecentHistory
};
