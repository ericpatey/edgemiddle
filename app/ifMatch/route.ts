import { headers } from "next/headers";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  throw new Error("Shouldn't get here — ifMatch route");
}
