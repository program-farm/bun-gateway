import {serviceConfigs} from "./constants.ts";

export async function mainHandler(request: Request, url = new URL(request.url)) {
  for (const serviceConfig of serviceConfigs) {
    if (serviceConfig.pathPattern !== undefined && !serviceConfig.pathPattern.test(request.url)) {
      continue;
    }
    request.headers.set('x-forwarded-host', url.host);
    return fetch(
      new Request({
        url: `${serviceConfig.serviceProtoHostPort}${url.pathname}${url.search}`,
        method: request.method,
        body: request.body,
        headers: request.headers
      }))
  }
  return new Response('Not Found', {status: 404})
}