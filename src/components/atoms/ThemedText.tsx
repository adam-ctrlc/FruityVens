import React from 'react';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'primary' | 'muted' | 'inverse' | 'danger';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'text-gray-900',
  primary: 'text-green-600',
  muted: 'text-gray-500',
  inverse: 'text-white',
  danger: 'text-red-500',
};

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export default function ThemedText({
  variant = 'default',
  size = 'base',
  weight = 'normal',
  children,
  className,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${weightClasses[weight]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </Text>
  );
}
