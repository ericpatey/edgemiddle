This repo provides a minimal reproduction of Next.js middleware stripping any `etag` header set by the middleware when the middleware fully handles the request.

The middleware always adds two headers to the response: `{ sonos: "rocks", etag: "666" }`. 

If the url has a search param of `handle=1`, the middleware will fully handle the response — not allowing it to go to the route handler. In this case, the `etag` header will be stripped.

If the url does not have that search param, the middleware will add the headers, and the request will proceed to the route handler. In this case both headers make it to the client.

Additionally, this bug does not reproduce when running locally — likely because there is no real edge environment when running locally.
