"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function LoginForm() {
  const { toast } = useToast();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      const form = event.currentTarget;
      const email = form.email.value;
      const password = form.password.value;

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/marketplace");
      }
    } catch (err) {
      const error = err as {
        errors: Array<{
          code: string;
          message: string;
        }>;
      };

      console.error(JSON.stringify(error, null, 2));
      switch (error.errors?.[0]?.code) {
        case "form_identifier_not_found":
          toast({
            variant: "destructive",
            title: "Account not found",
            description: "No account exists with this email address.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          break;
        case "form_password_incorrect":
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "Incorrect password. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          break;
        default:
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An error occurred during sign in.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (
    strategy: "oauth_google" | "oauth_github"
  ) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/auth-callback",
        redirectUrlComplete: "/marketplace",
      });
    } catch (error) {
      console.error("OAuth error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not connect to provider. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-black border border-gray-800 z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-transparent bg-clip-text">
          Welcome Back to NeoMarket
        </CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to access your digital assets and marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email:{" "}
              <span
                className="font-bold text-white cursor-pointer hover:text-pink-400 transition-colors relative group"
                onClick={() => {
                  navigator.clipboard
                    .writeText("xeo3221.testing@gmail.com")
                    .then(() => {
                      toast({
                        title: "Copied to clipboard!",
                        description: "Email copied successfully",
                        variant: "default",
                      });
                    })
                    .catch(() => {
                      toast({
                        title: "Failed to copy",
                        description: "Please try again",
                        variant: "destructive",
                      });
                    });
                }}
              >
                xeo3221.testing@gmail.com
                <span className="text-white absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Copy
                </span>
              </span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="netrunner@nightcity.com"
              required
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 ring-offset-pink-500/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password:{" "}
              <span
                className="font-bold text-white cursor-pointer hover:text-pink-400 transition-colors relative group"
                onClick={() => {
                  navigator.clipboard
                    .writeText("NeoMarket!")
                    .then(() => {
                      toast({
                        title: "Copied to clipboard!",
                        description: "Email copied successfully",
                        variant: "default",
                      });
                    })
                    .catch(() => {
                      toast({
                        title: "Failed to copy",
                        description: "Please try again",
                        variant: "destructive",
                      });
                    });
                }}
              >
                NeoMarket!
                <span className="text-white absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Copy
                </span>
              </span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 ring-offset-pink-500/70 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-white hover:from-pink-600 hover:via-purple-600 hover:to-violet-800 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="h-5 w-5 animate-spin mr-2" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="mt-4 flex flex-col space-y-2">
          <Button
            onClick={() => handleOAuthSignIn("oauth_google")}
            className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </Button>
          <Button
            onClick={() => handleOAuthSignIn("oauth_github")}
            className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            <FaGithub className="mr-2" /> Sign in with GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/forgot-password">
          <Button variant="link" className="text-pink-500 hover:text-pink-400">
            Forgot password?
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button
            variant="link"
            className="text-purple-500 hover:text-purple-400"
          >
            Create account
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
