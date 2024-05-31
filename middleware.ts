import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  switch (req.nextUrl.pathname.split("/").pop()) {
    case "strippedEtag":
      return new NextResponse("Hello from middleware!", {
        headers: { sonos: "rocks", etag: "666" },
      });
    case "brokenEtag":
      return NextResponse.next({ headers: { sonos: "rocks", etag: "666" } });
    case "ifMatch":
      return handleIfMatch(req);
    default:
      return new NextResponse(undefined, { status: 404 });
  }
}

async function handleIfMatch(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "POST")
    return new NextResponse(undefined, { status: 405 });

  const upstreamUrl = req.nextUrl.searchParams.get("upstream-url");
  if (!upstreamUrl)
    return new NextResponse("Missing upstreamUrl", { status: 400 });

  const upstreamResponse =
    req.method === "GET"
      ? await fetch(upstreamUrl, {
          headers: {
            authorization: req.headers.get("authorization") ?? "asdf",
          },
        })
      : await sendUpstreamPost(req, upstreamUrl);

  return new NextResponse(upstreamResponse.body, {
    headers: getDownstreamHeaders(upstreamResponse),
  });
}

const sendUpstreamPost = async (req: NextRequest, upstreamUrl: string) => {
  return fetch(upstreamUrl, {
    method: "POST",
    body: req.body ? JSON.stringify(await req.json()) : "no body",
    headers: {
      authorization: req.headers.get("authorization") ?? "asdf",
      "Content-type": "application/json",
      "if-match": req.headers.get("if-match") ?? "asdf",
    },
  });
};

const getDownstreamHeaders = (upstreamResponse: Response) => {
  const headers = new Headers(upstreamResponse.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");
  return headers;
};
