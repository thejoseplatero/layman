"use client";

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function Logo({ size = 32, className = "", animated = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with glass effect */}
      <circle
        cx="60"
        cy="60"
        r="55"
        fill="rgba(255, 255, 255, 0.05)"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="2"
        className={animated ? "animate-pulse" : ""}
      />
      
      {/* Main "neo" text */}
      <text
        x="60"
        y="45"
        textAnchor="middle"
        className="text-2xl font-bold fill-[#5EE1A9]"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        neo
      </text>
      
      {/* "neo" text with animation */}
      <text
        x="60"
        y="75"
        textAnchor="middle"
        className="text-lg font-medium fill-[#8AB4F8]"
        style={{
          fontSize: '18px',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        neo
      </text>
      
      {/* Animated accent dots */}
      {animated && (
        <>
          {/* Top left dot */}
          <circle
            cx="25"
            cy="35"
            r="3"
            fill="#5EE1A9"
            className="animate-ping"
            style={{ animationDelay: '0s', animationDuration: '2s' }}
          />
          
          {/* Top right dot */}
          <circle
            cx="95"
            cy="35"
            r="3"
            fill="#8AB4F8"
            className="animate-ping"
            style={{ animationDelay: '0.5s', animationDuration: '2s' }}
          />
          
          {/* Bottom left dot */}
          <circle
            cx="25"
            cy="85"
            r="3"
            fill="#8AB4F8"
            className="animate-ping"
            style={{ animationDelay: '1s', animationDuration: '2s' }}
          />
          
          {/* Bottom right dot */}
          <circle
            cx="95"
            cy="85"
            r="3"
            fill="#5EE1A9"
            className="animate-ping"
            style={{ animationDelay: '1.5s', animationDuration: '2s' }}
          />
        </>
      )}
      
      {/* Subtle glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Glowing center circle */}
      <circle
        cx="60"
        cy="60"
        r="8"
        fill="rgba(94, 225, 169, 0.2)"
        filter="url(#glow)"
        className={animated ? "animate-pulse" : ""}
        style={{ animationDuration: '3s' }}
      />
    </svg>
  );
}

// Alternative minimalist logo
export function LogoMinimal({ size = 32, className = "", animated = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main text with shimmer effect */}
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5EE1A9">
            {animated && <animate attributeName="stop-color" values="#5EE1A9;#8AB4F8;#5EE1A9" dur="3s" repeatCount="indefinite" />}
          </stop>
          <stop offset="50%" stopColor="#8AB4F8">
            {animated && <animate attributeName="stop-color" values="#8AB4F8;#5EE1A9;#8AB4F8" dur="3s" repeatCount="indefinite" />}
          </stop>
          <stop offset="100%" stopColor="#5EE1A9">
            {animated && <animate attributeName="stop-color" values="#5EE1A9;#8AB4F8;#5EE1A9" dur="3s" repeatCount="indefinite" />}
          </stop>
        </linearGradient>
      </defs>
      
      {/* Main text */}
      <text
        x="60"
        y="28"
        textAnchor="middle"
        className="text-xl font-bold"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        fill="url(#shimmer)"
      >
        neoneo
      </text>
      
      {/* Animated accent line */}
      {animated && (
        <line
          x1="15"
          y1="35"
          x2="105"
          y2="35"
          stroke="#8AB4F8"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDuration: '2s' }}
        />
      )}
    </svg>
  );
}

// Icon version for small spaces
export function LogoIcon({ size = 24, className = "", animated = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="rgba(255, 255, 255, 0.05)"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth="1"
      />
      
      {/* "n" letter */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        className="text-sm font-bold fill-[#5EE1A9]"
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        n
      </text>
      
      {/* Animated accent dot */}
      {animated && (
        <circle
          cx="20"
          cy="12"
          r="2"
          fill="#8AB4F8"
          className="animate-ping"
          style={{ animationDuration: '2s' }}
        />
      )}
    </svg>
  );
}
