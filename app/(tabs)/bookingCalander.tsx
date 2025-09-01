import {View, Text, TouchableOpacity, FlatList} from "react-native";
import {CalendarList} from "react-native-calendars";
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import dayjs from "dayjs";
import {useColorScheme} from "nativewind";
import {SafeAreaView} from "react-native-safe-area-context";
import {ArrowLeftCircle} from "lucide-react-native";
import {useRouter} from "expo-router";
import {bookingPeriodsQuery} from "@/lib/queries";
import {client} from "@/client";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";

const TUNISIA_LOCATIONS = ["Tunis", "Sfax", "Sousse", "Bizerte", "Kairouan", "Gabès"];

export default function BookingCalendar() {
    const [selected, setSelected] = useState("");
    const {colorScheme} = useColorScheme();
    const [periods, setPeriods] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
    const router = useRouter();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const handleOpenSheet = useCallback(() => bottomSheetRef.current?.expand(), []);

    // Fetch booking periods
    useEffect(() => {
        (async () => {
            const data = await client.fetch(bookingPeriodsQuery);
            setPeriods(data);
        })();
    }, []);

    // Build marked dates with schema colors
    useEffect(() => {
        const marks: Record<string, any> = {};

        periods.forEach((period) => {
            period.slots.forEach((slot: any) => {
                const dateStr = dayjs(slot.date).format("YYYY-MM-DD");
                const color = TUNISIA_LOCATIONS.includes(slot.place)
                    ? period.colorTunisia
                    : period.colorSweden;

                // Only overwrite if not already set or Tunisia has priority
                if (!marks[dateStr] || (!TUNISIA_LOCATIONS.includes(slot.place) && marks[dateStr].color !== period.colorTunisia)) {
                    marks[dateStr] = {
                        color,
                        textColor: "#000",
                    };
                }
            });
        });

        if (selected) {
            marks[selected] = {
                selected: true,
                color: "#ffcd00",
                textColor: "#000",
            };
        }

        setMarkedDates(marks);
    }, [periods, selected]);

    // Get slots for selected date
    const selectedSlots = periods.flatMap((p) =>
        p.slots.filter((slot: any) =>
            dayjs(slot.date).format("YYYY-MM-DD") === selected
        )
    );

    return (
        <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
            <View className="flex-1 pt-6 pb-44">
                {/* Back button */}
                <View className="flex flex-row justify-between px-5">
                    <ArrowLeftCircle
                        size={25}
                        color={colorScheme === "dark" ? "white" : "#4b5563"}
                        onPress={() => router.back()}
                    />
                </View>

                {/* Title */}
                <View className="flex-row items-center justify-center">
                    <Text className="text-gray-800 dark:text-white text-2xl font-extrabold mb-5">
                        Available Booking Slots
                    </Text>
                </View>

                {/* Calendar */}
                <CalendarList
                    onDayPress={(day) => {
                        if (markedDates[day.dateString]) {
                            setSelected(day.dateString);
                            handleOpenSheet();
                        }
                    }}


                    markedDates={markedDates}
                    markingType="period"
                    pastScrollRange={0}
                    futureScrollRange={12}
                    scrollEnabled
                    showScrollIndicator
                    minDate={dayjs().format("YYYY-MM-DD")}
                    maxDate={dayjs().add(12, "month").endOf("month").format("YYYY-MM-DD")}
                    theme={{
                        backgroundColor: colorScheme === "dark" ? "#1F2937" : "#ffffff",
                        calendarBackground: colorScheme === "dark" ? "#1F2937" : "#ffffff",
                        textSectionTitleColor: colorScheme === "dark" ? "#D1D5DB" : "#6B7280",
                        selectedDayBackgroundColor: "#ffcd00",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#f6b157",
                        dayTextColor: colorScheme === "dark" ? "#F9FAFB" : "#111827",
                        textDisabledColor: colorScheme === "dark" ? "#6B7280" : "#D1D5DB",
                        dotColor: "#f6b157",
                        selectedDotColor: "#ffffff",
                        arrowColor: "#f6b157",
                        monthTextColor: colorScheme === "dark" ? "#F3F4F6" : "#111827",
                        textDayFontWeight: "500",
                        textMonthFontWeight: "600",
                        textDayHeaderFontWeight: "500",

                    }}
                />

                {/* Bottom Sheet */}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backgroundStyle={{
                        backgroundColor: colorScheme === "dark" ? "#18181f" : "#f3f3f3",
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        paddingTop: 12,
                    }}
                >
                    <BottomSheetView className="flex-1 px-4">
                        {selectedSlots.length > 0 ? (
                            <>
                                <Text
                                    className="text-lg font-semibold mb-4 text-center"
                                    style={{ color: colorScheme === "dark" ? "#D1D5DB" : "#6B7280" }}
                                >
                                    Selected Date: {selected}
                                </Text>

                                <FlatList
                                    data={selectedSlots}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ paddingBottom: 24 }}
                                    renderItem={({ item }) => {
                                        const slotColor = TUNISIA_LOCATIONS.includes(item.place)
                                            ? periods.find(p => p.slots.includes(item))?.colorTunisia
                                            : periods.find(p => p.slots.includes(item))?.colorSweden;

                                        return (
                                            <View
                                                className="mb-4 rounded-2xl p-4 mt-20 gap-y-3"

                                            >
                                                <View className="flex-row justify-between mb-2">
                                                    <Text
                                                        className="font-medium"
                                                        style={{ color: colorScheme === "dark" ? "#F3F4F6" : "#111827" }}
                                                    >
                                                        Location:
                                                    </Text>
                                                    <Text
                                                        className="font-semibold"
                                                        style={{ color: colorScheme === "dark" ? "#F3F4F6" : "#111827" }}
                                                    >
                                                        {item.place}
                                                    </Text>
                                                </View>

                                                <View className="flex-row justify-between mb-4">
                                                    <Text
                                                        className="font-medium"
                                                        style={{ color: colorScheme === "dark" ? "#D1D5DB" : "#4B5563" }}
                                                    >
                                                        Time:
                                                    </Text>
                                                    <Text
                                                        className="font-semibold"
                                                        style={{ color: colorScheme === "dark" ? "#F3F4F6" : "#111827" }}
                                                    >
                                                        {item.startTime} - {item.endTime}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    className="w-full py-3 rounded-2xl mt-16"
                                                    style={{ backgroundColor: "#f6b157" }}
                                                    onPress={() =>
                                                        router.push({
                                                            pathname: "/(confirmBooking)/[id]",
                                                            params: {
                                                                id: selected,
                                                                date: selected,
                                                                place: item.place,
                                                                startTime: item.startTime,
                                                                endTime: item.endTime,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <Text className="text-center text-black font-bold text-lg">
                                                        Confirm Booking
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }}
                                />
                            </>
                        ) : (
                            <Text className="text-gray-500 text-center mt-8">Select a booking slot</Text>
                        )}
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </SafeAreaView>
    );
}