import {View, Text, ScrollView, Switch, Image, TouchableOpacity, Button, Alert} from 'react-native';
import {useRouter} from 'expo-router';
import {
    Edit,
    Lock,
    Calendar,
    MapPin,
    Moon,
    ShieldCheck,
    FileText,
    Check,
    ArrowLeftCircle,
    Trash,
    Handshake,
    Clipboard,
    ClipboardCheck
} from 'lucide-react-native';
import {SignOutButton} from '@/components/ui/SignOutButton';
import React, {JSX, useEffect, useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {useUser} from "@clerk/clerk-expo";
import {useAppTheme} from "@/hooks/useTheme";
import {clearAllStorage} from "@/utils/clearStorage";
import * as ClipboardExpo from "expo-clipboard";


export default function ProfileScreen() {

    const {theme: colorScheme, setTheme} = useAppTheme();
    const router = useRouter();
    const {user} = useUser();
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [referralCode, setReferralCode] = useState('');
    const [copied, setCopied] = useState(false);
    const textColor = colorScheme === 'dark' ? '#e5e7eb' : '#374151';
    const labelColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
    const iconColor = colorScheme === 'dark' ? 'white' : '#4b5563';

    useEffect(() => {
        if (user) {
            setFullName((user?.unsafeMetadata?.fullName as string) || '');
            setFirstName(user?.unsafeMetadata?.firstName as string || '');
            setLastName(user?.unsafeMetadata?.lastName as string || '');
            setEmail((user?.unsafeMetadata?.email as string) || '');
            setUserName((user?.unsafeMetadata?.userName as string) || '');
            setReferralCode((user?.unsafeMetadata?.referralCode as string) || '');
            setTheme((user?.unsafeMetadata?.theme as 'light' | 'dark' | 'system') || 'system');
            setImage(user?.imageUrl || 'https://i.pravatar.cc/150?img=3');
        }
    }, [user]);


    const copyToClipboard = async () => {
        if (!referralCode) return;
        await ClipboardExpo.setStringAsync(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // الرجوع بعد 1.5 ثانية
    };


    const toggleTheme = () => {
        setTheme(colorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <SafeAreaView className={'flex-1 bg-white dark:bg-neutral-900  '}>
            <View className=" flex flex-row justify-between px-5">
                <ArrowLeftCircle size={25} color={colorScheme === 'dark' ? 'white' : '#4b5563'}
                                 onPress={() => router.back()}/>
            </View>
            <View className="flex-row items-center justify-center ">
                <Text className="text-gray-800 dark:text-white text-2xl font-extrabold">Profile</Text>
            </View>


            <ScrollView className="flex-1 bg-white dark:bg-neutral-900 px-6  ">


                {/* Profile Section */}
                <View className="items-center mt-10 ">
                    <View className="relative">
                        <Image
                            source={{uri: image || 'https://i.pravatar.cc/150?img=3'}}
                            className="w-32 h-32 rounded-full border-4 border-border-gray-800 dark:border-white"
                        />
                        <View
                            className="absolute -bottom-2 -right-0 bg-green-500 p-3 rounded-full border-2 border-white dark:border-gray-800"

                        >
                            <Check size={10} color="white" className={'font-bold'}/>
                        </View>

                    </View>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                        {fullName || firstName || lastName || userName || 'Guest User'}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 mt-1">
                        {email}
                    </Text>
                    {/*user points */}
                    <Text
                        className={'flex justify-end items-ends text-xl text-gray-700 dark:text-gray-200 font-extrabold  mt-3'}

                    > Din poang</Text>
                    <View className={'flex flex-row items-center gap-3 mt-2 '}>


                        <Text
                            className={'flex justify-end items-ends text-xl text-gray-700 dark:text-gray-200 font-extrabold'}

                        > {user?.unsafeMetadata?.points as number} </Text>
                        {/*<Image source={require("@/assets/icons/coin.png")} resizeMode={'contain'} className={'w-6 h-6 z-50 '}/>*/}

                    </View>

                </View>

                {/* Settings List */}
                <View className="space-y-5 my-8  ">
                    <SettingsItem
                        icon={<Edit size={22} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>}
                        label="Edit Profile"
                        onPress={() => {
                            router.push('/(completeProfile)/edit-profile');
                        }}
                    />
                    {/* Dark Mode Toggle */}
                    <View
                        className="flex-row justify-between items-center px-5 py-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 ">
                        <View className="flex-row items-center space-x-4 gap-4">
                            <Moon size={22} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>
                            <Text className="text-gray-800 dark:text-white text-base font-medium">Dark Mode</Text>
                        </View>
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{false: '#e5e7eb', true: '#31d71f'}}
                            thumbColor={colorScheme === 'dark' ? '#ffffff' : '#f9fafb'}
                        />
                    </View>
                    {/*Referal Code*/}
                    <TouchableOpacity onPress={copyToClipboard}>
                        <View
                            className="mt-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-5 py-4 flex-row items-center relative flex-wrap">

                            {/* Floating Label with spacing */}
                            <Text className="absolute top-1  left-4 text-xs text-gray-500 dark:text-gray-400 mb-6 mt-1.5">
                                Referral Code
                            </Text>

                            {/* Add paddingTop to push content down if needed */}
                            <View className="pt-4 flex-row items-center flex-1">
                                {/* Icon */}
                                <Handshake size={22} color={iconColor}/>

                                {/* Referral Code Text */}
                                <Text className="ml-4 flex-1 text-base" style={{color: textColor}}>
                                    {referralCode ?? 'No referral code available'}
                                </Text>

                                {/* Copy Icon */}
                                {copied ? (
                                    <ClipboardCheck size={22} color={iconColor}/>
                                ) : (
                                    <Clipboard size={22} color={iconColor}/>
                                )}
                            </View>
                        </View>

                        {/* Feedback Message */}
                        {copied && (
                            <Text className="text-center my-5 text-xs text-green-500 dark:text-green-400">
                                ✅ Kopierat till urklipp
                            </Text>
                        )}
                    </TouchableOpacity>

                    <SettingsItem
                        icon={<Calendar size={22} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>}
                        label="My Bookings"
                        onPress={() => {
                            router.push('/(tabs)/booking')
                        }}
                    />

                    <SettingsItem
                        icon={<ShieldCheck size={22} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>}
                        label="Privacy Policy"
                        onPress={() => router.push('/(privacy-terms)/privacy')}
                    />
                    <SettingsItem
                        icon={<FileText size={22} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>}
                        label="Terms & Conditions"
                        onPress={() => router.push('/(privacy-terms)/terms')}
                    />
                    {/*clear storage*/}
                    <SettingsItem
                        icon={<Trash size={22} color={colorScheme === 'dark' ? 'white' : '#4b5563'}/>}
                        label="Clear Storage"
                        onPress={() => clearAllStorage()}
                    />
                    {/* Logout Button */}
                    <View
                        className={'flex flex-row items-center justify-start p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800  mb-20'}>
                        <SignOutButton/>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

type SettingsItemProps = {
    icon: JSX.Element;
    label: string;
    onPress: () => void;
};

function SettingsItem({icon, label, onPress}: SettingsItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 my-2 "
        >
            <View className="flex-row items-center space-x-4 gap-4">
                {icon}
                <Text className="text-gray-800 dark:text-white text-base font-medium">{label}</Text>
            </View>
        </TouchableOpacity>
    );
}