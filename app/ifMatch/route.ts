import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  return new NextResponse("Shouldn't get here — ifMatch route");
}

export async function POST(req: NextRequest): Promise<Response> {
  return new NextResponse("Shouldn't get here — ifMatch route");
}
