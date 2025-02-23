"use client";

import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function Main() {
  return (
    <div className="w-full py-10 lg:py-20 dark:bg-black dark:text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          {/* Left Column - Text Content */}
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">We&apos;re live!</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
              The Ultimate Crypto Trading Platform!
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
              SwiftBase is a secure and fast cryptocurrency platform designed to give users absolute control over their assets. Whether you’re buying, selling, or recovering lost funds, SwiftBase ensures a seamless experience.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <Link
                href="/signup"
                className="px-6 py-3 text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 transition duration-300"
              >
                Sign up here <MoveRight className="inline-block w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="bg-muted rounded-md relative w-full h-[400px] overflow-hidden dark:bg-gray-800">
            <Image
              src="/image/hero.jpg"
              alt="Hero Image"
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}