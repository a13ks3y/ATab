async function getTabs(query = {}) {
    return new Promise(resolve => {
        chrome.tabs.query(query, (tabs) => {
            resolve(tabs);
        });
    })
}

async function getTabGroups(query = {}) {
    return new Promise(resolve => {
        if (chrome.tabGroups) {
            chrome.tabGroups.query(query, (groups) => {
                resolve(groups);
            });
        } else {
            resolve([]);
        }
    })
}

exports.getTabs = getTabs;
exports.getTabGroups = getTabGroups;
