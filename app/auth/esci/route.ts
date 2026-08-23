import { NextResponse, type NextRequest } from "next/server";
import { creaClientServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await creaClientServer();
  await supabase?.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
