HTMLDocument.prototype.ready = new Promise(resolve => {
  if (document.readyState != 'loading') {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      resolve();
    });
  }
});
document.ready.then(() => {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('script.js');
  var doc = document.head || document.documentElement;
  doc.appendChild(s);
});
