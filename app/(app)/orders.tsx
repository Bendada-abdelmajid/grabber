import { View, Text, Pressable, FlatList, Image, Dimensions } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
;
import BackBtn from "@/components/back-btn";
import { AnimatePresence, MotiText, MotiView } from "moti";
import { Order, OrderStatus } from "@/libs/types";
import firestore, { or } from "@react-native-firebase/firestore";
import { formatDate, formatPrice } from "@/libs/utils";
import Animated from "react-native-reanimated";
import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ban, Bike, Check, Clock9, MapPinHouse, NotepadText, PackageCheck, X } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppContext } from "@/hooks/app-context";
type Status = "all" | OrderStatus
const orderStatuses: ("all" | OrderStatus)[] = [
    'confirmed',
    'preparing',
    'delivered',
    'cancelled',
];
const Orders = () => {
    const {user}= useAppContext()
    const [active, setActive] = useState<Status>("confirmed");
    const [orders, setOrders] = useState<Order[]>([]);
    const { id } = useLocalSearchParams();
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                {...props}
            />
        ),
        []
    );
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('orders').where("userId", "==", user.uid )
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map((doc) => ({
                    orderId: doc.id,
                    ...doc.data(),
                })) as Order[];
                setOrders(data);
                if(id && data){
                    const orderItem = data.find(el=> el.orderId == id) 
                    if(orderItem){
                        hundelPress(orderItem)
                    }
                  
                }
            });
        return () => subscriber();
    }, []);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["70%", "95%"], []);
    const dismiss = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
        setSelectedOrder(null)
    }, []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const hundelPress = (item: Order) => {
        setSelectedOrder(item)
        bottomSheetModalRef.current?.present();
    }
    return (<View className="flex-1" style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 bg-white py-5 relative">
            <View className="flex-1">
                <View className="px-5  gap-7 flex-row items-center">
                    <BackBtn />
                    <Text className="text-xl opacity-65 font-600 ">
                        Orders
                    </Text>
                </View>
                <Animated.FlatList className="mt-6 flex-grow-0" data={orderStatuses}
                    contentContainerStyle={{ gap: 10, paddingHorizontal: 20, }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item, index }) => (
                        <StatusBtn el={item} active={active} setActive={setActive} />
                    )} />
                {/* <View className="px-5 flex-row mt-6 gap-5">
                    <StatusBtn el={"all"} active={active} setActive={setActive} />
                    {orderStatuses.map((el) => (
                        <StatusBtn key={el} el={el} active={active} setActive={setActive} />
                    ))}
                </View> */}
                <FlatList
                    className="w-full flex-1 mt-10"
                    data={orders.filter(el=> el.status == active)}
                    contentContainerStyle={{ gap: 25 }}

                    keyExtractor={(item) => item.orderId}
                    renderItem={({ item, index }) => (
                        <OrderItem setSelectedOrder={hundelPress} item={item} />
                    )}
                />
            </View>


        </SafeAreaView>

        <BottomSheetModal enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            backgroundStyle={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                shadowOpacity: 0.44,
                shadowRadius: 10.32,
                elevation: 20,
            }}
            snapPoints={snapPoints}
            ref={bottomSheetModalRef}
        >
            <BottomSheetScrollView  >
                {selectedOrder && <OrderDetail dismiss={dismiss} item={selectedOrder} />}
            </BottomSheetScrollView>
        </BottomSheetModal></View>
    );
};

export default Orders;

type ItemProps = {
    item: Order;
    setSelectedOrder: (e: Order) => void
};

