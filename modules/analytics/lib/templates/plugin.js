import Vue from 'vue';

function isAnalyticsOn(ctx) {
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
    let val = e.trim().split('=');
    processed[val[0]] = decodeURI(val[1]);
  })
  let scopes = decodeURIComponent(processed['modrinth-scopes']).split(",");
  return (scopes !== null && scopes.includes('analytics'));
}

export default async function (ctx, inject) {

  const { app } = ctx;
  const url = '<%= options.script_url %>';
  const tag = '<%= options.tracking_code %>';
  const enabled = <%= options.enabled  || false %>;
  const UNAMI_LIB_TAG_ID = '<%= options.UNAMI_LIB_TAG_ID %>';


  if (!enabled) {
    // console.log("Analytics are not enabled.")
    return;
  }

  const injectScript = (script) => {
    const scriptIndex = ctx.app.head.script.findIndex(s => s.hid === script.hid);
    if (scriptIndex !== -1) {
      ctx.app.head.script[scriptIndex] = script;
    } else {
      ctx.app.head.script.push(script);
    }
  };
  if (isAnalyticsOn(ctx)) {
    // Inject unami
    const analyticsScript = {
      hid: UNAMI_LIB_TAG_ID,
      src: url,
      'data-website-id': 'c37613de-245d-4767-90e7-ba7980a4f1a2',
      async: true,
      defer: true,
    };
    injectScript(analyticsScript);
  } else {
    // console.log("Analytics scope was denied.")
  }

}

