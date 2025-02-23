"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export const Footers = () => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-4 bg-foreground text-background">
      <div className="container mx-auto max-w-screen-1.8xl">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div className="flex gap-6 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-2xl md:text-2xl tracking-tighter max-w-xl font-regular text-left">
                🔐SwiftBase
              </h2>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                Secure and Protect your Investments, secure transaction.
              </p>
            </div>
            <div className="flex gap-10 flex-row">
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                <p>15 Huston Road</p>
                <p>Dance St</p>
                <p>Eg 10234</p>
              </div>
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                <Link href="/terms">Terms of service</Link>
                <Link href="/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="flex text-base gap-1 flex-col items-start">
              <Link href="/" className="text-xl">Home</Link>
            </div>
            <div className="flex text-base gap-1 flex-col items-start">
              <button
                onClick={() => setIsProductOpen(!isProductOpen)}
                className="text-xl focus:outline-none lg:pointer-events-none"
              >
                Product
              </button>
              {(isProductOpen || isLargeScreen) && (
                <div className="flex flex-col">
                  <Link href="/reports" className="text-background/75">Reports</Link>
                  <Link href="/statistics" className="text-background/75">Statistics</Link>
                  <Link href="/dashboards" className="text-background/75">Dashboards</Link>
                </div>
              )}
            </div>
            <div className="flex text-base gap-1 flex-col items-start">
              <button
                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                className="text-xl focus:outline-none lg:pointer-events-none"
              >
                Company
              </button>
              {(isCompanyOpen || isLargeScreen) && (
                <div className="flex flex-col">
                  <Link href="/about" className="text-background/75">About us</Link>
                  <Link href="/investors" className="text-background/75">Investors</Link>
                  <Link href="/contact" className="text-background/75">Contact us</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
