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

const sendUpstreamPost = async (req: NextRequest) =>
  // fetch(`https://jsonplaceholder.typicode.com/posts`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     foo: req.body ? await req.text() : "no body text",
  //   }),
  //   headers: { "Content-type": "application/json" },
  // });
  literalFailingUpstreamResponse();

const getDownstreamHeaders = (upstreamResponse: Response) => {
  console.log(
    `XXXXX upstream response headers`,
    Object.fromEntries(upstreamResponse.headers)
  );

  const headers = new Headers(upstreamResponse.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");
  headers.delete("location");

  console.log(
    `XXXXX downstream headers`,
    Object.fromEntries(headers.entries())
  );
  return headers;
};

const literalFailingUpstreamResponse = () => {
  return new Response(
    '{"type":"CONTAINER","id":{"serviceId":"16751367","accountId":"998892611","objectId":"c16ad138-a40f-42e2-9bcd-dfb102bf28d1"},"name":"Queue","ephemeral":true,"playable":true,"resourceCount":400}',
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": "192",
        ETag: "8",
        "X-Response-Time": "565ms",
        Date: "Fri, 31 May 2024 14:33:16 GMT",
      },
    }
  );
};
