"use client";

import { logoutUserAction } from "@/actions/logout-user-action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
    const clickHandler = async () => {
        await logoutUserAction();
        window.location.href = "/";
    };

    return (
        <Button className="text-lg" variant="outline" onClick={clickHandler}>
            Logout <LogOut />
        </Button>
    );
};
