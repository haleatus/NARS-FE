/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import { Ambulance, UserPlus, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthErrorResponse } from "@/core/interface/auth.interface";
import { adminSignUp } from "@/app/actions/auth/admin.action";

export default function AdminSignUpClient() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await adminSignUp({
        username,
        email,
        password,
      });

      if (result.success && result.data) {
        toast.success("Signup successful! Redirecting...");
        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
        // Redirect after a short delay
        setTimeout(() => router.push("/signin"), 1000);
      } else if (result.error) {
        // Handle field-specific errors
        const error = result.error as AuthErrorResponse;

        // Show error toast
        toast.error(error.message);
      }
    } catch (error: any) {
      console.log("Error in Signup Client : ", error);
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
            Create an admin account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your NARS account
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
                    placeholder="Enter your username"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
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
                    Creating account...
                  </div>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full text-muted-foreground">
            Already have an account?{" "}
            <Link href="/admin-signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
