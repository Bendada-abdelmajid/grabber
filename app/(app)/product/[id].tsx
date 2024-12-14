import { View, Text, Image, ScrollView, Pressable, FlatList } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BackBtn from "@/components/back-btn";
import CartBtn from "@/components/cart-btn";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { data } from "@/constants/data";
import Rating from "@/components/rating";

import { ChevronDown, ChevronRight, Heart, Minus, Plus } from "lucide-react-native";
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition, measure, PinwheelIn, PinwheelOut, runOnUI, SlideInDown, SlideInUp, useAnimatedRef, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";

import ProductCard from "@/components/ProductCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/hooks/app-context";

const texts = ["Add To Cart", "Item added to cart!", "View Cart"]
const ProductDetail = () => {
    const { cart, favorites, handleFavorites, handleCart } = useAppContext()
    const { id } = useLocalSearchParams();
    const router = useRouter()
    const product = data.find((el) => el.id == id);
    const count = cart.find((el) => el.product.id == id)?.count || 1;
    const isFavorite = favorites.findIndex((el) => el.id == id) !== -1;
    const [currentCount, setCurrentCount] = useState(count)
    const simelerProduct = data.filter(el => el.category == product?.category && el.id != id)
    const y = useSharedValue(0)
    const btnStyelz = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: y.value * -50
                }
            ]
        }
    })

    if (!product) return null;
    const updateCount=(type:"Add"|"Remove")=>{
        if(type=="Remove"){
            setCurrentCount(prev => prev > 1 ? prev - 1 : prev)
        } else {
            setCurrentCount(prev => prev < 5 ? prev + 1 : prev)
        }
        y.value=withTiming(0, { duration: 30 })
        
    }
    const addToCart = () => {
        //() => handleCart(product, "Add", currentCount)
        if (y.value == 2) {
            router.push("/cart")
        } else {
            handleCart(product, "Add", currentCount)
        
            y.value = withTiming(1, { duration: 300 }, () => {
                
                y.value = withDelay(300,withTiming(2, { duration: 800 }));
            });
        }
    }
    return (
        <SafeAreaView className="flex-1 relative  bg-white ">
            <View className="flex-1">
                <LinearGradient
                    locations={[0.2, 1]}
                    colors={["#ffffff", "transparent"]}
                    className="absolute top-0 px-5   z-10 flex-row w-full justify-between items-center pt-5 pb-8"
                >
                    <BackBtn />
                    <Text className="text-center text-2xl font-semibold">
                        Product detail
                    </Text>
                    <CartBtn />
                </LinearGradient>
                <ScrollView showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never"
                    className="flex-1 "
                    contentContainerStyle={{ paddingTop: 80, paddingBottom: 20 }}
                >
                    <Animated.View layout={LinearTransition} className="flex-1">
                        <View className="mx-5 p-5 bg-neutral  rounded-xl">
                            <Pressable
                                onPress={() => handleFavorites(product)}
                                className="absolute top-2 right-2 z-10  bg-white rounded-full  p-3"
                            >
                                <Heart
                                    size={24}
                                    fill={isFavorite ? "#f43f5e" : "transparent"}
                                    color={isFavorite ? "#f43f5e" : "#666"}
                                    strokeWidth={1.4}
                                />
                            </Pressable>
                            <Animated.Image sharedTransitionTag={product.id} 
                                className="w-full aspect-[1/.8] "
                                resizeMode="contain"
                                source={{ uri: product.imageUrl }}
                            />
                        </View>
                        <View className=" pt-6 mx-5">
                            <View className="flex-row gap-5 justify-between">
                                <Text style={{ fontFamily: "Manrope_600SemiBold" }} className="text-2xl flex-1 font-medium">{product.title}</Text>
                                <View style={{ width: 100, height: 40 }} className="flex-row  bg-neutral  items-center h-full rounded-lg   justify-between  ">
                                    <Pressable onPress={() =>updateCount("Remove")} className='h-full aspect-square rounded-full justify-center items-center '>
                                        <Minus size={20} strokeWidth={2.5} color={"#000"} />
                                    </Pressable>
                                    <Text style={{ fontFamily: "Manrope_500Medium" }} className='flex-1  text-lg text-center'>{currentCount}</Text>
                                    <Pressable onPress={() =>updateCount("Add")} className=' font-medium h-full aspect-square  rounded-full justify-center items-center '>
                                        <Plus size={20} strokeWidth={2.5} color="#4aa556" />
                                    </Pressable>

                                </View>
                            </View>

                            <View className="flex-row items-center mt-3">
                                {product.discountPrice ? (
                                    <View className="flex-row flex-1 items-center gap-3">
                                        <Text style={{ fontFamily: "Manrope_600SemiBold" }} className="font-semibold text-xl text-[#4aa556]">
                                            ${product.discountPrice}0
                                            <Text style={{ fontFamily: "Manrope_500Medium" }} className="font-medium">/{product.size}</Text>
                                        </Text>
                                        <Text style={{ fontFamily: "Manrope_500Medium" }} className="bg-[#4aa556] font-medium text-white py-1 px-2 rounded-3xl text-xs">
                                            {product.discountPercentage} OFF
                                        </Text>
                                        <Text style={{ fontFamily: "Manrope_400Regular" }} className="text-[#B2BBCE] ml-auto  ">
                                            Reg: ${product.price}0 USD
                                        </Text>
                                    </View>
                                ) : (
                                    <Text className="font-semibold text-xl text-[#4aa556]">
                                        ${product.price}.00<Text style={{ fontFamily: "Manrope_500Medium" }} className="font-medium">/{product.size}</Text>
                                    </Text>
                                )}
                            </View>

                            <View className="flex-row items-center mt-4">
                                <StarRatingDisplay
                                    maxStars={5}
                                    starSize={26}
                                    color="#F9B023"

                                    starStyle={{ marginLeft: -2.5 }}
                                    rating={4.5}
                                />
                                <Text className="text-[#A1A1AB]">146 Revviews</Text>

                            </View>
                            <View className="flex-row  mt-5 gap-5">
                                <Pressable onPress={addToCart} className="border overflow-hidden border-primary flex-1 h-14 px-6 rounded-xl ">
                                    <Animated.View style={btnStyelz} className="absoluteleft-0 right-0  top-[2px]">
                                        {texts.map(el => (
                                            <View key={el} className="h-14 w-full py-3">
                                                <Text style={{ fontFamily: "Manrope_500Medium" }} adjustsFontSizeToFit numberOfLines={1} className="text-primary text-center text-xl">{el}</Text>
                                            </View>
                                        ))}
                                    </Animated.View>

                                </Pressable>
                                <Pressable className="bg-primary flex-1 py-3.5 px-6 rounded-xl ">
                                    <Text style={{ fontFamily: "Manrope_500Medium" }} className="text-white text-center text-xl">Buy Now</Text>

                                </Pressable>
                            </View>
                            <Text className="mt-5 text-xl">Details</Text>
                            <Text className="text-lg leading-[1.4] mt-2 text-[#8891A5] ">
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur
                                et. Nullam quis risus eget urna mollis ornare vel eu leo.
                            </Text>
                            <Pressable className="flex-row  rounded-xl mt-5 items-center justify-between py-2">
                                <Text className="text-xl">Reviews</Text>
                                <ChevronRight size={20} color={"#8891A5"} />
                            </Pressable>
                            <Pressable className="flex-row  rounded-xl mt-2 items-center justify-between py-2">
                                <Text className="text-xl">Simeler Products</Text>
                                <ChevronRight size={20} color={"#8891A5"} />
                            </Pressable>


                        </View>
                        {/* <Text className="text-xl mt-7 px-5  font-semibold">
                            Simeler Products
                        </Text>
                        <View className="flex-shrink-0">
                            <FlatList
                                className=""
                                data={simelerProduct}
                                horizontal

                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 15 }}
                                bounces={false}
                                overScrollMode="never"
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <ProductCard item={item} index={index} />
                                )}
                            />
                        </View> */}
                    </Animated.View>
                </ScrollView>
                {/* <LinearGradient
                    locations={[0.2, 1]}
                    colors={["transparent", "#ffffff"]}
                    className="absolute bottom-0 px-5 gap-5  z-10 flex-row w-full justify-between items-center pt-5 pb-5"
                >
                   <View className="h-5 w-[1px] bg-white" />
                                    <Text style={{ fontFamily: "Manrope_600SemiBold" }} className="text-white text-xl font-semibold">${product.price * count}</Text>
                </LinearGradient> */}
                {/* <FlatList showsVerticalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full flex-1' data={products}
                    contentContainerStyle={{ paddingTop: 90, paddingBottom: 100, gap: 25 }}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 20 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => <ProductCard index={index} item={item} />}
                /></View> */}
            </View>
        </SafeAreaView>

    );
};

export default ProductDetail;


const Reviews = () => {
    const [open, setOpen] = useState(false)


    return (
        <Animated.View layout={LinearTransition} className="bg-neutral mt-7 rounded-xl">
            <Pressable className="flex-row items-center justify-between py-2 px-4"
                onPress={() => setOpen(!open)}>
                <Text className="text-xl">Reviews</Text>


                <ChevronDown size={20} color={"#8891A5"} />

            </Pressable>
            <LayoutAnimationConfig skipEntering>

                {open && <Animated.View layout={LinearTransition} entering={FadeIn} exiting={FadeOut} >
                    <Text className="px-4 pb-5">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                    </Text>
                </Animated.View>}

            </LayoutAnimationConfig>
        </Animated.View>
    )
}
