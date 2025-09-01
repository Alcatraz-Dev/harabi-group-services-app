import {
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '@/hooks/useTheme';

type Category = {
    id: string;
    label: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    selectedFilter: string;
    setSelectedFilter: (cat: string) => void;
    applyFilters: () => void;
    categories?: Category[];
};

const FilterDropdown = ({
                            visible,
                            onClose,
                            selectedFilter,
                            setSelectedFilter,
                            applyFilters,
                            categories = [
                                { id: 'all', label: 'Alla' }, // فلتر الكل يبقى ثابت

                                // بناء الفلاتر حسب الفئات الحقيقية
                                { id: 'husflytt', label: 'Husflytt' },
                                { id: 'husflytt-stadning', label: 'Husflytt & Städning' },
                                { id: 'transport-inom-sverige', label: 'Transport inom Sverige' },
                                { id: 'frakt-till-fran-tunisien', label: 'Frakt till & från Tunisien' },
                                { id: 'flygplatstransfer', label: 'Flygplatstransfer' }
                            ],
                        }: Props) => {
    const { theme: colorScheme } = useAppTheme();

    if (!visible) return null;

    const containerBg =
        colorScheme === 'dark'
            ? 'bg-neutral-800 '
            : 'bg-white ';
    const selectedBg = 'bg-blue-600/90';
    const unselectedBg =
        colorScheme === 'dark' ? 'bg-white/10' : 'bg-gray-100/80';
    const selectedTextColor = 'text-white';
    const unselectedTextColor =
        colorScheme === 'dark' ? 'text-white/80' : 'text-gray-800';
    const titleTextColor = colorScheme === 'dark' ? 'text-white' : 'text-black';

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            className="absolute right-5 top-[200px] w-[240px] z-50 flex-1"
        >
            <Animated.View
                entering={FadeInDown.springify(400)}
                className={`${containerBg} rounded-2xl p-4 shadow-xl border border-black/10 dark:border-white/10`}
                style={{
                    shadowColor: colorScheme === 'dark' ? '#000' : '#aaa',
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                }}
            >
                {/* Close icon */}
                <View className="flex-row justify-end mb-1">
                    <TouchableOpacity onPress={onClose} hitSlop={10}>
                        <MaterialIcons
                            name="close"
                            size={18}
                            color={colorScheme === 'dark' ? 'white' : 'black'}
                        />
                    </TouchableOpacity>
                </View>

                <Animated.Text
                    className={`text-lg font-extrabold mb-3 text-center uppercase ${titleTextColor}`}
                >
                    Välj kategori
                </Animated.Text>

                <View className="gap-2">
                    {categories.map((cat) => {
                        const isSelected = selectedFilter === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedFilter(cat.id)}
                                activeOpacity={0.9}
                                className={`py-3 px-4 rounded-xl flex-row items-center justify-between ${
                                    isSelected ? selectedBg : unselectedBg
                                }`}
                            >
                                <Animated.Text
                                    className={`text-base font-semibold ${
                                        isSelected ? selectedTextColor : unselectedTextColor
                                    }`}
                                >
                                    {cat.label}
                                </Animated.Text>
                                {isSelected && (
                                    <MaterialIcons name="check" size={18} color="white" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    onPress={applyFilters}
                    activeOpacity={0.85}
                    className="mt-4 bg-blue-600 py-3 rounded-xl shadow-md shadow-blue-600"
                >
                    <Animated.Text className="text-white font-semibold text-base text-center">
                        Bekräfta
                    </Animated.Text>
                </TouchableOpacity>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default FilterDropdown;