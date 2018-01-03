window.initImportApp = async () => {

  // locate newly injected globals
  const GlobalUtils = (() => {
    const prevGlobals = Object.keys(window);
    return {
      getGlobals: () => {
        const globals = Object.keys(window);
        const filtered = globals.filter(
          eachNewGlobal =>
            prevGlobals.every(prevGlobal => prevGlobal !== eachNewGlobal) &&
            eachNewGlobal !== 'imp',
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
      const { results } = await res.json();
      if (!results.length) {
        throw 'No script found in CDN database.';
      }
      const { latest: uri, name } = results[0];
      console.log(`Loading ${name} from ${uri}...`);
      setTimeout(console.log('Module should be loaded.'), 200);
      return uri;
    } catch (err) {
      console.warn(
        err.name === 'TypeError'
          ? 'Likely a CSP error. Please try imp() with another URL.'
          : err.message,
      );
    }
  };

  const loadScript = async moduleName => {
    const src = await fetchScriptUri(moduleName);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = src;
    document.head.appendChild(script);
    setTimeout(GlobalUtils.getGlobals, 200);
  };

  window.imp = loadScript;

};

if (!window.imp) {
  console.log(
    `Import activated. Example: imp('ramda') to import R as 'ramda'.`,
  );
  window.initImportApp();
}
