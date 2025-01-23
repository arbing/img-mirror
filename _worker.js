export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let str = url.pathname;
    
    let pattern = /([^/]+?\.[^/]+)\/(.*)/;
    let match = str.match(pattern);
    if (!match || match.length != 3) {
      return fail();
    }

    let domain = match[1];
    let path = `/${match[2]}`;
    let search = url.search;

    const proxyUrl = `https://${domain}${path}${search}`;
    // return ok(proxyUrl);

    if(['.douyinpic.com', '.yximgs.com'].some(d => domain.endsWith(d))){
      return Response.redirect(proxyUrl, 302);
    }

    const proxyRequest = new Request(proxyUrl, request);
    proxyRequest.headers.set("Referer", "");
    return fetch(proxyRequest);
  },
};

function fail() {
  return new Response("fail");
}

function ok(str) {
  return new Response(str);
}
