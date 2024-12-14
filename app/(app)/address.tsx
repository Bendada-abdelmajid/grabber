import { View, Text, FlatList, Pressable } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "@/components/back-btn";
import { useAppContext } from "@/hooks/app-context";
import { Address, Card } from "@/libs/types";
import { Check, CirclePlus } from "lucide-react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import firestore from '@react-native-firebase/firestore';
import BottomSheet from "@/components/bottom-sheet";
import AddressForm from "@/components/adress-form";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const AddressPage = () => {
    const { user } = useAppContext();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    return (
        <>
            <SafeAreaView className="flex-1 bg-white pt-5 pb-10 ">
                <View className="flex-row items-center gap-5 px-5 mb-10">
                    <BackBtn />
                    <Text className="text-2xl">Address</Text>
                </View>
                <FlatList className="flex-1" contentContainerStyle={{ gap: 20 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    overScrollMode="never"
                    data={user.addresses}
                    keyExtractor={(item, index) => "address-" + index}
                    renderItem={({ item, index }) => <Item item={item} index={index} />}
                />
                <Link href={"/add-address"} className="px-5"><View className="py-4 w-full border border-primary rounded-[40px] flex-row items-center gap-3 justify-center">
                    <CirclePlus size={20} color={"#4aa556"} />
                    <Text className="text-xl text-center font-500 font-medium text-primary ">Add Address</Text>
                </View>
                </Link>
            </SafeAreaView>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                onChange={handleSheetChanges}
            ><BottomSheetView style={{flex:1}}> 
                <AddressForm />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

export default AddressPage;
type ItemProps = {
    item: Address;
    index: number;
};
const Item = ({ item, index }: ItemProps) => {
    const { user } = useAppContext()
    const router = useRouter()
    const activeValue = useSharedValue(0);
    useEffect(() => {
        activeValue.value = withSpring(user.activeAddress == item.id ? 1 : 0, { stiffness: 200, damping: 20 });
    }, [user.activeAddress]);
    const hundelActive = () => {
        firestore()
            .collection('users')
            .doc(user.uid).update
            ({
                activeAddress: item.id
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
                ["#eee", "#000"] // Map values between 0 (light color) and 255 (dark color)
            ),
        };
    });

    return (
        <View className="flex-row flex-1 bg-white mx-5 shadow-2xl border border-neutral rounded-xl gap-5 p-5 justify-between">
            <View className="flex-1">

                <Text className="text-2xl font-500 mb-2  ">{item.title}</Text>
                <Text numberOfLines={1} className="text-sm opacity-60  font-400 font-semibold">{item.addressLine}, {item.city}, {item.country}, {item.zipCode} </Text>
            </View>
            <View className="justify-between items-end">
                <Pressable onPress={hundelActive}>
                    <Animated.View style={checkStyles} className="size-8 items-center justify-center -mr-1 -mt-2 rounded-full ">
                        {user.activeAddress == item.id && <Check color={"#fff"} size={15} />}
                    </Animated.View>
                </Pressable>
                <Pressable className="px-1 " onPress={() => router.push({ pathname: "/add-address", params: { id: item.id } })}>
                    <Text className="text-primary">Edit</Text>
                </Pressable>
            </View>
        </View>
    );
};
