// components/LanguageSelector.tsx
import { Picker } from '@react-native-picker/picker';
import { View, Text } from 'react-native';
import {useAppTheme} from "@/hooks/useTheme";

export default function LanguageSelector({
                                             selected,
                                             onSelect,
                                             languages,
                                         }: {
    selected: string;
    onSelect: (code: string) => void;
    languages: { code: string; label: string , icon: string }[];
}) {
    const { theme: colorScheme } = useAppTheme();
    return (
        <View className="mb-4">


            <View className=" overflow-hidden shadow-sm">
                <Picker
                    selectedValue={selected}
                    onValueChange={onSelect}
                    dropdownIconColor="#4B5563"
                    mode="dropdown"
                    style={{ color: colorScheme === 'dark' ? 'white' : 'black' }} // iOS
                    itemStyle={{ color: colorScheme === 'dark' ? 'white' : 'black' }}
                >
                    {languages.map((lang) => (
                        <Picker.Item
                            key={lang.code}
                            label={`${lang.icon ?? ''} ${lang.label}`}
                            value={lang.code}
                            color={colorScheme === 'dark' ? 'white' : 'black'}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}