"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
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
import { Ambulance, LogIn, Lock, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthErrorResponse } from "@/core/types/auth.interface";
import { adminSignIn } from "@/app/actions/auth/admin.action";
import { useAdmin } from "@/context/admin-context";
import { useUser } from "@/context/user-context";
import { useAmbulance } from "@/context/ambulance-context";

function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { refetchAdmin } = useAdmin();
  const { refetchUser } = useUser();
  const { refetchAmbulance } = useAmbulance();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "unauthorized") {
      toast.error("You are not signed in yet.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await adminSignIn({
        username,
        password,
      });

      if (result.success && result.data) {
        toast.success("Admin Sign in successful! Redirecting...");
        // Reset form
        setUsername("");
        setPassword("");

        // Refetch and update context
        await refetchAdmin();
        await refetchAmbulance();
        await refetchUser();

        // Redirect to home or the intended destination
        const redirectTo = searchParams.get("redirectTo") || "/dashboard";
        setTimeout(() => router.push(redirectTo), 1000);
      } else if (result.error) {
        // Handle field-specific errors
        console.log("Full error response:", result.error);
        const error = result.error as AuthErrorResponse;

        // Show error toast
        toast.error(error.message || "Invalid email or password");
      }
    } catch (error) {
      console.log("Error in Signin Client : ", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-primary/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Ambulance className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Sign in as Admin
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                    placeholder="Enter your username"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/admin-signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdminSignInClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
