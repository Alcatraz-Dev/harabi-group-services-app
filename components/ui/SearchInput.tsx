// components/ui/SearchInput.tsx
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";

type Props = {
    searchQuery: string;
    setSearchQuery: (text: string) => void;
    onSearch: () => void;
    onFilterPress: () => void; // دالة تضغط زر الفلتر
};


const SearchInput = ({ searchQuery, setSearchQuery, onSearch, onFilterPress }: Props) => {
    return (
        <View className={'flex-row items-center justify-between mt-5'}>
            <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-4 py-2 mb-6 flex-1">
                <MagnifyingGlassIcon size={20} color="#6b7280" />
                <TextInput
                    placeholder="Sök efter tjänst..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 ml-2 text-base text-gray-800 dark:text-gray-100"
                />
                <TouchableOpacity onPress={onSearch} className=" ml-2  px-3 py-2 rounded-full bg-[#2492ff] ">
                    <Text className="text-white font-semibold text-sm">Sök</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onFilterPress} className="ml-2 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6">
                <FunnelIcon size={20} color="#6b7280" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;