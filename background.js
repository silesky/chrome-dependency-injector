// listen for our browerAction to be clicked
chrome.storage.local.set({ activated: null });
const getActiveState = callback => {
  const cb = callback
    ? callback
    : res => console.log('Please use a callback.', res);
  chrome.storage.local.get('activated', cb);
};

const toggleActivationState = val => {
  getActiveState(({ activated }) => {
    chrome.storage.local.set({ activated: val || !activated });
  });
};

const changeBadge = (tabId, text) =>
  chrome.browserAction.setBadgeText({
    text: text,
    tabId: tabId,
  });

const activateScript = tab => {
  if (tab.url.includes('chrome://')) {
    console.log(
      'For security reasons, you cannot use this extension on a chrome:// tab. Please try on a different tab.',
    );
    changeBadge(tab.id, '');
    toggleActivationState(false);
    return;
  }
  chrome.tabs.executeScript(tab.Id, { file: 'loadScript.js' });
};

chrome.browserAction.onClicked.addListener(tab => {
  getActiveState(({ activated }) => {
    chrome.storage.local.set({ activated: !activated });
    changeBadge(tab.id, !activated ? 'On' : '');
    !activated && activateScript(tab);
  });
});

// when I'm on the same page, and I change URLs.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  getActiveState(({ activated }) => {
    if (activated) {
      activateScript(tab);
      changeBadge(tabId, 'On');
    } else {
      changeBadge(tabId, '');
    }
  });
});

// When I'm switching tabs
chrome.tabs.onActivated.addListener(({ tabId }) => {
  getActiveState(({ activated }) => {
    changeBadge(tabId, activated ? 'On' : '');
  });
});
