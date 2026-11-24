import { Alert, AlertTitle } from "#src/components/ui/alert.tsx";
import { Button } from "#src/components/ui/button.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Label } from "#src/components/ui/label.tsx";
import { sessionQueryOptions } from "#src/core/queries/session-query.ts";
import { authClient } from "#src/lib/auth.ts";
import { queryClient } from "#src/lib/query.ts";
import { router } from "#src/lib/router.ts";
import { Link } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";

export function Signup() {
  const [isError, setIsError] = useState(false);

  const handleChange = () => {
    setIsError(false);
  };

  const handleSignup: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    const { data: session } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (session) {
      await queryClient.invalidateQueries({
        queryKey: sessionQueryOptions().queryKey,
      });
      setIsError(false);
      router.navigate({ to: "/", replace: true });
    } else {
      setIsError(true);
    }
  };

  return (
    <main className="w-dvw h-dvh flex flex-row items-center">
      <div className="w-full sm:max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-center py-4">Sign Up</h1>

        <form onSubmit={handleSignup}>
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

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                minLength={1}
                maxLength={100}
                placeholder="Name"
                required
                onChange={handleChange}
              />
            </div>

            <Button type="submit" size={"lg"} className={"h-10"}>
              Sign Up
            </Button>
          </div>
        </form>

        <div className="flex justify-center gap-2 items-center text-muted-foreground text-sm">
          <p>Already have an account?</p>

          <Link
            to="/sign-in"
            className="underline-offset-4 underline hover:text-blue-500"
          >
            Sign In
          </Link>
        </div>

        {isError && (
          <Alert variant="destructive" className="my-4">
            <AlertCircleIcon />
            <AlertTitle>Unable to create account</AlertTitle>
          </Alert>
        )}
      </div>
    </main>
  );
}
