import { View, Pressable, Text } from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import {
    Heart,
    House,
    LayoutGrid,
    UserRound,
} from "lucide-react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming, Easing, LinearTransition, FadeInRight, FadeInLeft, LayoutAnimationConfig } from "react-native-reanimated";
import { useEffect } from "react";

const icons = {
    index: House,
    categorys: LayoutGrid,
    favorite: Heart,
    profile: UserRound,
};
const itemSize = 50;
export default function TabBar({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    return (
        <View style={{ width: (itemSize * 5) + (12 * 5) }} className=" bg-primary rounded-[40px] left-1/2 -translate-x-1/2   bottom-4  absolute  z-10 px-2 py-2 ">
           <LayoutAnimationConfig skipExiting> <View className="flex-row flex-1 relative items-center   justify-between gap-3">
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        // tapPosition.value = withSpring(22.23 * index, { duration: 1500 });
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <TabButton
                            key={route.name}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            routename={route.name}
                            label={label as string}
                            isFocused={isFocused}
                        />
                    );
                })}
            </View></LayoutAnimationConfig>
        </View>
    );
}
type Tab = {
    onLongPress: () => void;
    onPress: () => void;
    label: string;
    routename: string;
    isFocused: boolean;
};
const TabButton = ({
    routename,
    label,
    onLongPress,
    onPress,
    isFocused,
}: Tab) => {
    const Icon = icons[routename as keyof typeof icons];
    const active = useSharedValue(0)
    useEffect(() => {
        active.value = withTiming(isFocused ? 1 : 0)
    }, [isFocused])

    const btnAnimation = useAnimatedStyle(() => {
        return {
            width: interpolate(
                active.value,
                [0, 1],
                [itemSize, itemSize * 2]
            ),
            backgroundColor: interpolateColor(
                active.value,
                [0, 1],
                ["transparent", "#fff"]
            )
        }
    })
    return (
        <Animated.View  style={btnAnimation} className={"rounded-[40px]"}>
            <Pressable
                className={"py-3  flex-row gap-2 justify-center w-full  items-center "}
                onPress={onPress}

                onLongPress={onLongPress}
            >

                <Icon
                    size={20}
                    color={isFocused ? "#4aa556" : "#fff"}
                    fill={isFocused ? "#4aa556" : "transparent"}
                />
                
                {isFocused && (
                    <Animated.Text key={label} className="text-sm z-20  font-500 font-medium"
                        entering={FadeInRight.springify().stiffness(40).delay(10)}
                        exiting={FadeInLeft.springify().stiffness(20).duration(20)}
                    >{label}</Animated.Text>
                )}
            </Pressable></Animated.View>
    );
};
