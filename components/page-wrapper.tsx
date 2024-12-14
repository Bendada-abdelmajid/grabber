import { View, Text, ScrollView, Pressable } from "react-native";
import React, { ReactNode } from "react";
import { ChevronDown, MapPin } from "lucide-react-native";
import CartBtn from "./cart-btn";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import SearchIcon from "./icons/search-icon";
import { LinearGradient } from "expo-linear-gradient";
const HEADER_HEIGHT = 50;
const PageWrapper = ({ children }: { children: ReactNode }) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        scrollOffset.value,
        [0, 50],
        [25, 10],
        Extrapolate.CLAMP
      ),
      borderBottomColor: interpolateColor(
        scrollOffset.value,
        [0, 50],
        ["#fff", "#eee"]
      ),
    };
  });
  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollOffset.value,
            [0, 70],
            [0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollOffset.value,
        [0, 70],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });
  return (
    <SafeAreaView className="flex-1 bg-white relative ">
      <View className="flex-1">
        <LinearGradient
          locations={[0.85, 1]}
          colors={["#ffffff", "transparent"]}
          className="absolute top-0 w-full z-40 pb-7"
        >
          <Animated.View
            style={[headerAnimatedStyle]}
            className={
              "flex-row gap-5 px-5 w-full items-center justify-center"
            }
          >
            <View className="flex-row gap-2 items-center mr-auto">
              <MapPin color={"#0CA201"} opacity={0.6} />
              <View>
                <View className="flex-row items-center gap-1 -mb-0.5">
                  <Text className="">Home</Text>
                  <ChevronDown size={16} color={"#222"} />
                </View>
                <Text className="opacity-60">Green Way 3000, Sylhet</Text>
              </View>
            </View>
            <Animated.View style={[searchAnimatedStyle]}>
              <Pressable className="bg-neutral size-10 rounded-full items-center justify-center">
                <SearchIcon size={18} />
              </Pressable>
            </Animated.View>
            <CartBtn />
          </Animated.View>
        </LinearGradient>

        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 70, paddingBottom: 100 }}
        >
          <View className="flex-1">{children}</View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PageWrapper;
