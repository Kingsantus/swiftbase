'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "next-themes";
import { type SignupInput, SignupSchema } from '@/validators/signup-validators';
import { valibotResolver } from "@hookform/resolvers/valibot";
import { signupUserAction } from '@/actions/signup-user-action';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [success, setSuccess] = useState(false);

  // Set theme based on system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: valibotResolver(SignupSchema),
  });

 // Handle signup logic
 const onSubmit = async (data: SignupInput) => { 
  const res = await signupUserAction(data);

  if (res.success) {
      setSuccess(true);
  } else {
      switch (res.statusCode) {
          case 400:
              const nestedErrors = res.error.nested;
              for (const key in nestedErrors) {
                  setError(key as keyof SignupInput, {
                      message: nestedErrors[key]?.[0]
                  });
              }
              break;
          case 500: // Fixed syntax error (changed `;` to `:`)
          default:
              const error = res.error || "Internal Server Error";
              setError("confirmPassword", { message: error });
      }
  }
};

if (success) {
  return (
    <div>
      <p>User Successfully created!</p>
      <span>
        Click{" "}
        <Button variant="link" size="sm" className='px-0' asChild>
          <Link href="/login">Here</Link>
        </Button>{" "}
        to Login.
      </span>
    </div>
  )
}


  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-4 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md lg:max-w-lg xl:max-w-xl p-6 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            Enter your details below to create an account
          </p>
          <Button variant="outline" className="w-full flex items-center gap-2 mb-4" aria-label="Continue with Google">
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Or continue with email</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
            <label htmlFor="firstName" className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <Input type="text" placeholder="First Name" {...register("firstName")} aria-label="First Name" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            
            <div>
            <label htmlFor="lastName" className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <Input type="text" placeholder="Last Name" {...register("lastName")} aria-label="Last Name" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
            
            <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input type="email" placeholder="Email" {...register("email")} aria-label="Email address" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            

            <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Input type="password" placeholder="Password" {...register("password")} aria-label="Password" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            

            <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <Input type="password" placeholder="Confirm Password" {...register("confirmPassword")} aria-label="Confirm Password" />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            

            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
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