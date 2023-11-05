import {getServiceConfigs} from "./config/utils.ts";

const serviceConfigs = getServiceConfigs();

Bun.serve({
  port: parseInt(Bun.env.PORT!) || 3000,
  async fetch({url, ...req}) {
    let _req: Request;
    for (const serviceConfig of serviceConfigs) {
      if (serviceConfig.pathPattern === undefined) {
        const _url = new URL(url);
        _req = new Request({url: `${serviceConfig.host}${_url.pathname}${_url.search}`, ...req});
      } else if (serviceConfig.pathPattern.test(url)) {
        const _url = new URL(url);
        _req = new Request({url: `${serviceConfig.host}${_url.pathname}${_url.search}`, ...req});
      } else {
        continue;
      }
      return fetch(_req);
    }
    return new Response('Not Found', {status: 404})
  },
});
