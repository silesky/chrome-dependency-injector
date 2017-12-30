// listen for our browerAction to be clicked
chrome.storage.local.set({ activated: null });
const getActiveState = callback => {
  const cb = callback ? callback : res => console.log('Please use a callback.', res);
  chrome.storage.local.get('activated', cb);
};
const toggleActivationState = () => {
  getActiveState(({ activated }) => {
    chrome.storage.local.set({ activated: !activated });
  });
};

chrome.browserAction.onClicked.addListener(tab => {
  getActiveState(({ activated }) => {
    chrome.storage.local.set({ activated: !activated });
    changeBadge(tab, !activated ? 'On' : 'Off');
    !activated && activateScript(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  getActiveState(({ activated }) => {
    if (activated) {
      activateScript(tab);
      changeBadge(tab, 'On');
    }
  });
});

const changeBadge = (tab, text) =>
  chrome.browserAction.setBadgeText({
    text: text,
    tabId: tab.Id,
  });

const activateScript = tab => {
  if (tab.url.includes('chrome://')) {
    console.log(
      'For security reasons, you cannot use this extension on a chrome:// tab. Please try on a different tab.');
    changeBadge(tab, '');
    return;
  }
  chrome.tabs.executeScript(tab.Id, { file: 'loadScript.js' });
};

/*
chrome.browserAction.onClicked.addListener(function callback() {
    chrome.tabs.executeScript(activeTabId, { code: 'loadScript.js' });
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {

         // since only one tab should be active and in the current window at once
         // the return variable should only have one entry
         var activeTab = arrayOfTabs[0];
         var activeTabId = arrayOfTabs[0].id; // or do whatever you need

         var code = '';

         if(activeTabs.indexOf(activeTabId) === -1) {
            // it doesnt already exists on this tab...
            chrome.browserAction.setBadgeText({
                text: 'On',
                tabId: activeTabId
            });
            chrome.tabs.executeScript(activeTabId, { code: 'loadScript.js' });
            activeTabs.push(activeTabId);
         }
  });

});
*/

// chrome.tabs.onUpdated.addListener(function(tabId) {

//     var index = activeTabs.indexOf(tabId);
//     if (index > -1) {
//         activeTabs.splice(index, 1);
//     }
// })
