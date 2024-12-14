import { View, Text, ScrollView, FlatList, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import BackBtn from '@/components/back-btn'
import { Bike, Check, ChevronRight, CirclePlus, CreditCard, ReceiptText } from 'lucide-react-native'
import { useAppContext } from '@/hooks/app-context'
import { Link } from 'expo-router'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Card } from '@/libs/types'
import firestore from '@react-native-firebase/firestore'
const formatCardNumber = (cardNumber: string): string => {
    // Use a regular expression to group digits into chunks of 4 and add 3 spaces between them.
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1   ');
};

const payement = () => {
    const { cart, user } = useAppContext()
    const totale = cart.reduce((a, b) => a + b.total, 0);
    return (
        <SafeAreaView className="flex-1 relative  bg-white ">
            <View className="flex-1 bg-white">
                <LinearGradient
                    locations={[0.2, 1]}
                    colors={["#ffffff", "transparent"]}
                    className="absolute top-0 px-5   z-10 flex-row w-full gap-10 justify-between items-center pt-5 pb-8"
                >
                    <BackBtn />
                    <Text className="text-center  text-xl font-semibold">Payement</Text>
                    <View className="size-10" />
                </LinearGradient>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    overScrollMode="never"
                    className="flex-1 "
                    contentContainerStyle={{ paddingTop: 80, paddingBottom: 80, flex: 1 }}
                >

                    <View className='mx-5 rounded-xl border-gray-200 border '>
                        <View className='flex-row items-center p-4 gap-3 border-b border-gray-200'>
                            <ReceiptText size={20} color={"#222"} />
                            <Text className='flex-1 text-lg font-medium'>sub-Total</Text>
                            <Text className='text-lg font-bold'>${totale}</Text>
                        </View>
                        <View className='flex-row items-center border-b border-gray-200 p-4 gap-3'>
                            <Bike size={20} color={"#222"} />
                            <Text className='flex-1 text-lg font-medium'>Delivery</Text>
                            <Text className='text-lg font-bold'>$6.00</Text>
                        </View>
                        <View className='flex-row items-center p-4 gap-3'>
                            <ReceiptText size={20} color={"#222"} />
                            <Text className='flex-1 text-lg font-medium'>Total</Text>
                            <Text className='text-lg font-bold'>${totale}</Text>
                        </View>
                    </View>

                    <Text className="text-2xl opacity-65 px-5 font-600 mt-7 mb-5">
                        Choose Card
                    </Text>
                    {user.creditCards?.map(el => (
                        <Item item={el} key={el.id} />
                    ))}

                    <Link href={{ pathname: "/add-card" }} className="px-5"><View className="px-4 py-3  border border-gray-200 w-full  rounded-lg flex-row items-center gap-3 ">
                        <CreditCard size={20} color={"#4aa556"} />
                        <Text className="text-xl  font-500 font-medium flex-1">Add Card</Text>
                        <ChevronRight size={20} color={"#222"} />
                    </View>
                    </Link>



                </ScrollView>
                <LinearGradient
                    locations={[0.2, 1]}
                    colors={["transparent", "#ffffff"]}
                    className="absolute bottom-0 py-5 px-6  left-0 right-0 "
                >
                    <Pressable className="py-4 w-full rounded-[40px] shadow-2xl bg-primary">
                        <Text className="text-center font-500 text-xl text-white">
                            Order
                        </Text>
                    </Pressable>
                </LinearGradient>
            </View>
        </SafeAreaView>
    )
}

export default payement

type ItemProps = {
    item: Card;
};
const Item = ({ item }: ItemProps) => {
    const { user } = useAppContext()

    const activeValue = useSharedValue(0);
    useEffect(() => {
        activeValue.value = withSpring(user.activeCard == item.id ? 1 : 0, { stiffness: 200, damping: 20 });
    }, [user.activeCard]);
    const hundelActive = () => {
        firestore()
            .collection('users')
            .doc(user.uid).update
            ({
                activeCard: item.id
            })
            .catch((error) => {
                console.log(error)
            });
    }
    const checkStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                activeValue.value,
                [0, 1],
                ["#eee", "#4aa556"] // Map values between 0 (light color) and 255 (dark color)
            ),
        };
    });

    return (
        <View className="flex-row  mx-5  border border-neutral rounded-xl py-3 mb-5 px-4 items-center justify-between">
            <View>

                <Text className="font-400 mb-1 opacity-60 ">{item.nameOnCard}</Text>
                <Text className="text-xl font-600 font-semibold">{formatCardNumber(item.cardNumber)}</Text>
            </View>
            <View className="justify-between items-end">
                <Pressable onPress={hundelActive}>
                    <Animated.View style={checkStyles} className="size-8 items-center justify-center -mr-1 -mt-2 rounded-full ">
                        {user.activeCard == item.id && <Check color={"#fff"} size={15} />}
                    </Animated.View>
                </Pressable>

            </View>
        </View>
    );
};