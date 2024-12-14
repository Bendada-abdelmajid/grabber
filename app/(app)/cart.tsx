import BackBtn from "@/components/back-btn";
import CartBtn from "@/components/cart-btn";
import CartItem from "@/components/cart-item";
import {freeDelivery } from "@/constants/data";
import { useAppContext } from "@/hooks/app-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  
    ShoppingCart,
 
} from "lucide-react-native";

import { FlatList, Pressable, ScrollView } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatPrice } from "@/libs/utils";
import { Link } from "expo-router";
const Cart = () => {
    const { cart } = useAppContext();
    const count = cart.reduce((a,b)=> a+b.count , 0)
    const totale = cart.reduce((a, b) => a + b.total, 0);
    return (
        <SafeAreaView className="flex-1 relative  bg-white ">
            <View className="flex-1">
                <LinearGradient
                    locations={[0.7, 1]}
                    colors={["#fff", "transparent"]}
                    className="absolute top-0 px-5  z-10 flex-row w-full justify-between items-center pt-5 pb-8"
                >
                    <BackBtn />
                    <Text className="text-center text-2xl font-semibold">Cart</Text>
                    <View className=' size-10 bg-[#0CA201]  rounded-full justify-center items-center'>
                <Text className='text-white text-lg font-500'>{count}</Text>
            </View>
                </LinearGradient>
                <ScrollView
                    className="flex-1 "
                    contentContainerStyle={{ paddingTop: 80, paddingBottom: 80 }}
                >
                     <View className="mb-5 px-7">
                            <Text className="text-center text-lg font-semibold">
                                You are <Text style={{ marginHorizontal: 5, fontWeight: 900 }}>

                                    {formatPrice(freeDelivery - totale)} 
                                </Text> away from free delivery
                            </Text>

                            <View
                                style={{ height: 6 }}
                                className="bg-neutral h-4 mt-3  w-full rounded-xl overflow-hidden"
                            >
                                <View
                                    style={{ width: `${(totale * 100) / freeDelivery}%` }}
                                    className="absolute top-0 rounded-xl left-0 bottom-0 bg-[#0CA201]"
                                />
                            </View>
                        </View>
                    <View className="flex-1">
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            overScrollMode="never"
                            style={{ flex: 0 }}
                            className="w-full px-5"
                            data={cart}
                            contentContainerStyle={{ flex: 0, paddingBottom: 20, gap: 15 }}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.product.id}
                            renderItem={({ item, index }) => <CartItem item={item} />}
                        />

                    </View>
                </ScrollView>
                <LinearGradient
                    locations={[.1, 1]}
                    colors={["transparent", "#fff"]}
                    className="absolute bottom-0 px-6 gap-20  z-10 flex-row w-full justify-between items-center pt-10 pb-5"
                >
                    <View>
                        <Text className="">Totla Price</Text>
                        <Text className="text-4xl font-700 font-bold">
                            {formatPrice(totale)}
                        </Text>
                    </View>
                    <Link href={"/checkout"} >
                    <View className="flex-row items-center justify-center flex-1 gap-5 px-8 py-4  bg-[#4aa556] rounded-[40px]">
                        <ShoppingCart color={"#fff"} />{" "}
                        <Text className="text-white  text-center font-600 font-semibold text-xl">
                            Checkout
                        </Text></View>
                    </Link>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

export default Cart;
