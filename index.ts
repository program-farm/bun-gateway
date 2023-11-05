import {handleError} from "./packages/plugins/default-error-handler";
import {mainHandler} from "./packages/core";
import {deleteUnsecureHeaders, handle401} from "./packages/plugins/authorization-handler";

Bun.serve({
  port: parseInt(Bun.env.PORT!) || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.headers.get('X-Forwarded-Host') === null || req.headers.get('Authorization') !== null) {
      deleteUnsecureHeaders(req);
    }
    return mainHandler(req, url)
      .then((response) => {
        switch (response.status) {
          case 401:
            return handle401(req);
          default:
            return response;
        }
      })
      .catch(handleError);
  },
});


console.log(`Listening on ${Bun.env.PORT || 3000}`);