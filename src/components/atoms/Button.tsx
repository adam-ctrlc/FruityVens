import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ThemedText from './ThemedText';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-green-600 active:bg-green-700',
  secondary: 'bg-green-100 active:bg-green-200',
  outline: 'border border-green-600 bg-transparent active:bg-green-50',
  ghost: 'bg-transparent active:bg-green-50',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 rounded-lg',
  md: 'px-4 py-2.5 rounded-xl',
  lg: 'px-6 py-3.5 rounded-xl',
};

const textVariantMap: Record<string, 'inverse' | 'primary'> = {
  primary: 'inverse',
  secondary: 'primary',
  outline: 'primary',
  ghost: 'primary',
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''}`}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#fff' : '#16a34a'}
          style={{ marginRight: 8 }}
        />
      )}
      <ThemedText
        variant={textVariantMap[variant]}
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'base'}
        weight="semibold"
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
