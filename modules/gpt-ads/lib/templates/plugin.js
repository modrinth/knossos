import Vue from 'vue';

function isPersonalizedAdsOn(ctx) {
  let cookies = null
  if (ctx.req != null) {
    //Server side rendering
    cookies = ctx.req.headers.cookie;
  } else {
    // Rely on the client
    cookies = document.cookie;
  }
  let processed = {}
  cookies.split(';').forEach((e) => {
    let val = e.trim().split('=')
    processed[val[0]] = decodeURI(val[1])
  })
  let scopes = decodeURIComponent(processed['modrinth-scopes']).split(",")
  return (scopes !== null && scopes.includes('ads'))
}

export default async function (ctx, inject) {

  const { app } = ctx;

  // Module options
  const debug = <%= options.debug || false %>;
  const individualRefresh = <%= options.individualRefresh || false %>;
  const collapseEmptyDivs = <%= options.collapseEmptyDivs || false %>;
  const networkCode = '<%= options.networkCode %>';
  const GPT_LIB_SCRIPT_ID = '<%= options.GPT_LIB_SCRIPT_ID %>';
  const GPT_INIT_SCRIPT_ID = '<%= options.GPT_INIT_SCRIPT_ID %>';

  // Instance options
  const gptAdsOptions = {
    networkCode,
    individualRefresh,
    slots: [],
  };

  const injectScript = (script) => {
    const scriptIndex = ctx.app.head.script.findIndex(s => s.id === script.id);
    if (scriptIndex !== -1) {
      ctx.app.head.script[scriptIndex] = script;
    } else {
      ctx.app.head.script.push(script);
    }
  };
  let no_consent = !isPersonalizedAdsOn(ctx)
  // Inject GPT lib
  const gptLibScript = {
    id: GPT_LIB_SCRIPT_ID,
    src: 'https://www.googletagservices.com/tag/js/gpt.js',
    async: true,
  };
  injectScript(gptLibScript);

  // Inject GPT init script
  let gptInitScriptHtml = 'var googletag = googletag || {};googletag.cmd = googletag.cmd || [];';
  if (debug) {
    gptInitScriptHtml += 'googletag.cmd.push(function(){googletag.openConsole();});';
  }
  // Disable initial load
  const gptDisableInitialLoad = individualRefresh ? 'googletag.pubads().disableInitialLoad();' : '';
  // Collapse empty div
  const gptCollapseEmptyDivs = collapseEmptyDivs ? 'googletag.pubads().collapseEmptyDivs();' : '';
  // Desactivate personalization
  const gptDisablePersonalization = no_consent ? 'googletag.pubads().setRequestNonPersonalizedAds(1);' : '';
  gptInitScriptHtml += `
    googletag.cmd.push(function(){
      googletag.pubads().enableSingleRequest();
      ${gptDisableInitialLoad}
      ${gptCollapseEmptyDivs}
      ${gptDisablePersonalization}
      googletag.enableServices();
    });
  `;
  const gptInitScript = {
    id: GPT_INIT_SCRIPT_ID,
    innerHTML: gptInitScriptHtml,
  };
  injectScript(gptInitScript);

  const component = require('./component.js');
  Vue.component('<%= options.componentName %>', component.default || component);

  inject('gptAds', gptAdsOptions);
}

