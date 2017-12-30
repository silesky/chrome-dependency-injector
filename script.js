window.imp = null;

(async () => {
  console.log(`Import activated. Example: imp('jquery') to import jquery.`)
  var GlobalUtils = (() => {
    var prevGlobals = Object.keys(window);
    return {
      getGlobals: () => {
        var globals = Object.keys(window);
        var filtered = globals.filter(eachNewGlobal =>
          prevGlobals.every(prevGlobal => prevGlobal !== eachNewGlobal),
        );
        if (filtered.length) {
          console.log(
            '...your module likely injected one or more of the following globals:',
            filtered,
          );
        }
      },
    };
  })();
  const fetchScriptUri = async moduleName => {
    const endpoint = `https://api.cdnjs.com/libraries?search=${moduleName}`;
    try {
      var res = await fetch(endpoint);
      if (!res.ok) {
        throw 'CDN API Error.';
      }
      var jsonRes = await res.json();
      if (!jsonRes.results.length) {
        throw 'No script found in CDN database.';
      }
      var { latest: uri, name } = jsonRes.results[0];
      console.log(`Loading ${name}...`);
      return uri;
    } catch (err) {
      console.warn('error:', err);
      return err;
    }
  };

  const loadScript = async moduleName => {
    const src = await fetchScriptUri(moduleName);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = src;
    document.head.appendChild(script);
    setTimeout(GlobalUtils.getGlobals, 500);
    console.log('Module loaded!');
  };
  imp = loadScript;
  // https://api.cdnjs.com/libraries?search=[query]
})();
