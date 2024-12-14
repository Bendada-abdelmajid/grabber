import {
    View,
    Platform,
    Pressable,
    Text,
    LayoutChangeEvent,
} from "react-native";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import Animated, {
    Easing,
    FadeIn,
    FadeInLeft,
    FadeInRight,
    FadeOut,
    interpolate,
    LayoutAnimationConfig,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import {
    Heart,
    House,
    LayoutGrid,
    Search,
    UserRound,
} from "lucide-react-native";
import { AnimatePresence, MotiText, MotiView } from "moti";

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
    const [dimensions, setDimensions] = useState({ height: 30, width: 100 });
    const buttonWidth = dimensions.width / 4;
    const onTabLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };
    //left:`${tapPosition.value}%`
    const tapPosition = useSharedValue(0);
    useEffect(() => {
        tapPosition.value = withTiming(state.index * 22.23, { duration: 300 });
    }, [state.index]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            //    transform:[
            //     {
            //         translateX:tapPosition.value
            //     }
            //    ]tapPosition.value
            // left: `${interpolate(
            //     tapPosition.value,
            //     [0,1,2,3],
            //     [0,22.23,44.46 , 66.69]
            // )}%`
            left: `${tapPosition.value}%`,
        };
    });
    return (
        <MotiView
            layout={LinearTransition.springify().damping(80).stiffness(200)}
            className=" bg-primary rounded-[40px] left-1/2 -translate-x-1/2   bottom-4  absolute  z-10 px-3 py-4 "
        >
            <View className="flex-row flex-1 relative items-center   justify-between gap-3">
                {/* <Animated.View
                    className="absolute  z-[-1] h-full w-[33.34%] "
                    style={[animatedStyle]}
                >
                    <View className="h-12 w-[100px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-scondary "></View>

                </Animated.View> */}
    <LayoutAnimationConfig skipEntering>
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
                </LayoutAnimationConfig>
            </View>
        </MotiView>
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
    // const scale = useSharedValue(0);
    // useEffect(() => {
    //     scale.value = withSpring(
    //         typeof isFocused == "boolean" ? (isFocused ? 1 : 0) : isFocused,
    //         { duration: 300, stiffness: 80 }
    //     );
    // }, [scale, isFocused]);

    // const animatedIconStyle = useAnimatedStyle(() => {
    //     return {
    //         opacity: interpolate(scale.value, [0, 1], [.1, 1]),
    //         transform: [
    //             {
    //                 scale: interpolate(scale.value, [0, 1], [0, 1]),
    //             },
    //         ],
    //     };
    // });

    const Icon = icons[routename as keyof typeof icons];
    const AnimatedIcon = Animated.createAnimatedComponent(Icon);
    return (
    
            <MotiView key={label} layout={LinearTransition.springify().damping(80).stiffness(200)}
                className="rounded-lg overflow-hidden"
                animate={{ backgroundColor: isFocused ? "#fff" : " #4aa556" }}
            >
                <Pressable
                    className={"px-5 py-2  flex-row gap-2 justify-center   items-center "}

                    onPress={onPress}
                    onLongPress={onLongPress}
                >
                    <AnimatedIcon
                        size={20}
                        color={isFocused ? "#4aa556" : "#fff"}
                        fill={isFocused ? "#4aa556" : "transparent"}
                    />
                    {isFocused && (
                        <Animated.Text
                            entering={FadeInRight.springify().damping(80).stiffness(200)}
                            exiting={FadeInLeft.springify().damping(80).stiffness(200)}
                            className="text-sm font-500 font-medium"
                        >
                            {label}
                        </Animated.Text>
                    )}
                </Pressable>
            </MotiView>

    );
};
