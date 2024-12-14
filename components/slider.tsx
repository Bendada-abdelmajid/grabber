import { View, Text, Pressable, Image, Dimensions } from "react-native";
import React from "react";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {
    Directions,
    FlingGestureHandler,
    Gesture,
    GestureDetector,
    State,
} from "react-native-gesture-handler";
const cards = [
    {
        id: 1,
        title: "Fresh Vegetables",
        description: "Get the best quality vegetables delivered to your doorstep.",
        image: require("@/assets/images/vegetables.png"),
        bg: "#eef9f0", // Soft green
        buttonBg: "#5ac268" // Darker green for the button
    },
    {
        id: 2,
        title: "Organic Fruits",
        description: "Handpicked organic fruits for a healthy lifestyle.",
        image: require("@/assets/images/fruits.png"),
        bg: "#fef3c7", // Soft yellow
        buttonBg: "#fbbf24"
        //"#FFC83A" // Bright yellow for the button
    },
    {
        id: 3,
        title: "Dairy Products",
        description: "Premium dairy products from trusted farms.",
        image: require("@/assets/images/dairy.png"),
        bg: "#e0f2fe", // Soft blue
        buttonBg: "#0ea5e9" // Darker blue for the button
    },
];

const { width } = Dimensions.get("window");
const duration = 300;
const itemSize = width * 0.9;
const Slider = () => {
    const activeIndex = useSharedValue(0);

    const flingLeft = Gesture.Fling()
        .direction(Directions.LEFT)
        .onStart((e) => {
            if (activeIndex.value === 0) {
                return;
            }
            activeIndex.value = withTiming(activeIndex.value - 1, { duration });
        });
    const flingRight = Gesture.Fling()
        .direction(Directions.RIGHT)
        .onStart((e) => {
            if (activeIndex.value === cards.length - 1) {
                return;
            }
            activeIndex.value = withTiming(activeIndex.value + 1, { duration });
        });
    return (
        <View style={{height:160}} className="mt-7 px-5 w-full  ">
            <GestureDetector gesture={Gesture.Exclusive(flingLeft, flingRight)}>
                <View className="h-full flex-1">
                    {cards.map((item, index) => (
                        <Card
                            key={item.id}
                            item={item}
                            index={index}
                            activeIndex={activeIndex}
                        />
                    ))}
                </View>
            </GestureDetector>
        </View>
    );
};

export default Slider;
type ItemProps = {
    item: (typeof cards)[0];
    index: number;
    activeIndex: SharedValue<number>;
};
const Card = ({ item, index, activeIndex }: ItemProps) => {
    const stylez = useAnimatedStyle(() => {
        return {
            zIndex: cards.length - index,

            opacity: interpolate(
                activeIndex.value,
                [index - 1, index, index + 1],
                [0.7, 1, 1]
            ),

            transform: [
                {
                    translateX: interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [20, 0, width]
                    ),
                },
                {
                    rotate: `${interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [0, 0, 10],
                        Extrapolation.CLAMP
                    )}deg`,
                },
                {
                    scale: interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [0.95, 1, 1]
                    ),
                },
            ],
        };
    });
    return (
        <Animated.View
            style={[{ width: itemSize, backgroundColor:item.bg }, stylez]}
            className="py-5 absolute top-0 left-0 flex-row bg-white items-end justify-between  rounded-2xl"
        >
           

           
            <View className="flex-1 pl-5">
                <Text className="text-2xl font-semibold w-[200px]">{item.title}</Text>
                <Text className="text-sm mt-1 w-[200px]">{item.description}</Text>
                <Pressable style={{backgroundColor:item.buttonBg}} className="mt-4 px-4 py-3 rounded-xl  w-[100px]">
                    <Text className="text-white text-center font-medium">Shop Now</Text>
                </Pressable>
            </View>
            <Image
                style={{ width: itemSize - 180 }}
                className=" h-[150px] object-contain absolute bottom-0 right-0"
                resizeMode="contain"
                source={item.image}
            />
       
        </Animated.View>
    );
};
