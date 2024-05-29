import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  return new NextResponse("Hello from API Route");
}