const OrderItem = ({ item, setSelectedOrder }: ItemProps) => {
    const address = `${item.deliveryAddress.addressLine}, ${item.deliveryAddress.city}, ${item.deliveryAddress.country}, ${item.deliveryAddress.zipCode}`
    return (
        <Pressable onPress={() => setSelectedOrder(item)} className="mx-5 bg-white border border-neutral shadow-2xl rounded-2xl py-5 px-4">
            <View className="flex-row flex-1 gap-5 items-start">
                <View className="size-[70px]">
                    {item.items.map((prod, index) => {
                        const size = item.items.length;
                        const opacity = (size - index) / size;
                        return (
                            <View
                                style={{
                                    right: (size - 1 - index) * -5,
                                    opacity,
                                    zIndex: size - index,
                                    transformOrigin: "left",
                                    transform: [{ scale: 1 - index * 0.1 }],
                                }}
                                key={prod.productId}
                                className="absolute shadow-xl border border-meuted/60 top-0 size-full p-1 rounded-lg bg-neutral"
                            >
                                <Image className="size-full" source={{ uri: prod.img }} />
                            </View>
                        );
                    })}
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-lg font-700">#23456789</Text>
                    <Text numberOfLines={1} className="opacity-40 text-sm mt-1 font-400">{address}</Text>
                    <Text className="mt-2 font-600">{item.items.length} Items</Text>
                </View>
                <View className="bg-gray-100 rounded-lg mb-auto py-1.5 px-3"><Text className="text-sm text-gray-600">{item.status}</Text></View>
            </View>
            <View className="h-[1px] w-full bg-neutral mt-5 mb-3" />
            <View className="flex-row items-center justify-between">
                <Text className="opacity-75 font-sm">{formatDate(item.createdAt)}</Text>
                <Text className="text-lg font-700 font-bold">{formatPrice(item.totalAmount)}</Text>
            </View>


        </Pressable>
    );
};

