"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function CTA() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col text-center rounded-md p-6 lg:p-14 gap-8 items-center transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
        >
          <div className="flex flex-col gap-2 max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">
              The Ultimate Crypto Trading Platform!
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground">
              SwiftBase is a secure and fast cryptocurrency platform designed to give users absolute control over their assets. Whether you’re buying, selling, or recovering lost funds, SwiftBase ensures a seamless experience.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 flex items-center"
            >
              Sign up here <MoveRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
