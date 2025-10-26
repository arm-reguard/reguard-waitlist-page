"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

interface ReGuardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ReGuardButton({ children, className = "", ...props }: ReGuardButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      style={{
        padding: "8px 8px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {/* Glow effect */}
      <div 
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          inset: "-4px",
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, transparent 70%)",
          opacity: isHovered ? 1 : 0.6,
          filter: "blur(12px)",
          zIndex: 0,
        }}
      />
      
      {/* Animated gradient border */}
      <div 
        className="absolute rounded-full"
        style={{
          inset: 0,
          padding: "2px",
          background: "linear-gradient(90deg, #8b5cf6, #a855f7, #8b5cf6)",
          backgroundSize: "200% 100%",
          animation: "gradientSpin 3s linear infinite",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          zIndex: 1,
        }}
      />
      
      <button
        style={{
          position: "relative",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "0",
          width: "100%",
          fontSize: "16px",
          fontWeight: 600,
          color: "white",
          background: "transparent",
          border: "none",
          borderRadius: "9999px",
          cursor: props.disabled ? "not-allowed" : "pointer",
          opacity: props.disabled ? 0.6 : 1,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          whiteSpace: "nowrap",
        }}
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
      >
        <div 
          className="relative overflow-hidden"
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#ffffff',
            padding: '10px 48px',
            borderRadius: 'inherit',
            background: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Inner glow highlights */}
          <div 
            className="absolute transition-all duration-300"
            style={{
              left: '-15%',
              right: '-15%',
              bottom: '25%',
              top: '-100%',
              borderRadius: '50%',
              backgroundColor: 'rgba(167, 139, 250, 0.15)',
              pointerEvents: 'none',
            }}
          />
          
          <div 
            className="absolute transition-all duration-300"
            style={{
              left: '6%',
              right: '6%',
              top: '12%',
              bottom: '40%',
              borderRadius: '9999px',
              boxShadow: 'inset 0 10px 8px -10px rgba(167, 139, 250, 0.6)',
              background: 'linear-gradient(180deg, rgba(167, 139, 250, 0.25) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)',
              pointerEvents: 'none',
            }}
          />

          <p 
            className="relative flex items-center justify-center gap-2 m-0 transition-all duration-200"
            style={{
              transform: 'translateY(2%)',
              maskImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 40%, transparent)',
            }}
          >
            <span>✧</span>
            {children}
          </p>
        </div>
      </button>
    </div>
  );
}