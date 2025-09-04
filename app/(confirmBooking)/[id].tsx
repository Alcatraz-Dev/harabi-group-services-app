import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from "react-native";
import { CalendarList } from "react-native-calendars";
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useColorScheme } from "nativewind";
import { ArrowLeftCircle, Clock, MapPin, ClipboardList } from "lucide-react-native";
import { useRouter } from "expo-router";
import { bookingPeriodsQuery } from "@/lib/queries";
import { client } from "@/client";
import { Picker } from "@react-native-picker/picker";

const TUNISIA_LOCATIONS = ["Tunis", "Sfax", "Sousse", "Bizerte", "Kairouan", "Gabès"];
const SERVICE_TYPES = ["Cleaning", "Transport", "Delivery", "Other"];

export default function BookingCalendar() {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [serviceDetails, setServiceDetails] = useState("");
    const [periods, setPeriods] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const isDarkMode = colorScheme === "dark";

    // Fetch booking periods
    useEffect(() => {
        (async () => {
            const data = await client.fetch(bookingPeriodsQuery);
            setPeriods(data);
        })();
    }, []);

    // Mark calendar dates
    useEffect(() => {
        const marks: Record<string, any> = {};
        periods.forEach((period) => {
            period.slots.forEach((slot: any) => {
                const dateStr = dayjs(slot.date).format("YYYY-MM-DD");
                marks[dateStr] = {
                    marked: true,
                    dotColor: TUNISIA_LOCATIONS.includes(slot.place) ? period.colorTunisia : period.colorSweden,
                    activeOpacity: 0
                };
            });
        });
        if (selectedDate) {
            marks[selectedDate] = {
                selected: true,
                selectedColor: "#f6b157",
                selectedTextColor: "#000000"
            };
        }
        setMarkedDates(marks);
    }, [periods, selectedDate]);

    // Slots for selected date
    const selectedSlots = useMemo(
        () =>
            periods.flatMap((p) =>
                p.slots.filter((slot: any) => dayjs(slot.date).format("YYYY-MM-DD") === selectedDate)
            ),
        [periods, selectedDate]
    );

    return (
        <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
            <View className="flex-1 pt-6 px-4 pb-6">
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <ArrowLeftCircle
                        size={28}
                        color={isDarkMode ? "white" : "#4b5563"}
                        onPress={() => router.back()}
                    />
                    <Text className="text-gray-800 dark:text-white text-2xl font-extrabold ml-4">
                        Book a Service
                    </Text>
                </View>

                {/* Service Type Picker */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <ClipboardList size={18} color={isDarkMode ? "#d1d5db" : "#4b5563"} />
                        <Text className="text-gray-700 dark:text-gray-300 ml-2 font-medium">Service Type</Text>
                    </View>
                    <View className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                        <Picker
                            selectedValue={serviceType}
                            onValueChange={(value) => setServiceType(value)}
                            dropdownIconColor={isDarkMode ? "white" : "#4b5563"}
                        >
                            <Picker.Item label="Select service type" value="" />
                            {SERVICE_TYPES.map((type, idx) => (
                                <Picker.Item key={idx} label={type} value={type} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Service Details Input */}
                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Service Details</Text>
                    <TextInput
                        placeholder="Describe what you need..."
                        placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                        value={serviceDetails}
                        onChangeText={setServiceDetails}
                        className="bg-white dark:bg-neutral-800 rounded-lg p-4 text-gray-800 dark:text-white border border-gray-200 dark:border-neutral-700"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Location Picker */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <MapPin size={18} color={isDarkMode ? "#d1d5db" : "#4b5563"} />
                        <Text className="text-gray-700 dark:text-gray-300 ml-2 font-medium">Location</Text>
                    </View>
                    <View className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                        <Picker
                            selectedValue={selectedLocation}
                            onValueChange={(value) => setSelectedLocation(value)}
                            dropdownIconColor={isDarkMode ? "white" : "#4b5563"}
                        >
                            <Picker.Item label="Select location" value="" />
                            {TUNISIA_LOCATIONS.map((loc, idx) => (
                                <Picker.Item key={idx} label={loc} value={loc} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Calendar */}
                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Select Date</Text>
                    <CalendarList
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={markedDates}
                        markingType="custom"
                        pastScrollRange={0}
                        futureScrollRange={12}
                        minDate={dayjs().format("YYYY-MM-DD")}
                        maxDate={dayjs().add(12, "month").endOf("month").format("YYYY-MM-DD")}
                        theme={{
                            backgroundColor: isDarkMode ? '#262626' : '#ffffff',
                            calendarBackground: isDarkMode ? '#262626' : '#ffffff',
                            textSectionTitleColor: isDarkMode ? 'white' : '#4b5563',
                            selectedDayBackgroundColor: '#f6b157',
                            selectedDayTextColor: '#000000',
                            todayTextColor: '#f6b157',
                            dayTextColor: isDarkMode ? 'white' : '#1f2937',
                            textDisabledColor: '#9ca3af',
                            monthTextColor: isDarkMode ? 'white' : '#1f2937',
                            arrowColor: isDarkMode ? 'white' : '#4b5563',
                            indicatorColor: isDarkMode ? 'white' : '#4b5563',
                        }}
                    />
                </View>

                {/* Time Slot Picker */}
                {selectedDate && (
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Clock size={18} color={isDarkMode ? "#d1d5db" : "#4b5563"} />
                            <Text className="text-gray-700 dark:text-gray-300 ml-2 font-medium">Time Slot</Text>
                        </View>
                        {selectedSlots.length > 0 ? (
                            <View className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                                <Picker
                                    selectedValue={selectedSlot}
                                    onValueChange={(itemValue) => setSelectedSlot(itemValue)}
                                    dropdownIconColor={isDarkMode ? "white" : "#4b5563"}
                                >
                                    <Picker.Item label="Select time slot" value={null} />
                                    {selectedSlots.map((slot, idx) => (
                                        <Picker.Item
                                            key={idx}
                                            label={`${slot.startTime} - ${slot.endTime}`}
                                            value={slot}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        ) : (
                            <View className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg">
                                <Text className="text-amber-800 dark:text-amber-200 text-center">
                                    No slots available for {dayjs(selectedDate).format('MMMM D, YYYY')}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Confirm Button */}
                {selectedSlot && selectedLocation && serviceType && serviceDetails && (
                    <TouchableOpacity
                        className="py-4 rounded-xl mt-2 shadow-md"
                        style={{ backgroundColor: "#f6b157" }}
                        onPress={() =>
                            router.push({
                                pathname: "/(confirmBooking)/[id]",
                                params: {
                                    id: selectedDate,
                                    date: selectedDate,
                                    place: selectedLocation,
                                    startTime: selectedSlot.startTime,
                                    endTime: selectedSlot.endTime,
                                    serviceType,
                                    serviceDetails,
                                },
                            })
                        }
                    >
                        <Text className="text-center text-black font-bold text-lg">Confirm Booking</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}