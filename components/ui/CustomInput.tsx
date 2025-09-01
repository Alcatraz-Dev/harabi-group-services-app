import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useTheme';

const CustomInput = ({
                         label,
                         iconName,
                         Value,
                         OnChangeText,
                         placeholder = '',
                     }: {
    label: string;
    iconName: any;
    Value: string;
    OnChangeText: (text: string) => void;
    placeholder?: string;
}) => {
    const { theme: colorScheme } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = Value && Value.length > 0;
    const showLabelAbove = isFocused || hasValue;

    return (
        <View className="mb-6">
            <View className="relative bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 pt-5 pb-4">
                {/* Floating Label */}
                {showLabelAbove && (
                    <Text className="absolute top-1 left-4 text-xs text-gray-500 dark:text-gray-400 pb-4  mb-6 mt-1.5">
                        {label}
                    </Text>
                )}

                <View className="flex-row items-center mt-2">
                    <MaterialCommunityIcons
                        name={iconName}
                        size={22}
                        color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    />
                    <TextInput
                        value={Value}
                        onChangeText={OnChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={showLabelAbove ? '' : label}
                        className="ml-3 flex-1 text-base text-gray-800 dark:text-white mb-1.5"
                        placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    />

                </View>
            </View>
        </View>
    );
};

export default CustomInput;