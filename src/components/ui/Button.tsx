"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
}

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'bg-transparent text-text-primary px-4 py-2 rounded-lg font-medium transition-all duration-120 hover:bg-white/5 focus-ring',
  danger: 'bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-120 hover:bg-red-700 hover:-translate-y-0.5 focus-ring',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className,
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = variants[variant];
  const sizeClasses = variant === 'ghost' ? sizes[size] : '';
  
  return (
    <motion.button
      className={clsx(
        baseClasses,
        sizeClasses,
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        'relative overflow-hidden',
        className
      )}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      <span className={clsx('flex items-center justify-center gap-2', loading && 'opacity-0')}>
        {icon && iconPosition === 'left' && children && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && children && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {!children && icon && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.button>
  );
}