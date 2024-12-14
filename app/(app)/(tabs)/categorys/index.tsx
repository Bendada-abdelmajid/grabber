import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "@/components/back-btn";
import { ArrowDownUp, ChevronDown, MapPin, Search } from "lucide-react-native";
import { TextInput } from "react-native";
import { cats, data, discounts, Product } from "@/constants/data";
import { FlatList } from "react-native";
import ProductCard from "@/components/ProductCard";
import CartBtn from "@/components/cart-btn";
import CatCard from "@/components/cat-card";
import PageWrapper from "@/components/page-wrapper";
import Slider from "@/components/slider";
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
        setSearch(value)
        setResulte(data.filter(el => el.title.includes(search)))
    }
    return (
        <PageWrapper>

            {/* <View className="bg-neutral flex-1 px-3 h-12 flex-row items-center rounded-2xl">
                <Search color={"#8891A5"} size={18} />
                <TextInput value={search} onChangeText={hundelSearch}
                    className="h-full text-black pl-2 flex-1"
                    placeholderTextColor={"#8891A5"}
                    placeholder="Search Products"
                />
            </View> */}
            <Slider/>
            <Text className="mt-6 px-5 text-2xl font-600 font-semibold ">Shop by Categorys</Text>
            <FlatList className='w-full flex-1 px-5 mt-5' data={cats}
                contentContainerStyle={{ gap: 20, }}
                numColumns={3}
                bounces={false}
                overScrollMode="never"
                columnWrapperStyle={{ gap: 20 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                keyExtractor={(item) => item.title}
                renderItem={({ item, index }) => <CatCard item={item} />}
            />


        </PageWrapper>
    );
};

export default search;
