"use client";

export function SchemaErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Database setup required
          </h1>
          <p className="text-sm text-muted-foreground">
            Your account exists but has no profile record. This means the
            Supabase schema hasn&apos;t been applied yet.
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4 text-left space-y-2">
          <p className="text-sm font-medium">To fix this:</p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open your Supabase project → SQL Editor</li>
            <li>
              Paste the full contents of{" "}
              <code className="bg-background px-1 py-0.5 rounded text-xs">
                supabase/schema.sql
              </code>
            </li>
            <li>Click Run</li>
            <li>Sign in again</li>
          </ol>
        </div>

        <a
          href="/api/auth/signout"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Sign out
        </a>
      </div>
    </div>
  );
}
