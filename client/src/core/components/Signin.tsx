import { Button } from "#src/components/ui/button.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Label } from "#src/components/ui/label.tsx";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import { authClient } from "#src/lib/auth.ts";
import { queryClient } from "#src/lib/query.ts";
import { router } from "#src/lib/router.ts";
import { Link } from "@tanstack/react-router";

const handleSignin: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const { data: session } = await authClient.signIn.email({ email, password });

  if (session) {
    await queryClient.invalidateQueries({
      queryKey: sessionQueryOptions().queryKey,
    });
    router.navigate({ to: "/", replace: true });
  }
};

export function Signin() {
  return (
    <main className="w-dvw h-dvh flex flex-row items-center">
      <div className="w-full sm:max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In To Akki</h1>

        <form onSubmit={handleSignin} className="mb-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                maxLength={128}
                placeholder="••••••••••"
                required
              />
            </div>

            <Button type="submit" size={"lg"} className={"h-12"}>
              Sign In
            </Button>
          </div>
        </form>

        <div className="flex justify-center gap-2 items-center text-muted-foreground">
          <p>New around here?</p>

          <Link
            to="/sign-up"
            className="underline-offset-4 underline hover:text-blue-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
