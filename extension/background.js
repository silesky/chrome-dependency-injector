// listen for our browerAction to be clicked
chrome.storage.local.set({ activated: null });

const getActiveState = callback =>
  chrome.storage.local.get('activated', callback);

const toggleActivationState = val => {
  getActiveState(({ activated }) => {
    chrome.storage.local.set({ activated: val || !activated });
  });
};

const changeBadge = (tabId, text) => {
  chrome.browserAction.setBadgeText({
    tabId,
    text,
  });
  chrome.browserAction.setBadgeBackgroundColor({
    tabId,
    color: text === 'On' ? 'green' : 'red',
  });
};

const errMsg =
  'Cannot inject import on a chrome:// page. Please try a different tab.';
const urlIsValid = tab => !tab.url.includes('chrome://');

const activateScript = tabId =>
  chrome.tabs.executeScript(tabId, { file: 'loadScript.js' });

// when I click. - if not previously activated, activate script, change badge.
chrome.browserAction.onClicked.addListener(tab => {
  getActiveState(({ activated }) => {
    if (urlIsValid(tab)) {
      !activated && activateScript(tab.id);
    } else {
      alert(errMsg);
    }
    chrome.storage.local.set({ activated: !activated });
    changeBadge(tab.id, !activated ? 'On' : '');
  });
});

// when I'm on the same page, and I change URLs. - if already activated, activate.
chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  getActiveState(({ activated }) => {
    if (urlIsValid(tab) && activated) {
      activateScript(tabId);
    }
    changeBadge(tabId, activated ? 'On' : '');
  });
});

// When I'm switching tabs - if already activated, activate.
chrome.tabs.onActivated.addListener(({ tabId }) => {
  getActiveState(({ activated }) => {
    activated && activateScript(tabId);
    changeBadge(tabId, activated ? 'On' : '');
  });
});
