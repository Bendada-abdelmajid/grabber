import { View, Text, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "@/components/back-btn";
import { useAppContext } from "@/hooks/app-context";
import { Card } from "@/libs/types";
import { Check, CirclePlus } from "lucide-react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";
import firestore from '@react-native-firebase/firestore';
const formatCardNumber = (cardNumber: string): string => {
  // Use a regular expression to group digits into chunks of 4 and add 3 spaces between them.
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1   ');
};
const creditCards = () => {
  const { user } = useAppContext();

  return (
    <SafeAreaView className="flex-1 bg-white pt-5 pb-10 ">
      <View className="flex-row items-center gap-5 px-5 mb-10">
        <BackBtn />
        <Text className="text-2xl">Credit cards</Text>
      </View>
      <FlatList className="flex-1" contentContainerStyle={{ gap: 20 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        data={user.creditCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
      />
      <Link href="/add-card" className="px-5"><View className="py-4 w-full bg-primary rounded-[40px] flex-row items-center gap-3 justify-center">
        <CirclePlus size={20} color={"#fff"} />
        <Text className="text-xl text-center font-500 font-medium text-white ">Add Card</Text>
      </View>
      </Link>
    </SafeAreaView>
  );
};

export default creditCards;
type ItemProps = {
  item: Card;
  index: number;
};
const Item = ({ item, index }: ItemProps) => {
  const { user } = useAppContext()
  const router = useRouter()
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
        ["#eee", "#000"] // Map values between 0 (light color) and 255 (dark color)
      ),
    };
  });

  return (
    <View className="flex-row flex-1 bg-white mx-5 shadow-2xl border border-neutral rounded-xl p-5 justify-between">
      <View>
 
        <Text className="text-lg font-400 mb-2 opacity-60 ">{item.nameOnCard}</Text>
        <Text className="text-2xl font-600 font-semibold">{formatCardNumber(item.cardNumber)}</Text>
      </View>
      <View className="justify-between items-end">
        <Pressable onPress={hundelActive}>
          <Animated.View style={checkStyles} className="size-8 items-center justify-center -mr-1 -mt-2 rounded-full ">
            {user.activeCard == item.id  && <Check color={"#fff"} size={15} />}
          </Animated.View>
        </Pressable>
        <Pressable className="px-1 " onPress={() => router.push({ pathname: "/add-card", params: { cardId: item.id } })}>
          <Text className="text-primary">Edit</Text>
        </Pressable>
      </View>
    </View>
  );
};
