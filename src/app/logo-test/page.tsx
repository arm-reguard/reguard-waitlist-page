"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LogoTestPage() {
  const [selectedSize, setSelectedSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  
  const logos = [
    {
      id: "group4",
      name: "Group 4 - Purple Gradient",
      svg: "/logos/Group 4.svg",
      png1x: "/logos/Group 4.png",
      png2x: "/logos/Group 4@2x.png",
      png3x: "/logos/Group 4@3x.png",
    },
    {
      id: "group5",
      name: "Group 5 - Similar Purple",
      svg: "/logos/Group 5.svg",
      png1x: "/logos/Group 5.png",
      png2x: "/logos/Group 5@2x.png",
      png3x: "/logos/Group 5@3x.png",
    },
    {
      id: "group6",
      name: "Group 6 - All White",
      svg: "/logos/Group 6.svg",
      png1x: "/logos/Group 6.png",
      png2x: "/logos/Group 6@2x.png",
      png3x: "/logos/Group 6@3x.png",
    },
    {
      id: "group7",
      name: "Group 7 - Masked Version",
      svg: "/logos/Group 7.svg",
      png1x: "/logos/Group 7.png",
      png2x: "/logos/Group 7@2x.png",
      png3x: "/logos/Group 7@3x.png",
    },
  ];

  const sizeClasses = {
    mobile: "w-[75px] h-auto",
    tablet: "w-[100px] h-auto",
    desktop: "w-[110px] h-auto",
  };

  const sizeLabels = {
    mobile: "Mobile (75px)",
    tablet: "Tablet (100px)",
    desktop: "Desktop (110px)",
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-block mb-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Logo Test Page</h1>
          <p className="text-zinc-400">
            Test all logo variations at actual site sizes. The size you pick will be used on the main page.
          </p>
        </div>

        {/* Size Selector */}
        <div className="mb-8 flex gap-4">
          {(["mobile", "tablet", "desktop"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedSize === size
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {sizeLabels[size]}
            </button>
          ))}
        </div>

        {/* Current Size Display */}
        <div className="mb-8 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-400">
            Currently viewing: <span className="text-white font-semibold">{sizeLabels[selectedSize]}</span>
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            This is the exact size used on the {selectedSize} breakpoint of your site
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-purple-500/50 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">
                {logo.name}
              </h3>

              {/* SVG Preview */}
              <div className="mb-6">
                <p className="text-sm text-zinc-400 mb-3">SVG (Recommended)</p>
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-6 flex items-center justify-center min-h-[120px]">
                  <Image
                    src={logo.svg}
                    alt={logo.name}
                    width={400}
                    height={100}
                    className={sizeClasses[selectedSize]}
                  />
                </div>
              </div>

              {/* PNG Previews */}
              <div className="space-y-4">
                <p className="text-sm text-zinc-400">PNG Versions</p>
                
                {/* 1x PNG */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-2">1x PNG</p>
                  <div className="flex items-center justify-center min-h-[80px]">
                    <Image
                      src={logo.png1x}
                      alt={`${logo.name} 1x`}
                      width={400}
                      height={100}
                      className={sizeClasses[selectedSize]}
                    />
                  </div>
                </div>

                {/* 2x PNG */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-2">2x PNG (Retina)</p>
                  <div className="flex items-center justify-center min-h-[80px]">
                    <Image
                      src={logo.png2x}
                      alt={`${logo.name} 2x`}
                      width={800}
                      height={200}
                      className={sizeClasses[selectedSize]}
                    />
                  </div>
                </div>

                {/* 3x PNG */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-2">3x PNG (High DPI)</p>
                  <div className="flex items-center justify-center min-h-[80px]">
                    <Image
                      src={logo.png3x}
                      alt={`${logo.name} 3x`}
                      width={1200}
                      height={300}
                      className={sizeClasses[selectedSize]}
                    />
                  </div>
                </div>
              </div>

              {/* Copy Code Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(logo.svg);
                  alert(`Copied path: ${logo.svg}`);
                }}
                className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                Copy SVG Path
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="space-y-2 text-zinc-300 text-sm list-decimal list-inside">
            <li>Toggle between Mobile, Tablet, and Desktop sizes using the buttons above</li>
            <li>Compare all 4 logo variations at each size</li>
            <li>Choose your favorite logo variant</li>
            <li>Tell me which one you want (Group 4, 5, 6, or 7)</li>
            <li>I'll update the main site with your choice at these exact sizes</li>
          </ol>
          <p className="mt-4 text-xs text-zinc-500">
            Note: The SVG version is recommended for best quality at all screen sizes
          </p>
        </div>
      </div>
    </div>
  );
}

