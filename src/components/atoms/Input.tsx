import React, { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  error?: boolean;
  className?: string;
}

export default function Input({ error, className, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`bg-white rounded-xl px-4 py-3 text-gray-900 text-base border ${error ? 'border-red-400' : focused ? 'border-green-500' : 'border-gray-200'} ${className ?? ''}`}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}
