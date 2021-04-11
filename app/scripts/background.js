browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

browser.tabs.onUpdated.addListener(async (tabId) => {
  browser.pageAction.show(tabId)
})

console.log(`[jira-task-copy-to-clipboard] background loaded`)
