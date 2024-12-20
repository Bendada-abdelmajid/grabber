import { View, Text, Image, Pressable, Dimensions } from "react-native";
import React from "react";
import { Product } from "@/constants/data";
import { Heart, Minus, Plus } from "lucide-react-native";
import { useAppContext } from "@/hooks/app-context";
import Animated, {
    FadeInLeft,
    LinearTransition,
    useAnimatedStyle,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import HeartIcon from "./icons/heart-icon";

type Props = {
    item: Product;
    index: number;
};
const { width } = Dimensions.get("window");
const ProductCard = ({ item }: Props) => {
    const router = useRouter();
    const { favorites, handleFavorites, handleCart, cart } = useAppContext();
    const isFavorite = favorites.findIndex((el) => el.id == item.id) !== -1;
    const count = cart.find((el) => el.product.id == item.id)?.count;
    const stylz = useAnimatedStyle(() => {
        return {
            width: withTiming(count && count > 0 ? 85 : 34, { duration: 300 }),
        };
    });
    const styleOpacity = useAnimatedStyle(() => {
        return {
            opacity: withTiming(count && count > 0 ? 1 : 0, { duration: 400 }),
            transform: [
                {
                    translateX: withDelay(
                        100,
                        withTiming(count && count > 0 ? 0 : -80, { duration: 300 })
                    ),
                },
            ],
        };
    });
    const navigate = () => {
        try {
            console.log("navigate");
            router.push({ pathname: "/product/[id]", params: { id: item.id } });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View
           style={{minWidth:(width/2)-50, maxWidth:(width/2)-20}}
            className="flex-1 bg-[#fafaf9] rounded-xl overflow-hidden"
        >
            <Pressable
                onPress={navigate}
                className="h-40  p-3  justify-center items-center  rounded-xl"
            >
                <Animated.Image resizeMode={"contain"}
                    key={"img"}
                    sharedTransitionTag={item.id}
                    className="size-full object-contain"
                    source={{ uri: item.imageUrl }}
                />
                <Pressable
                    onPress={() => handleFavorites(item)}
                    className="absolute top-2 right-2"
                >
                    <HeartIcon
                        size={24}
                        fill={isFavorite ? "#4aa556" : "#0000"}
                        strockColor={isFavorite ?"#4aa556":"#d1d5db"}
                        color={isFavorite ?"#fff":"#e5e7eb"}
                    />
                </Pressable>
                <Animated.View
                    style={[{ borderRadius: 40 }, stylz]}
                    className="flex-row border absolute -bottom-4 right-2 border-neutral  items-center  justify-end overflow-hidden  bg-white rounded-[40px] shadow-3xl"
                >
                    {count && count > 0 && (
                        <Animated.View style={styleOpacity} className={"flex-1"}>
                            <View className="flex-row items-center">
                                <Pressable
                                    onPress={() => handleCart(item, "Remove")}
                                    className="size-9 rounded-full justify-center items-center"
                                >
                                    <Minus size={15} strokeWidth={2.5} color={"#000"} />
                                </Pressable>
                                <Text className="flex-1 px-2 text-black text-center">
                                    {count}
                                </Text>
                            </View>
                        </Animated.View>
                    )}

                    <Pressable
                        onPress={() => handleCart(item, "Add")}
                        className="font-medium size-9 rounded-full ml-auto justify-center items-center "
                    >
                        <Plus size={15} strokeWidth={2.5} color={"#000"} />
                    </Pressable>
                </Animated.View>
            </Pressable>
            <View className="p-3">
                {item.discountPrice ? (
                    <View className="flex-row items-center gap-1.5">
                        <Text className="font-semibold font-600 text-xl">${item.discountPrice}</Text>
                        <Text className="opacity-65 line-through font-400 ">${item.price}</Text>
                    </View>
                ) : (
                    <Text className="font-semibold font-600  text-xl ">${item.price}</Text>
                )}
                <Text className="font-medium font-500 opacity-80 mt-1">
                    {item.title}
                </Text></View>
      
        </View>
    );
};

export default ProductCard;
