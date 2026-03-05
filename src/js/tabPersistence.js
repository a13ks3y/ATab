
export const STORAGE_KEY = 'atab_tab_order';

// Note: Tab order is saved to local storage because tab IDs are session-specific 
// and cannot be reliably synced across devices.
export function saveTabOrder(tabs) {
    if (!chrome.storage || !chrome.storage.local) return;
    const tabIds = tabs.map(tab => tab.id);
    chrome.storage.local.set({ [STORAGE_KEY]: tabIds });
}

export async function restoreTabOrder() {
    if (!chrome.storage || !chrome.storage.local) return;
    
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], async (result) => {
            const savedOrder = result[STORAGE_KEY];
            if (!savedOrder || !Array.isArray(savedOrder) || savedOrder.length === 0) {
                resolve();
                return;
            }

            // Get current tabs to determine which ones we need to reorder
            chrome.tabs.query({ currentWindow: true }, async (tabs) => {
                const currentTabMap = new Map();
                tabs.forEach(tab => currentTabMap.set(tab.id, tab));

                // Filter saved order to keep only existing tabs
                const orderedExistingIds = savedOrder.filter(id => currentTabMap.has(id));
                
                // Identify new tabs that weren't in the saved order
                const newTabIds = tabs
                    .filter(t => !orderedExistingIds.includes(t.id))
                    .sort((a, b) => a.index - b.index) // Keep their relative order
                    .map(t => t.id);

                // Combine: existing saved order + new tabs at the end
                const finalOrderIds = [...orderedExistingIds, ...newTabIds];

                // Check if order is actually different
                const currentOrderIds = tabs.sort((a, b) => a.index - b.index).map(t => t.id);
                const isDifferent = finalOrderIds.length !== currentOrderIds.length || 
                                    finalOrderIds.some((id, i) => id !== currentOrderIds[i]);

                if (isDifferent) {
                    // Apply moves sequentially
                    for (let i = 0; i < finalOrderIds.length; i++) {
                        const id = finalOrderIds[i];
                        const currentTab = currentTabMap.get(id);
                        try {
                            // We move to index i.
                            // However, we should be careful to fetch updated index?
                            // Actually, blindly moving to 'i' works because we are reconstructing the array 0..N
                            // But we need to await completion to ensure indices shift correctly before next move.
                            await chrome.tabs.move(id, { index: i });
                        } catch (e) {
                            console.warn('Failed to restore tab order for tab', id, e);
                        }
                    }
                }
                resolve();
            });
        });
    });
}
