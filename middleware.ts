import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  if (req.method === "POST") return NextResponse.next();
  const requestInit = { headers: { sonos: "rocks", etag: "666" } };

  const lastPath = req.url.split("/").pop();

  switch (lastPath) {
    case "strippedEtag":
      return new NextResponse("Hello from middleware!", requestInit);
    case "properEtag":
      return NextResponse.next(requestInit);
    case "ifMatch":
      return handleIfMatch(req);
    default:
      return new NextResponse(undefined, { status: 404 });
  }
}

async function handleIfMatch(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "POST")
    return new NextResponse(undefined, { status: 405 });

  const upstreamResponse = await (req.method === "GET"
    ? fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${
          Math.floor(Math.random() * 10) + 1
        }`
      )
    : fetch(`https://jsonplaceholder.typicode.com/posts`, {
        method: "POST",
        body: JSON.stringify({
          foo: req.body ? await req.text() : "no body text",
        }),
        headers: { "Content-type": "application/json" },
      }));

  return new NextResponse(upstreamResponse.body, {
    headers: getDownstreamHeaders(upstreamResponse),
  });
}

const getDownstreamHeaders = (upstreamResponse: Response) => {
  const headers = new Headers(upstreamResponse.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");
  return headers;
};
