"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/darkModeOption";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    if (!isAuthenticated) {
      router.push("/signup"); // Redirect to login if not authenticated
    } else {
      // Handle logout logic here (e.g., clear authentication state)
      setIsAuthenticated(false); // Update authentication state
      // Optionally, you can redirect to the home page or another route after logout
      // router.push("/");
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
            <NavigationMenuItem>
              <Link href="/dashboard" className="hover:underline text-lg">
                Dashboard
              </Link>
            </NavigationMenuItem>
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
    <Button className="text-lg" variant="outline" onClick={handleAuth}>
      {isAuthenticated ? "Logout" : "Sign Up"}
    </Button>
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
                <Link href="/" className="hover:underline text-lg">
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className="hover:underline text-lg">
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/services" className="hover:underline text-lg">
                  Services
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="hover:underline text-lg">
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