const OrderDetail = ({ item, dismiss }: {item: Order, dismiss: () => void}) => {
    const stateIndex = orderStatuses.findIndex(state => state == item.status)
    const { width } = Dimensions.get("window")
    return (
        <MotiView className="w-full " style={{ width: width, maxWidth: width }} >
            <View style={{ width: width, paddingHorizontal: 20 }} className=" border-b border-b-gray-200 pb-4 flex-row items-center justify-between">
                <View>
                    <Text className="font-bold text-xl font-700">#23456789</Text>
                    <Text className="opacity-60 font-400">Order details</Text>
                </View>
                <Pressable onPress={dismiss} className="size-10 items-center justify-center">
                    <X color={"#222"} />
                </Pressable>
            </View>
            <View className="px-5 py-5 border-b border-b-gray-200">
                <Text className="opacity-60 text-lg font-400">Items</Text>
                <View className="mt-5 gap-5">
                    {item.items.map((prod, index) => (
                        <View className="flex-row gap-5" key={prod.productId}>
                            <View className="flex-row gap-5 " >
                                <View

                                    key={prod.productId}
                                    className="size-16 p-1 rounded-lg bg-neutral"
                                >
                                    <Image className="size-full" source={{ uri: prod.img }} />
                                </View>

                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center justify-between gap-5 ">
                                    <Text  numberOfLines={1} className=" text-lg flex-1 font-medium font-500" >{prod.name}</Text>
                                    <Text className="text-xl  font-bold font-700">
                                        {formatPrice(prod.total)}</Text>
                                </View>
                                <View className="flex-row items-center mt-1 justify-between">
                                    <Text className="text-sm opacity-60 font-400" >{formatPrice(prod.price)}  |  {prod.category}  |  1kg</Text>
                                    <Text className=" font-medium text-sm font-500 ">Qty : {prod.quantity}</Text>
                                </View>
                            </View>




                        </View>
                    ))}
                </View>
            </View>
            <View className="px-5 gap-4 py-5 border-b border-b-gray-200">
                <View className="flex-row gap-1 items-center">
                    <Clock9 size={16} color={"#222"} />
                    <Text className="opacity-65">Delivery In : </Text>
                    <Text className="pl-2">{item.deliveryDuration} min</Text>
                </View>
                <View className="flex-row gap-1 items-center">
                    <MapPinHouse size={16} color={"#222"} />
                    <Text className="opacity-65">Delivery Address :</Text>
                    <Text className="pl-2">{item.deliveryAddress.addressLine}</Text>
                </View>

            </View>
            <View className="px-5 gap-4 py-5 border-b border-b-gray-200">
                <Text className="opacity-60 font-400 text-lg">Order Satuts</Text>
                {item.status != "cancelled" ? <View className="pl-12">

                    <View className="absolute top-0  left-0 h-full justify-between pt-2.5 pb-2">
                        <View style={{ backgroundColor: "#eee" }} className="absolute top-3  left-3 w-1 h-[95%]">
                            <View style={{ height: `${stateIndex * 50}%` }} className="bg-primary absolute top-0  left-0 w-full" />
                        </View>
                        {[0, 1, 2].map(el => (
                            <MotiView animate={{ backgroundColor: stateIndex >= el ? "#4aa556" : "#eee" }} className="size-7 rounded-full justify-center items-center bg-gray-400" key={"state-" + el}>
                                <Check size={14} color={"#fff"} />
                            </MotiView>)
                        )}
                    </View>

                    <View className="flex-row justify-between items-center">
                        <View className="">
                            <Text className="text-500 font-medium text-lg">Order Placed</Text>
                            <Text className="text-400 text-sm opacity-50">{formatDate(item.createdAt, true)}</Text>
                        </View>
                        <NotepadText size={25} strokeWidth={1.4} color={"#222"} />

                    </View>
                    <View className="flex-row justify-between mt-5 items-center">
                        <View className="">
                            <Text className="text-500 font-medium text-lg">shipped</Text>
                            <Text className="text-400 text-sm  opacity-50">{item.shippedAt  ? formatDate(item.shippedAt, true) :"Pending ..."}</Text>
                        </View>
                        <Bike size={25} strokeWidth={1.4} color={"#222"} />
                    </View>
                    <View className="flex-row justify-between mt-5 items-center">
                        <View className="">
                            <Text className="text-500 font-medium text-lg">Dilivered</Text>
                            <Text className="text-400 text-sm  opacity-50">{item.deliveredAt  ? formatDate(item.deliveredAt) :`Expected at ${formatDate(item.createdAt, true, item.deliveryDuration)}`}</Text>
                        </View>
                        <PackageCheck size={25} strokeWidth={1.4} color={"#222"} />
                    </View>

                </View> :
                    <View className="flex-row justify-between items-center">
                        <View className="">
                            <Text className="text-500 font-medium capitalize text-lg">cancelled</Text>
                            <Text className="text-400 text-sm opacity-50">{formatDate(item.createdAt)}</Text>
                        </View>
                        <Ban size={25} strokeWidth={1.4} color={"red"} />
                    </View>
                }

            </View>
            <View className="px-5 gap-2 py-5 border-b border-b-gray-200">

                <View className="flex-row items-center gap-3">
                    <Text className="flex-1 font-500 opacity-60 font-medium">
                        SubTotal
                    </Text>
                    <Text className="text-lg font-600 font-semibold">
                        {formatPrice(item.subTotal)}
                    </Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <Text className="flex-1  font-500 opacity-60 font-medium">
                        Delivery
                    </Text>
                    <Text className="text-lg font-600 font-semibold">
                        {formatPrice(item.delivery)}
                    </Text>
                </View>
                <View className="flex-row items-center  gap-3">
                    <Text className="flex-1 font-600 font-medium">
                        Total
                    </Text>
                    <Text className="text-lg text-black font-600 font-semibold">
                        {formatPrice(item.totalAmount)}
                    </Text>
                </View>
            </View>
        </MotiView>
    )
}

type StatusBtnType = {
    active: Status;
    el: Status
    setActive: (v: Status) => void
}
const StatusBtn = ({ active, el, setActive }: StatusBtnType) => {
    return (
        <Pressable
            onPress={() => setActive(el)}
            key={el}
            className="min-w-32"
        >
            <MotiView
                animate={{ backgroundColor: active == el ? "#4aa556" : "#fff", opacity: active == el ? 1 : .6, }}
                className="py-2 px-5  w-full rounded-[40px]"
            >
                <MotiText
                    style={{ color: active == el ? "#fff" : "#333" }}
                    className="text-center capitalize text-lg  font-500"
                >
                    {el}
                </MotiText>
            </MotiView>
        </Pressable>
    )
}