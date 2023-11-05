import {authConfig} from "./constants.ts";


export async function handle401(request: Request) {
  const response = await fetch(authConfig.verifyApiUrl, {method: 'POST', headers: request.headers})
  if (response.status >= 400 || response.status < 200) {
    return response;
  }
  request = new Request(request.url, {
    method: request.method,
    body: request.body,
    headers: request.headers,
  })
  request.headers.delete('Authorization')
  for (const hName of authConfig.userHeaders) {
    const headerValue = response.headers.get(hName)
    if (headerValue === null) continue;
    request.headers.set(hName, headerValue)
  }
  return fetch(request)
}