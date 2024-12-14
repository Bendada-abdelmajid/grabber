import {
    View,
    Text,
    ScrollView,
    Pressable,
    FlatList,
    Image,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import BackBtn from "@/components/back-btn";
import { CartItem, useAppContext } from "@/hooks/app-context";
import { Check, CirclePlus, CreditCard, MapPinHouse, ShoppingBag, ShoppingCart } from "lucide-react-native";
import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import firestore from "@react-native-firebase/firestore";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import { formatCardNumber, formatPrice } from "@/libs/utils";
import { AnimatePresence, MotiText, MotiView } from "moti";

import BagIcon from "@/components/bagIcon";
import { BlurView } from "expo-blur";
import { NewOrder, Order } from "@/libs/types";

type ShippingType = {
    name: string;
    description: string;
    icon: string;
    price: number;
    duration: number;
};
const shippingTypes: ShippingType[] = [
    {
        name: "Standard",
        description: "Delivery within 30-40 minutes.",
        icon: "🛒", // Grocery cart for Standard delivery
        price: 2.00,
        duration:40
    },
    {
        name: "Express",
        description: "Delivery within 15-25 minutes.",
        icon: "⚡", // Lightning bolt for Express delivery
        price: 5.99,
        duration:25,
    },
];

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const { user, cart , clearCart } = useAppContext();
    const totale = cart.reduce((a, b) => a + b.total, 0);
    const count = cart.reduce((a, b) => a + b.count, 0);
    const [modal, setModale] = useState<"address" | "cards">("address");
    const [shippingType, setShippingType] = useState(shippingTypes[0]);
    const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
    const totalAmount = totale + shippingType.price
    const router = useRouter()
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
    const activeAddress = user.addresses?.find(
        (el) => el.id == user.activeAddress
    );
    const activeCard = user.creditCards?.find((el) => el.id == user.activeCard);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const dismiss = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const hundelOrder = async () => {
        try {
            setLoading(true)
            // if (activeAddress) {

            //     const newOrder:NewOrder = {
            //         userId: user.uid,
            //         deliveryAddress: activeAddress,
            //         delivery:shippingType.price,
            //         deliveryDuration:shippingType.duration,
            //         subTotal:totale,
            //         totalAmount: totalAmount,
            //         items: cart.map(({product, count, total},i) => ({ name: product.title, price: product.discountPrice ? product.discountPrice: product.price, productId: product.id, total: total, quantity: count, img:product.imageUrl, category:product.category })),
            //         paymentMethod: "CREDIT_CARD",
            //         status: 'confirmed',
            //         createdAt: firestore.Timestamp.now(),
            //     };
            //     const docRef = await firestore().collection('orders').add(newOrder);
            // }
            await clearCart()
            setActive(true)
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        } finally {
            setLoading(false)
        }

    }


    return (

        <AnimatePresence initial={false} >

            <MotiView className="flex-1">
                <SafeAreaView className="flex-1 relative  bg-white ">
                    <View className="flex-1">
                        <LinearGradient
                            locations={[0.2, 1]}
                            colors={["#ffffff", "transparent"]}
                            className="absolute top-0 px-5   z-10 flex-row w-full gap-10 justify-between items-center pt-5 pb-8"
                        >
                            <BackBtn />
                            <Text className="text-center  text-xl font-semibold">Checkout</Text>
                            <View className="size-10" />
                        </LinearGradient>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            overScrollMode="never"
                            className="flex-1 "
                            contentContainerStyle={{ paddingTop: 70, paddingBottom: 110 }}
                        >
                            <View className="flex-1 px-7">
                                <Text className="text-xl opacity-65 font-600 font-semibold mt-3 mb-3">
                                    Shipping Address
                                </Text>

                                {activeAddress ? (
                                    <View className="flex-row flex-1  pt-4  rounded-xl gap-4 ">
                                        <MapPinHouse size={22} className="" color={"#000"} />
                                        <View className="flex-1 -mt-1.5 pr-5">
                                            <Text className="text-lg font-600">
                                                {activeAddress.title}
                                            </Text>
                                            <Text className="text-sm opacity-60  font-400 font-semibold">
                                                {activeAddress.addressLine}, {activeAddress.city},
                                                {activeAddress.country}, {activeAddress.zipCode}
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={() => {
                                                setModale("address");
                                                handlePresentModalPress();
                                            }}
                                            className="my-auto px-4 py-1 border border-primary/60 rounded-3xl"
                                        >
                                            <Text className="text-primary">Change</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <View></View>
                                )}

                                <View className="h-[1px] w-full bg-neutral my-5" />
                                <Text className="text-xl opacity-65 font-600  mb-3">
                                    Shipping Type
                                </Text>
                                <View className=" rounded-xl ">
                                    {shippingTypes.map((el, i) => {
                                        return (
                                            <View
                                                key={el.name}
                                                className={`flex-row  rounded-xl gap-4 py-4  ${i > 0 ? "border-t border-t-neutral" : ""
                                                    } `}
                                            >
                                                <Text className="text-2xl font-600">{el.icon}</Text>
                                                <View className="flex-1 -mt-1.5 ">
                                                    <Text className="text-lg font-600">
                                                        {el.name}{" "}
                                                        <Text className="text-lg  font-400 text-primary">
                                                            - {formatPrice(el.price)}
                                                        </Text>
                                                    </Text>
                                                    <Text className="text-sm opacity-60  font-400 font-semibold">
                                                        {el.description}
                                                    </Text>
                                                </View>
                                                <Pressable onPress={() => setShippingType(el)}>
                                                    <CheckMark active={el.name == shippingType.name} />
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>
                                <View className="h-[1px] w-full bg-neutral my-5" />
                                <Text className="text-xl opacity-65 font-600  mb-3">
                                    Pyement Method
                                </Text>
                                <View className="flex-row flex-1 mt-4    rounded-xl gap-4 ">
                                    <CreditCard size={20} color={"#4aa556"} />
                                    <View className="flex-1 -mt-1.5 ">
                                        <Text className="text-lg font-600">
                                            {activeCard?.nameOnCard}
                                        </Text>
                                        <Text className="text-sm opacity-60  font-400 font-semibold">
                                            {formatCardNumber(activeCard?.cardNumber || "0")}
                                        </Text>
                                    </View>
                                    <Pressable
                                        onPress={() => {
                                            setModale("cards");
                                            handlePresentModalPress();
                                        }}
                                        className="my-auto px-4 py-1 border border-primary/60 rounded-3xl"
                                    >
                                        <Text className="text-primary">Change</Text>
                                    </Pressable>
                                </View>
                                <View className="h-[1px] w-full bg-neutral mt-5 mb-7" />
                                <Text className="text-xl opacity-65 font-600  mb-5 font-medium">
                                    Order Summary ({count} items)
                                </Text>
                                <View className="rounded-xl border border-neutral px-5  flex-1 ">
                                    <View className="flex-row items-center py-4 gap-3 border-b border-b-neutral">
                                        <Text className="flex-1 text-lg font-500 opacity-60 font-medium">
                                            Sub Total
                                        </Text>
                                        <Text className="text-lg font-600 font-semibold">
                                            {formatPrice(totale)}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center border-b border-b-neutral py-4 gap-3">
                                        <Text className="flex-1 text-lg font-500 opacity-60 font-medium">
                                            Delivery
                                        </Text>
                                        <Text className="text-lg font-600 font-semibold">
                                            {formatPrice(shippingType.price)}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center py-4 gap-3">
                                        <Text className="flex-1 text-lg font-500 opacity-60 font-medium">
                                            Total
                                        </Text>
                                        <Text className="text-xl font-600 font-semibold">
                                            {formatPrice(totalAmount)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 80,
                            },
                            shadowOpacity: 0.44,
                            shadowRadius: 10.32,
                            elevation: 30,
                        }}
                        className="absolute bg-white bottom-0 border-t border-t-neutral py-5 px-5 left-0 right-0 "
                    >
                        <Pressable className="h-full flex-row gap-5 bg-primary w-full py-4 rounded-[40px] items-center justify-center "
                            onPress={hundelOrder}


                        >
                            {loading ? <ActivityIndicator color={"#fff"}/> :<ShoppingCart color={"#fff"} />}
                            <Text className="text-center font-500 text-xl text-white">
                                Place Order
                            </Text>

                        </Pressable>
                    </View>
                </SafeAreaView>
                <BottomSheetModal
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
                    snapPoints={[350]}
                    ref={bottomSheetModalRef}
                >
                    <BottomSheetView style={{ flex: 1 }}>
                        {modal === "cards" && <ToogelCard dismiss={dismiss} />}

                        {modal === "address" && <ToogelAddress dismiss={dismiss} />}
                    </BottomSheetView>
                </BottomSheetModal>
            </MotiView>
            {active && <MotiView from={{ opacity: 0, }} animate={{ opacity: 1 }} transition={{duration:1000}}  key={"success"} className="absolute  inset-0 flex-1 bg-white items-center justify-center">
                <MotiView from={{ scale: .7, opacity: 0, }} animate={{ scale: 1, opacity: 1 }} className="w-[85%] blur-3xl bg-white rounded-lg p-10">
                    <MotiView from={{ scale: .7 }} animate={{ scale: 1 }} transition={{duration:2000}} className="size-32 bg-primary/30 mx-auto p-4 rounded-full">

                        <View className="size-full bg-primary   rounded-full items-center justify-center" >
                            <BagIcon size={50} color="#fff" />
                        </View>

                    </MotiView>


                    <Text className="font-700 font-bold text-5xl text-center mt-14">Order Place</Text>
                    <Text className="font-700 font-bold text-5xl text-center mt-0.5">Successfully</Text>
                    <Text className="font-500 text-center mt-3 ">You have Successfully made order</Text>
                    <Pressable onPress={() => router.push({pathname:"/orders", params:{id:"FGlBuVXrFIon3Xq7oa1B"}})} className="mt-8 bg-primary py-4 rounded-[40px] ">
                        <Text className="font-500 text-center text-white ">View Order Status</Text>
                    </Pressable>
                </MotiView>
              

            </MotiView>}
        </AnimatePresence>

    );
};

export default Checkout;

const ToogelCard = ({ dismiss }: { dismiss: () => void }) => {
    const { user, cart } = useAppContext();
    const hundelActive = (id: string) => {
        firestore()
            .collection("users")
            .doc(user.uid)
            .update({
                activeAddress: id,
            })
            .then(() => {
                dismiss();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View className="px-7  py-3 flex-1 ">
            <Text className=" text-xl font-600 mb-2">Choose Credit Card</Text>
            <BottomSheetFlatList
                className="flex-1 "
                contentContainerStyle={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                data={user.creditCards}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                    <Pressable
                        onPress={() => hundelActive(item.id)}
                        className={`flex-row  rounded-xl gap-4 py-6 justify-between ${index > 0 ? "border-t border-t-neutral" : ""
                            }`}
                    >
                        <View>
                            <Text className="font-400 mb-1 opacity-60 ">
                                {item.nameOnCard}
                            </Text>
                            <Text className="text-xl font-600 font-semibold">
                                {formatCardNumber(item.cardNumber)}
                            </Text>
                        </View>
                        <CheckMark active={user.activeCard == item.id} />
                    </Pressable>
                )}
            />
            <Link onPress={dismiss} href={{ pathname: "/add-card" }} className="px-5">
                <View className="py-4 w-full bg-neutral rounded-[40px] flex-row items-center gap-3 justify-center">
                    <CirclePlus size={20} color={"#4b5563"} />
                    <Text className="text-xl text-center font-500 font-medium text-gray-600 ">
                        Add Card
                    </Text>
                </View>
            </Link>
        </View>
    );
};
const ToogelAddress = ({ dismiss }: { dismiss: () => void }) => {
    const { user, cart } = useAppContext();
    const hundelActive = (id: string) => {
        firestore()
            .collection("users")
            .doc(user.uid)
            .update({
                activeAddress: id,
            })
            .then(() => {
                dismiss();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <View className="px-7 py-3 flex-1">
            <Text className="text-xl font-600 mb-5">Choose Address</Text>

            <BottomSheetFlatList
                className="flex-1 "
                contentContainerStyle={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                data={user.addresses}
                keyExtractor={(item, index) => item.id}
                renderItem={({ item, index }) => (
                    <View
                        className={`flex-row  rounded-xl gap-4 py-6 ${index > 0 ? "border-t border-t-neutral" : ""
                            }`}
                    >
                        <View className="flex-1 -mt-1.5 ">
                            <Text className="text-lg font-600">{item.title}</Text>
                            <Text className="text-sm opacity-60  font-400 font-semibold">
                                {item.addressLine}, {item.city},{item.country}, {item.zipCode}
                            </Text>
                        </View>
                        <Pressable onPress={() => hundelActive(item.id)}>
                            <CheckMark active={user.activeAddress == item.id} />
                        </Pressable>
                    </View>
                )}
            />
            <Link
                onPress={dismiss}
                href={{ pathname: "/add-address", params: { return: "true" } }}
                className="px-5"
            >
                <View className="py-4 w-full bg-neutral rounded-[40px] flex-row items-center gap-3 justify-center">
                    <CirclePlus size={20} color={"#4b5563"} />
                    <Text className="text-xl text-center font-500 font-medium text-gray-600 ">
                        Add Address
                    </Text>
                </View>
            </Link>
        </View>
    );
};

const CheckMark = ({ active }: { active: boolean }) => {
    const activeValue = useSharedValue(0);
    useEffect(() => {
        activeValue.value = withSpring(active ? 1 : 0, {
            stiffness: 200,
            damping: 20,
        });
    }, [active]);
    const checkStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(activeValue.value, [0, 1], [0, 1]),
                },
            ],
        };
    });
    return (
        <View className="size-8 items-center justify-center rounded-full border border-primary/70">
            <Animated.View
                style={checkStyles}
                className="size-4 rounded-full bg-primary/70"
            />
        </View>
    );
};
{
    /* {[...Array(3).keys()].map((i) => (
                <MotiView key={i}
                  from={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 4 }}
                  transition={{type:"timing", duration:2000, delay:i*400, easing:Easing.out(Easing.ease), loop:true, repeatReverse:false}}
                  className="absolute inset size-full bg-primary  rounded-full"
                />
              ))} */
}
const OrderBtn = () => {
    const { height } = Dimensions.get("window");
    const [active, setActive] = useState(false);
    const easing = Easing.bezier(0.25, -0.5, 0.25, 1);
    return (
        <>
            <View
                // style={{
                //     shadowColor: "#000",
                //     shadowOffset: {
                //         width: 0,
                //         height: 80,
                //     },
                //     shadowOpacity: 0.44,
                //     shadowRadius: 10.32,
                //     elevation: 30,
                // }}
                className="absolute bg-white bottom-0 border-t border-t-neutral h-20  left-0 right-0 "
            ></View>

            <MotiView
                className="absolute bottom-3  left-5 right-5 z-50 flex-col items-center justify-center"
                transition={{ type: "timing", duration: 1000, easing: Easing.ease }}
                animate={{ height: active ? height : 50 }}
            >
                <MotiView
                    className="absolute size-full bg-primary  rounded-[40px] inset-0 "
                    transition={{ type: "timing", duration: 1000, easing: Easing.ease }}
                    animate={{ scale: active ? 5 : 1, }}
                />



                <Pressable className="h-full w-full items-center justify-center "
                    onPress={() => setActive(!active)}


                > <AnimatePresence exitBeforeEnter>
                        <Text key={"text"} className="text-center font-500 text-xl text-white">
                            Place Order
                        </Text>
                    </AnimatePresence>
                </Pressable>
            </MotiView>
        </>
    );
};
