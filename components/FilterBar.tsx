import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';

type Filter = {
    id: string;
    label: string;
};

type Props = {
    filters: Filter[];
    selectedFilter: string;
    onSelect: (filterId: string) => void;
};

export default function FilterBar({ filters, selectedFilter, onSelect }: Props) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {filters.map((filter) => (
                <TouchableOpacity
                    key={filter.id}
                    className={`mr-3 px-4 py-2 rounded-full border ${
                        selectedFilter === filter.id
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-gray-200 border-gray-300'
                    }`}
                    onPress={() => onSelect(filter.id)}
                >
                    <Text
                        className={`text-sm font-semibold ${
                            selectedFilter === filter.id ? 'text-white' : 'text-gray-700'
                        }`}
                    >
                        {filter.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}