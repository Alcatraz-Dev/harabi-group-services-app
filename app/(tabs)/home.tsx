import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useUser} from '@clerk/clerk-expo';
import {SafeAreaView} from "react-native-safe-area-context";
import ServiceCard from "@/components/ServiceCard";
import {MapPin} from 'lucide-react-native';
import {useRouter} from "expo-router";
import SearchInput from "@/components/ui/SearchInput";
import NotificationButton from "@/components/ui/NotificationButton";
import AutoCarouselBanner from "@/components/AutoCarouselBanner";
import HorizontalCategoryList from "@/components/HorizontalCategoryList";
import RecommendedServices from "@/components/RecommendedServices";
import SpecialOffers from "@/components/SpecialOffers";
import CustomerReviews from "@/components/CustomerReviews";
import {useState} from "react";
import {recommendedServicesItems} from "@/constants/recommendedServicesItems";
import FilterDropdown from "@/components/FilterDropdown";
import {filters} from "@/constants/filters";
import Carousel3D from "@/components/Carousel3D";

export default function HomeScreen() {
    const {user, isLoaded} = useUser();
    const router = useRouter();
    const fullName = user?.unsafeMetadata?.fullName as string ?? "Användare";
    const avatar = user?.imageUrl;
    // @ts-ignore
    const city: string = user?.unsafeMetadata?.location ?? "Stockholm";
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [filteredItems, setFilteredItems] = useState(recommendedServicesItems);
    const [filterVisible, setFilterVisible] = useState(false);

    const applyFilters = () => {
        let filtered = recommendedServicesItems;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(item => item.category === selectedFilter);
        }


        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                item =>
                    item.title.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
            );
        }

        setFilteredItems(filtered);
        setFilterVisible(false); // إخفاء نافذة الفلترة بعد التطبيق
    };


    const onSearch = () => {
        if (searchQuery.trim() === '') {

            applyFilters();
        } else {
            applyFilters();
        }
    };

    const onFilterPress = () => {
        setFilterVisible(true);
    };
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900 px-4 pt-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                {/* Avatar and info */}
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="flex-row items-center">
                    {avatar && (
                        <Image
                            source={{uri: avatar}}
                            className="w-12 h-12 rounded-full mr-3  border-2 border-border-gray-800 dark:border-white"
                        />
                    )}
                    <View>
                        <Text className="text-lg text-gray-700 dark:text-gray-200 font-extrabold">
                            {fullName}
                        </Text>

                        <View className={'flex-row items-center gap-2 mt-2'}>

                            <MapPin className={'mr-1 mt-2'} size={16} color="#6b7280"/>

                            <Text
                                className="text-sm text-gray-500 dark:text-gray-400">

                                {city}
                            </Text>
                        </View>
                    </View>

                </TouchableOpacity>
                {/*/!*user points *!/*/}
                {/*<View className={'flex flex-row items-center ml-24 gap-3 '}>*/}


                {/*    <Text*/}
                {/*        className={'flex justify-end items-ends text-lg text-gray-700 dark:text-gray-200 font-extrabold'}*/}

                {/*    > {user?.unsafeMetadata?.points as number} </Text>*/}
                {/*    <Image source={require("@/assets/icons/coin.png")} resizeMode={'contain'} className={'w-6 h-6 z-50 '}/>*/}

                {/*</View>*/}
                {/* Notification Icon */}
                <NotificationButton/>
            </View>

            {/* Search Bar */}
            <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={onSearch}
                onFilterPress={onFilterPress}
            />
            {/* Filter Modal */}
            <FilterDropdown
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                applyFilters={applyFilters}
                categories={filters}
            />

            {/* Scrollable Services */}
            <ScrollView showsVerticalScrollIndicator={false} className={'mt-5 mb-20'}>
                {/*Banner */}
                <AutoCarouselBanner/>
                {/*3D carousel*/}
                <View className={'mt-20 '}>
                    <Carousel3D/>
                </View>

                {/*Categories*/}
                <HorizontalCategoryList/>
                {/*Recommended Services*/}
                {/*{filteredItems.map(service => (*/}
                {/*    <ServiceCard*/}
                {/*        key={service.id}*/}
                {/*        title={service.title}*/}
                {/*        image={service.image}*/}
                {/*        price={service.price}*/}
                {/*        rating={service.rating}*/}
                {/*    />*/}
                {/*))}*/}
                {/*Recommended*/}
                <RecommendedServices/>
                {/*Special Offers*/}
                {/*<SpecialOffers/>*/}
                {/*Customer Reviews*/}
                <CustomerReviews/>
                {/*/!*Featured Providers*!/*/}
                {/*<FeaturedProviders/>*/}
            </ScrollView>
        </SafeAreaView>
    );
}