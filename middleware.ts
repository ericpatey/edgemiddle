import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const requestInit = { headers: { sonos: "rocks", etag: "666" } };
  return req.nextUrl.searchParams.get("handle") === "1"
    ? new NextResponse("Hello from middleware!", requestInit)
    : NextResponse.next(requestInit);
}
