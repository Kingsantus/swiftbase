"use server"

import { signOut } from "@/auth";

export async function logoutUserAction() {
    try {
        await signOut({ redirect: false });
    } catch (err) {
        console.log(err);
    }
}