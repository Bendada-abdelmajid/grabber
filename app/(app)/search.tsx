import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "@/components/back-btn";
import { ArrowDownUp, CircleX, Search, SearchIcon } from "lucide-react-native";
import { TextInput } from "react-native";
import { data, discounts, Product } from "@/constants/data";
import { FlatList } from "react-native";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "expo-router";
const recentSearches = [
  "Fresh Produce",
  "Dairy Products",
  "Organic Foods",
  "Snacks & Beverages",
  "Household Essentials",
  "Weekly Deals",
];

const search = () => {

  const [resulte, setResulte] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const hundelSearch = (value: string) => {
    setSearch(value);
    setResulte(data.filter((el) => el.title.includes(search)));
  };
  return (
    <SafeAreaView className="flex-1 bg-white pt-5">
      {/* <View className="flex-row w-full items-center justify-between gap-4 px-5 pb-5">
        <BackBtn />
        <Text className="font-500 font-medium text-xl">Search</Text>
        <Pressable className="size-11 rounded-full  items-center justify-center ">
          <ArrowDownUp size={18} strokeWidth={1.3} color={"#222"} />
        </Pressable>
      </View> */}
      <View className="flex-row w-full items-center  gap-4 px-5 pb-1">
        <View className='bg-neutral  px-4 h-12 flex-1 flex-row items-center rounded-[40px]'>
          <Search color={"#8891A5"} size={20} />
          <TextInput
            value={search}
            onChangeText={hundelSearch}
            className="h-full font-500 text-black pl-2 flex-1"
            placeholderTextColor={"#8891A5"}
            placeholder="Search Products"
          />
        </View>
        <Pressable>
          <Text className="font-500 text-black">Cancel</Text>
        </Pressable>
      </View>

      {search.length > 0 ? (
        resulte.length > 0 ?
          <FlatList
            className="w-full flex-1"
            data={resulte}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 30,
              gap: 15,
            }}
            numColumns={2}
            bounces={false}
            overScrollMode="never"
            columnWrapperStyle={{ gap: 15 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ProductCard item={item} index={index} />
            )}
          /> : <View className="flex-1 items-center pb-16 justify-center">
           
            <Text className="text-center text-xl text-black font-medium font-500 mt-5 max-w-[300px]">Looks like we came up empty.</Text>
            <Text className="text-center text-xl text-black/70 font-medium font-500  max-w-[300px]">Let's tweak the search!</Text>

          </View>
      ) : (
        <View className="flex-1">
          {/* <View className="flex-row mt-7 mb-3 pb-2 border-b border-b-neutral items-center justify-between mx-5">
            <Text className="text-2xl    font-medium font-500">
              Recent
            </Text>
          </View>
          <View className="gap-y-5  px-5">
            {recentSearches.map((el, i) => (
              <View key={"recentSearches-" + i} className="flex-row gap-5 items-center justify-between ">
                <Pressable
                  className=" flex-row flex-1"

                >
                  <Text className="font-400">{el}</Text>
                </Pressable>

                <Pressable
                  className="flex-row ">

                </Pressable>
              </View>
            ))}
          </View> */}

          {/* <Text className="text-xl font-500  px-5  mb-5 font-medium">
            Trending Now
          </Text>
         
            <FlatList
              className="flex-1 "
              data={discounts.slice(0, 9)}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                gap: 15,
              }}
              numColumns={2}
              bounces={false}
              overScrollMode="never"
              columnWrapperStyle={{ gap: 15 }}
              showsVerticalScrollIndicator={false}
         
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <ProductCard item={item} index={index} />
              )}
            /> */}

        </View>
      )}
    </SafeAreaView>
  );
};

export default search;
