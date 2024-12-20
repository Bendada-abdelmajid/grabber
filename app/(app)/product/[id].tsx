import { View, Text, ScrollView, Pressable, FlatList } from "react-native";

import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BackBtn from "@/components/back-btn";
import CartBtn from "@/components/cart-btn";

import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/constants/data";


import { Heart, Minus, Plus, Star } from "lucide-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import firestore from "@react-native-firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/hooks/app-context";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/libs/utils";

const texts = ["Add To Cart", "Item added to cart!", "View Cart"]
const ProductDetail = () => {

    const { cart, favorites, handleFavorites, handleCart } = useAppContext()
    const { id } = useLocalSearchParams();
    const router = useRouter()


    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

    const fetchProductAndSimilarProducts = async () => {
        try {
            if (!id) {
                console.warn('No product ID provided.');
                return;
            }

            // Fetch the main product
            const documentSnapshot = await firestore()
                .collection('products')
                .doc(id as string)
                .get();

            if (!documentSnapshot.exists) {
                console.warn('No product found with the given ID.');
                setProduct(null);
                setSimilarProducts([]);
                return;
            }

            const productData = {
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
            } as Product;

            setProduct(productData);
            console.log('Product:', productData);

            // Fetch similar products
            const similarProductsSnapshot = await firestore()
                .collection('products')
                .where('category', '==', productData.category)
                .where(firestore.FieldPath.documentId(), '!=', id)
                .limit(6) // Limit the number of similar products fetched
                .get();

            const fetchedSimilarProducts = similarProductsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setSimilarProducts(fetchedSimilarProducts as Product[]);
      
        } catch (error) {
            console.error('Error fetching product and similar products:', error);
        }
    };

    useEffect(() => {
        fetchProductAndSimilarProducts();
    }, [id]);



    const [currentCount, setCurrentCount] = useState(1)

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (id) {
            // Update the count based on the cart
            const productInCart = cart.find((el) => el.product.id === id);
            setCurrentCount(productInCart?.count || 1);

            // Update the favorite status
            const favoriteIndex = favorites.findIndex((el) => el.id === id);
            setIsFavorite(favoriteIndex !== -1);
        }
    }, [id, cart, favorites]);
    const y = useSharedValue(0)
    const btnStyelz = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: y.value * -53
                }
            ]
        }
    })

    if (!product) return null;
    const updateCount = (type: "Add" | "Remove") => {
        if (type == "Remove") {
            setCurrentCount(prev => prev > 1 ? prev - 1 : prev)
        } else {
            setCurrentCount(prev => prev < 5 ? prev + 1 : prev)
        }
        y.value = withTiming(0, { duration: 30 })

    }
    const addToCart = () => {
        //() => handleCart(product, "Add", currentCount)
        if (y.value == 2) {
            router.push("/cart")
        } else {
            handleCart(product, "Add", currentCount)

            y.value = withTiming(1, { duration: 300 }, () => {

                y.value = withDelay(300, withTiming(2, { duration: 800 }));
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
                    contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
                >
                    <View  className="flex-1">
                        <View className="mx-5 justify-center items-center pb-10 pt-5 bg-neutral relative  rounded-xl">
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
                                className="w-[90%] aspect-[1/.8]"
                                resizeMode="contain"
                                source={{ uri: product.imageUrl }}
                            />
                            <View  className="absolute -bottom-6 left-1/2 -translate-x-1/2  flex-row flex-1 border border-neutral bg-white shadow-2xl px-1.5 items-center h-14 rounded-[40px]   justify-between  ">
                                <Pressable onPress={() => updateCount("Remove")} className='h-full aspect-square rounded-full justify-center items-center '>
                                    <Minus size={20} strokeWidth={2.5} color={"#4aa556"} />
                                </Pressable>
                                <Text  className='px-4 text-xl font-500 text-center'>{currentCount}</Text>
                                <Pressable onPress={() => updateCount("Add")} className=' font-medium h-full aspect-square  rounded-full justify-center items-center '>
                                    <Plus size={20} strokeWidth={2.5} color="#4aa556" />
                                </Pressable>

                            </View>
                        </View>
                        <View className=" pt-12 mx-5">
                            <View className="flex-row gap-5 justify-between">
                                <Text className="text-2xl font-600 flex-1 font-semibold">{product.title}</Text>

                                <View className="flex-row items-center gap-1">
                                    <Star color={"#F9B023"} fill={"#F9B023"} /> 
                                    <Text className="text-2xl opacity-65 font-500">{product.rating}</Text>
                                    </View>
                            </View>

                            <View className="flex-row items-center mt-3">
                                {product.discountPrice ? (
                                    <View className="flex-row flex-1 items-center  ">
                                        <View className="flex-row  items-end  ">  
                                             <Text className="font-semibold font-600 text-2xl text-primary">
                                            {formatPrice(product.discountPrice)}

                                        </Text>
                                            <Text className=" font-400 text-meuted leading-7" > /{product.size}</Text>
                                            </View>

                                        <Text className="text-[#B2BBCE] ml-auto leading-7 ">
                                            Reg: {formatPrice(product.price)} USD
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="flex-row  items-end  "> 
                                    <Text className="font-semibold text-xl">
                                        {formatPrice(product.price)}
                                    </Text>
                                    <Text  className="font-medium"> /{product.size}</Text>
                                    </View>
                                )}
                            </View>


                            <Text className="text-lg font-400 leading-[1.4] mt-4 text-gray-500">
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur
                                et. Nullam quis risus eget urna mollis ornare vel eu leo.
                            </Text>


                            <Text className="text-xl mt-7 font-500 font-medium ">Simeler Products</Text>
                        
                            <FlatList
                                className="mt-4"
                                data={similarProducts}
                                scrollEnabled={false}
                                numColumns={2}
                                columnWrapperStyle={{ gap: 15 }}
                                contentContainerStyle={{ gap: 15 }}
                                bounces={false}
                                overScrollMode="never"
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <ProductCard item={item} index={index} />
                                )}
                            />
                       

                        </View>
                   
                    </View>
                </ScrollView>

                <View className="absolute bottom-2 justify-center overflow-hidden   left-0 right-0  pt-3 pb-2 items-center  ">


                    <Pressable onPress={addToCart} className="overflow-hidden shadow-2xl bg-primary w-[80%] mx-auto  h-16 px-6 rounded-[40px]">
                        <Animated.View style={btnStyelz} className="absolute  left-0 right-0  top-0">
                            {texts.map(el => (
                                <View key={el} className="h-[53px] w-full  justify-center  ">
                                    <Text adjustsFontSizeToFit numberOfLines={1} className="text-white text-center  align-middle font-500 tracking-wider font-medium text-xl">{el}</Text>
                                </View>
                            ))}
                        </Animated.View>

                    </Pressable>
                </View>


            </View>
        </SafeAreaView>

    );
};

export default ProductDetail;

