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
import { Ambulance, LogIn, Lock, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthErrorResponse } from "@/core/types/auth.interface";
import { ambulanceSignIn } from "@/app/actions/auth/ambulance.action";
import { useAmbulance } from "@/context/ambulance-context";

function AmbulanceSignInForm() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();

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
    setErrors({});

    try {
      const result = await ambulanceSignIn({
        contact,
        password,
      });

      if (result.success && result.data) {
        toast.success("Sign in successful! Redirecting...");
        // Reset form
        setContact("");
        setPassword("");

        // Refetch ambulance data and update context
        await refetchAmbulance();

        // Redirect to home or the intended destination
        const redirectTo = searchParams.get("redirectTo") || "/";
        setTimeout(() => router.push(redirectTo), 1000);
      } else if (result.error) {
        // Handle field-specific errors
        console.log("Full error response:", result.error);
        const error = result.error as AuthErrorResponse;

        // // For debugging
        // console.log("Full error response:", result.error);
        // console.log("Processed errors:", error);

        if (error.message === "user doesnot exists.") {
          setErrors({ contact: error.message });
        } else if (error.message === "password is incorrect.") {
          setErrors({ password: error.message });
        }

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
            Ambulance Sign in
          </CardTitle>
          <CardDescription className="text-center">
            Enter your contact and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <div className="relative">
                  <Input
                    id="contact"
                    type="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    disabled={isLoading}
                    className={
                      errors.contact ? "border-red-500 pl-10" : "pl-10"
                    }
                    placeholder="Enter your contact number"
                  />
                  <Phone className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact}
                    </p>
                  )}
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
                    className={
                      errors.password ? "border-red-500 pl-10" : "pl-10"
                    }
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
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
            Sign In as regular user{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AmbulanceSignInClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <AmbulanceSignInForm />
    </Suspense>
  );
}
