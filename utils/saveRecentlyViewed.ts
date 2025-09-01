import AsyncStorage from '@react-native-async-storage/async-storage';

const saveRecentlyViewed = async (service:any) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@recent_services');
        let recentServices = jsonValue != null ? JSON.parse(jsonValue) : [];
       //@ts-ignore
        recentServices = [service, ...recentServices.filter(s => s.id !== service.id)];

        recentServices = recentServices.slice(0, 5);
        await AsyncStorage.setItem('@recent_services', JSON.stringify(recentServices));
    } catch (e) {
        console.error('Error saving recent services', e);
    }
};