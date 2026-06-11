import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Redirect to /login. Because this is a Route Handler (not a Server
  // Component), the setAll cookie handler CAN write cookies, so the session
  // is properly cleared before the browser lands on /login.
  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );
}
