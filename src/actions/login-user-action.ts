"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type Res = 
    | { success: true }
    | { success: false; error: string; statusCode: 401 | 500 };


export async function loginUserAction(values: unknown): Promise<Res> {
    try {
        if (typeof values !== "object" || values === null || Array.isArray(values)) {
            throw new Error("Invalid JSON Object");
        }
        await signIn("credentials", {...values, redirect: false });

    } catch (err) {
        if (err instanceof AuthError) {
            switch(err.type) {
                case "CredentialsSignin":
                case "CallbackRouteError":
                    return { success: false, error: "Invalid credentials", statusCode: 401 };
                default:
                    return { success: false, error: "Oops, Something went wrong", statusCode: 500 }
            }
        }
        console.error(err)
        return { success: false, error: "Internal Server Error", statusCode: 500 };
    }

    return { success: true }
}
