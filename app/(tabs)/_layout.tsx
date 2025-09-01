import {Tabs} from "expo-router";
import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useColorScheme} from "nativewind";
import {BlurView} from "expo-blur";
import {Home, LayoutGrid, Calendar, User, MessageSquareText , CalendarClock} from "lucide-react-native";

const ICONS = {
    home: Home,
    switcher: LayoutGrid,
    calendar: Calendar,
    calendarClock: CalendarClock,
    chat:MessageSquareText,
    user: User,
};

const TabIcon = ({
                     iconName,
                     focused,
                     colorScheme,
                 }: {
    iconName: "home" | "switcher" | "calendar" | 'chat' | "user" | "calendarClock";
    focused: boolean;
    colorScheme: "light" | "dark";
}) => {
    const IconComponent = ICONS[iconName];
    const unfocusedColor = colorScheme === "dark" ? "#E5E7EB" : "#374151";
    const focusedBgColor = "#2492ff";

    return (
        <View className="flex-1 items-center justify-center">
            <View
                className={`w-12 h-12 rounded-full items-center justify-center mt-10 ${
                    focused ? "bg-[#2492ff]" : ""
                }`}
                style={{backgroundColor: focused ? focusedBgColor : "transparent"}}
            >
                <IconComponent
                    size={24}
                    color={focused ? "white" : unfocusedColor}
                />
            </View>
        </View>
    );
};

export default function TabLayout() {
    const {colorScheme} = useColorScheme();
    const insets = useSafeAreaInsets();
    const bottomSafeAreaSpace = insets.bottom > 0 ? insets.bottom : 20;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    left: 20,
                    right: 20,
                    bottom: bottomSafeAreaSpace,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor:
                        colorScheme === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(20, 20, 20, 0.1)",
                    borderTopWidth: 0,
                    overflow: "hidden",
                    marginHorizontal: 20,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint={colorScheme === "dark" ? "dark" : "light"}
                        intensity={30}
                        style={{
                            flex: 1,
                            borderRadius: 36,
                            backgroundColor: "transparent",
                        }}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon
                            iconName="home"
                            focused={focused}
                            colorScheme={colorScheme === "dark" ? "dark" : "light"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon
                            iconName="switcher"
                            focused={focused}
                            colorScheme={colorScheme === "dark" ? "dark" : "light"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="booking"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon
                            iconName="calendar"
                            focused={focused}
                            colorScheme={colorScheme === "dark" ? "dark" : "light"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="bookingCalander"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon
                            iconName="calendarClock"
                            focused={focused}
                            colorScheme={colorScheme === "dark" ? "dark" : "light"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon
                            iconName="chat"
                            focused={focused}
                            colorScheme={colorScheme === "dark" ? "dark" : "light"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon
                            iconName="user"
                            focused={focused}
                            colorScheme={colorScheme === "dark" ? "dark" : "light"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}