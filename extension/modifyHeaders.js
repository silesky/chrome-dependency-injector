/* Copyright ©2014 Christopher Brown. MIT Licensed.
  https://github.com/chbrown/chrome-unxss
  https://opensource.org/licenses/MIT
*/
// TODO: activate this only when chrome console opens
// OR--better yet-- modify to include this api url.
function removeMatchingHeaders(headers, regex) {
  for (var i = 0, header; (header = headers[i]); i++) {
    if (header.name.match(regex)) {
      headers.splice(i, 1);
      console.log(
        'Removing header "' + header.name + '":"' + header.value + '"',
      );
      return;
    }
  }
}

function responseListener(details) {
  // localStorage values are always strings
  var strip_csp = true;
  var allow_origin_star = false;
  var allow_methods_star = false;
  var strip_frame_options = false;

  var active =
    strip_csp || allow_origin_star || allow_methods_star || strip_frame_options;
  // var active = active && (details.type == 'main_frame');
  if (active) {
    // log('Removing headers where applicable');
    if (strip_csp) {
      removeMatchingHeaders(
        details.responseHeaders,
        /content-security-policy/i,
      );
    }
    if (allow_origin_star) {
      removeMatchingHeaders(
        details.responseHeaders,
        /access-control-allow-origin/i,
      );
      details.responseHeaders.push({
        name: 'Access-Control-Allow-Origin',
        value: '*',
      });
    }
    if (allow_methods_star) {
      removeMatchingHeaders(
        details.responseHeaders,
        /access-control-allow-methods/i,
      );
      details.responseHeaders.push({
        name: 'Access-Control-Allow-Methods',
        value: '*',
      });
    }
    if (strip_frame_options) {
      removeMatchingHeaders(details.responseHeaders, /x-frame-options/i);
    }
  }

  return { responseHeaders: details.responseHeaders };
}

chrome.webRequest.onHeadersReceived.addListener(
  responseListener,
  {
    urls: ['*://*/*'],
  },
  ['blocking', 'responseHeaders'],
);
