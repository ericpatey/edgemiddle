This repo provides a minimal reproduction of two bugs.

## Stripping of `ETag` header set by middleware when the middleware fully handles the request.

Perform `curl --location 'https://<<host>>/strippedEtag'`

The middleware for this route will fully handle the request and include the following two headers in the response: `{ sonos: "rocks", etag: "666" }`.

When run locally, the client receives both headers.

When run in Vercel, the client receives `sonos: "rocks"`, but not the `etag`.

Perform `curl --location 'https://<<host>>/brokenEtag'`

The middleware for this route will augment the response with the same two headers.

When run locally, the client receives both headers.

When run in Vercel, the `ETag` received by the client has been modified

The app has a single route at `/api`.

If the url has a search param of `handle=1`, the middleware will fully handle the response — not allowing it to go to the route handler. In this case, the `etag` header will be stripped.

If the url does not have that search param, the middleware will add the headers, and the request will proceed to the route handler. In this case both headers make it to the client.

> [!Note]
> This bug does not reproduce when running locally — likely because there is no real edge environment when running locally.

## Improperly returning `412 — Precondition Failed`
