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


type Props = {
    item: Product;
    index: number;
};
const { width } = Dimensions.get("window");
const ProductCard = ({ item }: Props) => {
    const router = useRouter()
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
            opacity: withTiming(count && count > 0 ? 1 : 0, { duration: 400, }),
            transform: [
                {
                    translateX: withDelay(100, withTiming(count && count > 0 ? 0 : -80, { duration: 300, })),
                }
            ]
        };
    });
    const navigate = () => {

        try {
            console.log("navigate")
            router.push({ pathname: "/product/[id]", params: { id: item.id } })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View
            style={{ minWidth: (width - 70) / 2, maxWidth: (width - 50) / 2 }}
            className="flex-1 "
        >
            <Pressable onPress={navigate} className="h-36 justify-center items-center bg-neutral rounded-xl">
                <Animated.Image key={"img"} sharedTransitionTag={item.id} className="size-28" source={{ uri: item.imageUrl }} />
                <Pressable
                    onPress={() => handleFavorites(item)}
                    className="absolute top-2 right-2"
                >
                    <Heart
                        size={24}
                        fill={isFavorite ? "#111" : "transparent"}
                        color={"#666"}
                        strokeWidth={1.4}
                    />
                </Pressable>
            </Pressable>

            <Text className="font-semibold text-lg mt-1 w-36" numberOfLines={1}>
                {item.title}
            </Text>
            <Text className="opacity-65">{item.size}</Text>

            <View className="flex-row  items-end  justify-between">
                {item.discountPrice ? (
                    <View className="flex-row items-center gap-1.5">
                        <Text className="font-semibold text-xl">${item.discountPrice}</Text>
                        <Text className="opacity-65 line-through ">${item.price}</Text>
                    </View>
                ) : (
                    <Text className="font-semibold mt-1 text-xl ">${item.price}</Text>
                )}
                <Animated.View

                    style={[{ borderRadius: 40 }, stylz]}
                    className="flex-row border border-neutral  items-center  justify-end overflow-hidden  bg-white rounded-[40px] shadow"
                >
                    {count && count > 0 && (
                        <Animated.View style={styleOpacity} className={"flex-1"}>
                            <View className="flex-row items-center">
                                <Pressable
                                    onPress={() => handleCart(item, "Remove")}
                                    className="size-9 rounded-full justify-center items-center"
                                >
                                    <Minus size={18} strokeWidth={2.5} color={"#000"} />
                                </Pressable>
                                <Text className="flex-1 px-2 text-center">{count}</Text>
                            </View>
                        </Animated.View>
                    )}


                    <Pressable
                        onPress={() => handleCart(item, "Add")}
                        className="font-medium size-9 rounded-full ml-auto justify-center items-center "
                    >
                        <Plus size={18} strokeWidth={2.5} color={"#000"} />
                    </Pressable>
                </Animated.View>
                {/* <Pressable onPress={() => handleCart(item, "Add")} className=' shadow-xl  bg-[#4aa556] size-10 rounded-full justify-center items-center '>
                    <Plus size={20} color={"#fff"} />
                </Pressable> */}
            </View>
        </View>
    );
};

export default ProductCard;
