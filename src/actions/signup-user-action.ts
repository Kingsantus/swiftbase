"use server";

import { SignupSchema } from "@/validators/signup-validators";
import * as v from "valibot";
import argon2 from "argon2";
import { db } from "@/db";
import { lower, users } from "@/db/schema";
import { eq } from "drizzle-orm";

type Res = 
    | { success: true }
    | { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
    | { success: false; error: string; statusCode: 409 | 500 };

export async function signupUserAction(values: unknown): Promise<Res> {

    const parsedValues = v.safeParse(SignupSchema, values);

    if (!parsedValues.success) {
        const flatErrors = v.flatten(parsedValues.issues);
        return { success: false, error: flatErrors, statusCode: 400 };
    }

    const { firstName, lastName, email, password } = parsedValues.output;

    const name = `${firstName} ${lastName}`;
   
    try {
        const existingUser = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(lower(users.email), email.toLowerCase()))
            .then(res => res[0] ?? null);

        if (existingUser?.id) {
            return { success : false, error: "Email already exists", statusCode: 409}
        }

    } catch (err) {
        console.error(err);
        return { success: false, error: "Internal Server Error", statusCode: 500
        };
    }

    try {
        const hashedPassword = await argon2.hash(password);

        const newUser = await db.insert(users)
            .values({
                name, email, password: hashedPassword
            })
            .returning({ id: users.id })
            .then((res) => res[0]);

        console.log({insertedId: newUser.id})

        // const newWallet = await db.insert(wallets)
        //     .values({
        //         userId: newUser.id, wallet, chain, privateKey
        //     })

        

        return { success: true };
    } catch (err) {
        console.error("Signup Error:", err);
        return { success: false, error: "Internal Server Error", statusCode: 500 };
    }
}
