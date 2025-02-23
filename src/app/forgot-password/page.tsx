"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from 'next-themes';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { setTheme } = useTheme();

  // Set theme based on system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  });

  const handleResetPassword = () => {
    console.log("Reset password for:", email);

    // In a real app, you'd make an API call here to send a reset password email
    // Example:
    // fetch('/api/forgot-password', {
    //   method: 'POST',
    //   body: JSON.stringify({ email }),
    //   headers: { 'Content-Type': 'application/json' },
    // })
    // .then(response => response.json())
    // .then(data => {
    //   if (data.success) {
    //     alert("Password reset email sent!");
    //   } else {
    //     alert(data.message); // Show error message
    //   }
    // });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md lg:max-w-lg xl:max-w-xl p-6 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-xl">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            Enter your email to reset your password
          </p>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Button className="w-full" onClick={handleResetPassword}>Reset Password</Button>
          </div>
          <p className="text-center text-sm mt-4">
            Remember your password? 
            <button 
              className="text-blue-500 hover:underline ml-1" 
              onClick={() => router.push("/login")}
              aria-label="Go to login page"
            >
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}