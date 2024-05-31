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

Perform this `GET` to obtain the proper `ETag`
`curl --location --request GET '<<deplyment baseUrl>>/ifMatch?upstream-url=https%3A%2F%2Fapi.test.ws.sonos.com%2Fcontent%2Fapi%2Fv1%2Fgroups%2FRINCON_347E5CE0055E01400%253A365384700%2Fservices%2F16751367%2Faccounts%2F998892611%2Fqueues%2Fc16ad138-a40f-42e2-9bcd-dfb102bf28d1%2Fresources%3Fposition%3DNaN' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <<access token tbs>>' \
--data '{"id":{"accountId":"1","objectId":"spotify:playlist:37i9dQZF1E4ptIIqM81te8","serviceId":"3079"},"type":"PLAYLIST"}'`

> This will fail when run in Vercel because of the first issue. Running from `localhost` should work. Currently, the `ETag` is `'18'`.

Perform `curl --location '<<deplyment baseUrl>>/ifMatch?upstream-url=https%3A%2F%2Fapi.test.ws.sonos.com%2Fcontent%2Fapi%2Fv1%2Fgroups%2FRINCON_347E5CE0055E01400%253A365384700%2Fservices%2F16751367%2Faccounts%2F998892611%2Fqueues%2Fc16ad138-a40f-42e2-9bcd-dfb102bf28d1%2Fresources%3Fposition%3DNaN' \
--header 'If-Match: <<ETag from prior GET step>>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <<access token tbs>>' \
--data '{"id":{"accountId":"1","objectId":"spotify:playlist:37i9dQZF1E4ptIIqM81te8","serviceId":"3079"},"type":"PLAYLIST"}'`

When the `POST` is sent (implied in the 2nd curl because of `--data`), it will properly update the resource. However, when running in Vercel, it will `412`. When running locally, it `200`'s.
