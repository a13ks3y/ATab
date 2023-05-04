async function getTabs(query = {}) {
    return new Promise(resolve => {
        chrome.tabs.query(query, (tabs) => {
            resolve(tabs);
        });
    })
}
exports.getTabs = getTabs;
