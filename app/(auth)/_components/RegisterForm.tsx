"use client";

import { useSignUp } from "@clerk/nextjs";
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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function RegisterForm() {
  const { toast } = useToast();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      const form = event.currentTarget;
      const email = form.email.value;
      const password = form.password.value;

      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerified(true);
    } catch (err) {
      const error = err as {
        errors: Array<{
          code: string;
          message: string;
        }>;
      };

      console.error(JSON.stringify(error, null, 2));
      switch (error.errors?.[0]?.code) {
        case "form_identifier_exists":
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Email is already registered. Please sign in.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          // toast.error("Email is already registered. Please sign in.");
          break;
        case "form_password_pwned":
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Password is too common. Please choose a stronger password.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          break;
        case "form_param_format_invalid":
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Invalid email address. Please enter a valid email address.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          break;
        case "form_password_length_too_short":
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Password is too short. Please choose a longer password.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          break;
        default:
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!code) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter the verification code",
      });
    }

    setIsVerified(true);

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp?.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/marketplace"); // Direct to marketplace instead of auth-callback
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Invalid verification code. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsVerified(false);
    }
  };

  const handleOAuthSignUp = async (
    strategy: "oauth_google" | "oauth_github"
  ) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/marketplace", // Direct to marketplace instead of auth-callback
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

  // Verification view
  if (verified) {
    return (
      <Card className="w-full max-w-md bg-black border border-gray-800 z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-transparent bg-clip-text">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleVerify}
            className="space-y-4 text-white min-w-full"
          >
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              disabled={isVerified}
              className="gap-2 "
            >
              <InputOTPGroup className="flex justify-center ">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              className="w-full min-w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-white transition-all duration-300 hover:from-pink-600 hover:via-purple-600 hover:to-violet-800"
              disabled={isVerified}
            >
              {isVerified ? (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-black border border-gray-800 z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-transparent bg-clip-text">
          Join NeoMarket
        </CardTitle>
        <CardDescription className="text-gray-400">
          Create your account to enter the neon-lit streets of Night City
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
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
              Password
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 flex flex-col space-y-2">
          <Button
            onClick={() => handleOAuthSignUp("oauth_google")}
            className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            <FaGoogle className="mr-2" /> Sign up with Google
          </Button>
          <Button
            onClick={() => handleOAuthSignUp("oauth_github")}
            className="w-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            <FaGithub className="mr-2" /> Sign up with GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/sign-in">
          <Button
            variant="link"
            className="text-purple-500 hover:text-purple-400"
          >
            Already have an account? Sign in
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
