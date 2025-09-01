import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const clearAllStorage = () => {
    Alert.alert(
        'Är du säker ?',
        'All lagrad data kommer att raderas. Denna åtgärd kan inte ångras.',
        [
            {
                text: 'Avbryt',
                style: 'cancel',
            },
            {
                text: 'Ja, radera',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await AsyncStorage.clear();
                        Alert.alert(' All data har raderats.');
                        // console.log('✅ AsyncStorage har rensats.');
                    } catch (e) {
                        // console.error('❌ Kunde inte rensa AsyncStorage:', e);
                        Alert.alert('Fel !', ' Ett fel uppstod vid rensning av data.');
                    }
                },
            },
        ],
        { cancelable: true }
    );
};