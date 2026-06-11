"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInAction(
  email: string,
  password: string
): Promise<{ error: string } | undefined> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // redirect() throws a special Next.js error that navigates the client.
  // The session cookie is already written to the response by createClient's
  // setAll handler (server-side), so the middleware will see the user on the
  // very next request to /dashboard.
  redirect("/dashboard");
}
