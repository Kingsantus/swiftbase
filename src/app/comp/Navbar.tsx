"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/darkModeOption";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./Logout-button";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { status } = useSession(); // Properly destructure session
  const isAuthenticated = status === "authenticated"; // Correct way to check authentication

  const handleAuth = () => {
    if (!isAuthenticated) {
      router.push("/signup"); // Redirect to signup if not authenticated
    } else {
      signOut(); // Sign out user if authenticated
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 md:px-20 py-4 shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Left: Logo */}
      <div className="text-2xl font-bold">🔐 SwiftBase</div>

      {/* Center: Navigation Links - Hidden on small screens */}
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <Link href="/" className="hover:underline text-lg">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className="hover:underline text-lg">
                About
              </Link>
            </NavigationMenuItem>
            {isAuthenticated && (
              <NavigationMenuItem>
                <Link href="/dashboard" className="hover:underline text-lg">
                  Dashboard
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link href="/contact" className="hover:underline text-lg">
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right: Mode Toggle & Authentication */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <Button className="text-lg" variant="outline" onClick={handleAuth}>
            Sign Up
          </Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-4 rounded-lg text-gray-900 dark:text-gray-100"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md p-4 md:hidden">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-4">
              <NavigationMenuItem>
                <Link href="/" className="hover:underline text-lg" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className="hover:underline text-lg" onClick={() => setIsMenuOpen(false)}>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isAuthenticated && (
                <NavigationMenuItem>
                  <NavigationMenuLink href="/dashboard" className="hover:underline text-lg" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="hover:underline text-lg" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </nav>
  );
}