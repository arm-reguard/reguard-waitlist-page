"use client";

import React, { useId } from 'react';

interface ReGuardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "submit" | "reset" | "button";
}

export const ReGuardButton = ({ 
  children = "Join Waitlist", 
  onClick, 
  className = "",
  type = "submit",
  ...props 
}: ReGuardButtonProps) => {
  const id = useId().replace(/:/g, '');
  const childrenText = typeof children === 'string' ? children : 'Join Waitlist';

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .reguard-button-${id} .wrap::before,
          .reguard-button-${id} .wrap::after {
            content: "";
            position: absolute;
            transition: all 0.3s ease;
            pointer-events: none;
          }
          
          .reguard-button-${id} .wrap::before {
            left: -15%;
            right: -15%;
            bottom: 25%;
            top: -100%;
            border-radius: 50%;
            background-color: rgba(167, 139, 250, 0.15);
          }
          
          .reguard-button-${id} .wrap::after {
            left: 6%;
            right: 6%;
            top: 30%;
            bottom: 40%;
            border-radius: 9999px;
            box-shadow: inset 0 10px 8px -10px rgba(167, 139, 250, 0.6);
            background: linear-gradient(
              180deg,
              rgba(167, 139, 250, 0.25) 0%,
              rgba(0, 0, 0, 0) 50%,
              rgba(0, 0, 0, 0) 100%
            );
          }
          
          .reguard-button-${id} .wrap p .star-icon:nth-child(2) {
            display: none;
          }
          
          .reguard-button-${id}:hover .wrap p .star-icon:nth-child(1) {
            display: none;
          }
          
          .reguard-button-${id}:hover .wrap p .star-icon:nth-child(2) {
            display: inline-block;
          }
          
          .reguard-button-${id}::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            background-image: linear-gradient(0deg, rgba(167, 139, 250, 0.9), rgba(139, 92, 246, 1), rgba(167, 139, 250, 0.6) 8%, transparent);
            background-position: 0 0;
            opacity: 0;
            transition: opacity 0.4s, filter 0.4s;
            -webkit-mask-image: linear-gradient(0deg, #fff, transparent);
            mask-image: linear-gradient(0deg, #fff, transparent);
          }
          
          .reguard-button-${id}:hover {
            box-shadow:
              inset 0 0.3rem 0.5rem rgba(167, 139, 250, 0.4),
              inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
              inset 0 -0.4rem 0.9rem rgba(139, 92, 246, 0.6),
              0 0 30px rgba(139, 92, 246, 0.3),
              0 0 15px rgba(167, 139, 250, 0.2);
          }
          
          .reguard-button-${id}:hover::after {
            opacity: 0.6;
          }
          
          .reguard-button-${id}:hover .wrap::before {
            transform: translateY(-5%);
          }
          
          .reguard-button-${id}:hover .wrap::after {
            opacity: 0.4;
            transform: translateY(5%);
          }
          
          .reguard-button-${id}:hover .wrap p {
            transform: translateY(-4%);
          }
          
          .reguard-button-${id}:active {
            transform: translateY(4px);
            box-shadow:
              inset 0 0.3rem 0.5rem rgba(167, 139, 250, 0.5),
              inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
              inset 0 -0.4rem 0.9rem rgba(139, 92, 246, 0.4),
              0 0 20px rgba(139, 92, 246, 0.2);
          }
          
          .reguard-button-${id}:active::after {
            opacity: 1;
            filter: brightness(200%);
          }
          
          .reguard-button-${id}:active .letter-${id} {
            text-shadow: 0 0 1px rgba(167, 139, 250, 0.9);
          }
          
          .reguard-button-${id}:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          /* Letter styling */
          .letter-${id} {
            display: inline-block;
            color: #ffffff;
            transition: color 0.4s, text-shadow 0.4s, opacity 0.4s, filter 0.4s;
          }
          
          /* Mobile optimizations - disable heavy effects */
          @media (max-width: 768px) {
            .reguard-button-${id} .wrap::before,
            .reguard-button-${id} .wrap::after {
              display: none;
            }
            
            .reguard-button-${id}::after {
              display: none;
            }
          }
        `
      }} />

      <div className={className}>
        <button
          type={type}
          className={`reguard-button-${id}`}
          style={{
            outline: 'none',
            cursor: 'pointer',
            border: 0,
            position: 'relative',
            borderRadius: '9999px',
            backgroundColor: '#0a0a0a',
            transition: 'all 0.2s ease',
            boxShadow: `
              inset 0 0.3rem 0.9rem rgba(167, 139, 250, 0.3),
              inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
              inset 0 -0.4rem 0.9rem rgba(167, 139, 250, 0.5),
              0 4px 12px rgba(0, 0, 0, 0.4)
            `,
          }}
          onClick={onClick}
          {...props}
        >
          <div 
            className="wrap" 
            style={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'var(--font-source-sans-3)',
              color: '#ffffff',
              padding: '18px 48px 16px 48px',
              borderRadius: 'inherit',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <p style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: 0,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}>
              <span className="star-icon" style={{ fontSize: '16px' }}>✧</span>
              <span className="star-icon" style={{ fontSize: '16px' }}>✦</span>
              <span>
                {Array.from(childrenText).map((char, i) => (
                  <span key={i} className={`letter-${id}`}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </button>
      </div>
    </>
  );
};
