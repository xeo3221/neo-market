"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "password">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep("code");
      toast({
        title: "Check your email",
        description: "We've sent you a verification code.",
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !code) return;

    try {
      setIsLoading(true);
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      if (result.status === "needs_new_password") {
        setStep("password");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid or expired code. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not verify code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/marketplace");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-black border border-gray-800 z-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-transparent bg-clip-text">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-gray-400">
          {step === "email" &&
            "Enter your email to receive a verification code"}
          {step === "code" && "Enter the verification code sent to your email"}
          {step === "password" && "Enter your new password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="netrunner@nightcity.com"
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 ring-offset-pink-500/70"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-white hover:from-pink-600 hover:via-purple-600 hover:to-violet-800 transition-all duration-300"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleCodeSubmit} className="space-y-4 text-white">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              disabled={isLoading}
              className="gap-2"
            >
              <InputOTPGroup className="flex justify-center">
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
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-white hover:from-pink-600 hover:via-purple-600 hover:to-violet-800 transition-all duration-300"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-700 text-white hover:from-pink-600 hover:via-purple-600 hover:to-violet-800 transition-all duration-300"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/sign-in">
          <Button
            variant="link"
            className="text-purple-500 hover:text-purple-400"
          >
            Back to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
