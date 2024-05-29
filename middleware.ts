import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

console.log("asdfasdfasdf");
export default async function middleware() {
  return new NextResponse("Hello from middleware!", {
    headers: { sonos: "rocks", etag: "666" },
  });
}
