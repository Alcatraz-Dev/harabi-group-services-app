import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Text, TouchableOpacity, View } from 'react-native';
import {LogOut, LogOutIcon} from 'lucide-react-native';


export const SignOutButton = () => {
    const { signOut } = useClerk();
    const handleSignOut = async () => {
        try {
            await signOut();
            Linking.openURL(Linking.createURL('/(auth)/sign-in'));
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center  px-4 py-3 rounded-xl self-center  gap-4"
        >
            <LogOutIcon size={22} color='red' className="mr-4" />
            <Text className="text-gray-800 dark:text-white text-base font-medium">Logga ut</Text>
        </TouchableOpacity>
    );
};