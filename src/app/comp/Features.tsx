"use client";

import { Check } from "lucide-react";


interface FeatureCardProps {
    title: string;
    description: string;
  }
  
  const FeatureCard = ({ title, description }: FeatureCardProps) => (
    <div className="flex flex-row gap-4 p-4 border rounded-xl shadow-sm dark:border-gray-700">
      <Check className="w-5 h-5 mt-1 text-primary" />
      <div className="flex flex-col gap-1">
        <p className="font-medium text-lg">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
  
  const features = [
    { title: "Recover Lost Funds", description: "Get your funds back if sent to the wrong chain." },
    { title: "Prevent Scams", description: "You control when coins are released to users." },
    { title: "Secure Transactions", description: "Protect your assets with our robust security measures." },
    { title: "User-Friendly", description: "A seamless experience for both beginners and experts." },
    { title: "Fast and Reliable", description: "Lightning-fast transactions with top-tier reliability." },
    { title: "Modern & Intuitive", description: "A beautifully designed, easy-to-use platform." },
  ];
  

export default function Feature() {

  
  return (
    <div className="w-full py-10 dark:bg-black md:py-16 lg:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 lg:px-6">
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Take Control of Your Crypto Assets
            </h2>
            <p className="text-lg max-w-2xl text-muted-foreground">
              Recover lost funds, prevent scams, and stay in charge of your digital assets with our secure platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};