import {authConfig} from "./constants.ts";

export function deleteUnsecureHeaders(request: Request): void {
  for (const hName of authConfig.userHeaders) {
    request.headers.delete(hName);
  }
}