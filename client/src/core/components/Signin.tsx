import { Button } from "#src/components/ui/button.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Label } from "#src/components/ui/label.tsx";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import { authClient } from "#src/lib/auth.ts";
import { queryClient } from "#src/lib/query.ts";
import { router } from "#src/lib/router.ts";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, AlertTitle } from "#src/components/ui/alert.tsx";
import { AlertCircleIcon } from "lucide-react";

export function Signin() {
  const [isError, setIsError] = useState(false);

  const handleChange = () => {
    setIsError(false);
  };

  const handleSignin: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const { data: session } = await authClient.signIn.email({
      email,
      password,
    });

    if (session) {
      setIsError(false);
      await queryClient.invalidateQueries({
        queryKey: sessionQueryOptions().queryKey,
      });
      router.navigate({ to: "/", replace: true });
    } else {
      setIsError(true);
    }
  };

  return (
    <main className="w-dvw h-dvh flex flex-row items-center">
      <div className="w-full sm:max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center py-4">Sign In To Akki</h1>

        <form onSubmit={handleSignin}>
          <div className="flex flex-col gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            <Button type="submit" size={"lg"} className={"h-10"}>
              Sign In
            </Button>
          </div>
        </form>

        <div className="flex justify-center gap-2 items-center text-muted-foreground text-sm">
          <p>New around here?</p>

          <Link
            to="/sign-up"
            className="underline-offset-4 underline hover:text-blue-500"
          >
            Sign Up
          </Link>
        </div>

        {isError && (
          <Alert variant="destructive" className="my-4">
            <AlertCircleIcon />
            <AlertTitle>Unable to sign in</AlertTitle>
          </Alert>
        )}
      </div>
    </main>
  );
}
