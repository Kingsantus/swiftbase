"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { LoginInput, LoginSchema } from "@/validators/login-validators";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { loginUserAction } from "@/actions/login-user-action";

export default function LoginPage() {
  const router = useRouter();
  const { setTheme } = useTheme();

  // Set theme based on system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }
  }, [setTheme]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: valibotResolver(LoginSchema),
  });

  // Handle login logic
  const onSubmit = async (data: LoginInput) => {
    const res = await loginUserAction(data)

    if (res.success){
      window.location.href = "/dashboard";
    } else {
      switch(res.statusCode){
        case 401:
          setError("password", { message: res.error });
          break;
        case 500:
          default:
            const error = res.error || "Internal Server Error";
            setError("password", { message: error});
      }
    }
    // In a real app, you'd make an API call here
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md lg:max-w-lg xl:max-w-xl p-6 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Login to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            Enter your credentials to log in
          </p>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 mb-4"
            aria-label="Continue with Google"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            Or continue with email
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
              <Input
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                aria-label="Email address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                aria-label="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="text-center text-sm mt-4 space-y-2">
            <p>
              Dont have an account?
              <button
                className="text-blue-500 hover:underline ml-1"
                onClick={() => router.push("/signup")}
                aria-label="Go to signup page"
              >
                Sign up
              </button>
            </p>
            <p>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => router.push("/forgot-password")}
                aria-label="Go to forgot password page"
              >
                Forgot password?
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
