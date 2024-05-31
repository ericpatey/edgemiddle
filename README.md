This repo provides a minimal reproduction of three unexpected behaviors.

## Stripping of `ETag` header set by middleware when the middleware fully handles the request.

Perform `curl --location 'https://<<host>>/strippedEtag'`

The middleware for this route will fully handle the request and include the following two headers in the response: `{ sonos: "rocks", etag: "666" }`.

When run locally, the client receives both headers.

When run in Vercel, the client receives `sonos: "rocks"`, but not the `etag`.

## Modifying of `ETag` header set by middleware when the middleware augments the request.

> This one may be uninteresting since it's a bizarre scenario

Perform `curl --location 'https://<<host>>/brokenEtag'`

The middleware for this route will augment the response with the same two headers.

When run locally, the client receives both headers.

When run in Vercel, the `ETag` received by the client has been modified

## Improperly returning `412 — Precondition Failed`
