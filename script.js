window.imp = null;

(async () => {
  console.log(
    `Import activated. Example: imp('ramda') to import R as 'ramda'.`,
  );
  const GlobalUtils = (() => {
    const prevGlobals = Object.keys(window);
    return {
      getGlobals: () => {
        const globals = Object.keys(window);
        const filtered = globals.filter(eachNewGlobal =>
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
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw 'CDN API Error.';
      }
      const jsonRes = await res.json();
      if (!jsonRes.results.length) {
        throw 'No script found in CDN database.';
      }
      const { latest: uri, name } = jsonRes.results[0];
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
    console.log('Module should be loaded.');
  };
  window.imp = loadScript;
})();
