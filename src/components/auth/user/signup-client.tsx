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
import { Ambulance, UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthErrorResponse } from "@/core/types/auth.interface";
import { toast } from "sonner";
import { userSignUp } from "@/app/actions/auth/user.action";

export default function SignUpClient() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await userSignUp({
        fullname,
        contact,
        email,
        password,
      });

      if (result.success && result.data) {
        toast.success("Signup successful! Redirecting...");
        // Reset form
        setFullname("");
        setContact("");
        setEmail("");
        setPassword("");
        // Redirect after a short delay
        setTimeout(() => router.push("/signin"), 1000);
      } else if (result.error) {
        // Handle field-specific errors
        const error = result.error as AuthErrorResponse;
        setErrors({ message: error.message });

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
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your NARS account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    disabled={isLoading}
                    className={
                      errors.message ? "border-red-500 pl-10" : "pl-10"
                    }
                    placeholder="Enter your name"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                    className={
                      errors.message ? "border-red-500 pl-10" : "pl-10"
                    }
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <div className="relative">
                  <Input
                    id="contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    disabled={isLoading}
                    className={
                      errors.message ? "border-red-500 pl-10" : "pl-10"
                    }
                    placeholder="Enter your contact number"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                      errors.message ? "border-red-500 pl-10" : " pl-10"
                    }
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
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
