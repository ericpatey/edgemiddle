import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  switch (req.url.split("/").pop()) {
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

  const upstreamResponse =
    req.method === "GET"
      ? await sendUpstreamGet(req)
      : await sendUpstreamPost(req);

  return new NextResponse(upstreamResponse.body, {
    headers: getDownstreamHeaders(upstreamResponse),
  });
}

const sendUpstreamGet = async (req: NextRequest) =>
  fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${
      Math.floor(Math.random() * 10) + 1
    }`
  );

const sendUpstreamPost = async (req: NextRequest) => {
  return fetch(
    `https://api.test.ws.sonos.com/content/api/v1/groups/RINCON_347E5CE0055E01400%3A365384700/services/16751367/accounts/998892611/queues/c16ad138-a40f-42e2-9bcd-dfb102bf28d1/resources?position=NaN`,
    {
      method: "POST",
      body: req.body ? JSON.stringify(await req.json()) : "no body",
      headers: {
        authorization: req.headers.get("authorization") ?? "asdf",
        "Content-type": "application/json",
        "if-match": req.headers.get("if-match") ?? "asdf",
      },
    }
  );
};

const getDownstreamHeaders = (upstreamResponse: Response) => {
  console.log(
    `XXXXX upstream response headers`,
    Object.fromEntries(upstreamResponse.headers)
  );

  const headers = new Headers(upstreamResponse.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");
  // headers.delete("location");

  console.log(
    `XXXXX downstream headers`,
    Object.fromEntries(headers.entries())
  );
  return headers;
};
