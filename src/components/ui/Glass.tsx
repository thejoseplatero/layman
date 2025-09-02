"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'header' | 'sidebar' | 'composer';
  hover?: boolean;
  blur?: boolean;
  className?: string;
}

const variants = {
  default: 'glass-panel',
  subtle: 'glass-panel-subtle',
  header: 'bg-glass-surface/80 backdrop-blur-glass border-b border-glass-divider',
  sidebar: 'bg-glass-surface/70 backdrop-blur-glass border-r border-glass-border',
  composer: 'bg-glass-surface/60 backdrop-blur-glass border border-glass-border rounded-2xl shadow-glass',
};

export function Glass({ 
  children, 
  variant = 'default', 
  hover = false,
  blur = true,
  className,
  ...props 
}: GlassProps) {
  const baseClasses = variants[variant];
  
  return (
    <motion.div
      className={clsx(
        baseClasses,
        hover && 'hover-lift cursor-pointer',
        !blur && 'backdrop-blur-none',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Specialized glass components
export function GlassHeader({ children, className, ...props }: Omit<GlassProps, 'variant'>) {
  return (
    <Glass 
      variant="header" 
      className={clsx('sticky top-0 z-10', className)}
      {...props}
    >
      {children}
    </Glass>
  );
}

export function GlassSidebar({ children, className, ...props }: Omit<GlassProps, 'variant'>) {
  return (
    <Glass 
      variant="sidebar" 
      className={clsx('h-full', className)}
      {...props}
    >
      {children}
    </Glass>
  );
}

export function GlassComposer({ children, className, ...props }: Omit<GlassProps, 'variant'>) {
  return (
    <Glass 
      variant="composer" 
      className={clsx('p-4', className)}
      {...props}
    >
      {children}
    </Glass>
  );
}

// Message bubble components
export function AssistantMessage({ children, className, ...props }: Omit<HTMLMotionProps<"div">, 'children'> & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={clsx('message-assistant', className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function UserMessage({ children, className, ...props }: Omit<HTMLMotionProps<"div">, 'children'> & { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={clsx('message-user', className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}