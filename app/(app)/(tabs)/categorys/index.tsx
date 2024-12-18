import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "@/components/back-btn";
import { ArrowDownUp, ChevronDown, MapPin, Search, Settings2 } from "lucide-react-native";
import { TextInput } from "react-native";
import { cats, data, discounts, Product } from "@/constants/data";
import { FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import CatCard from "@/components/cat-card";
import PageWrapper from "@/components/page-wrapper";
import Slider from "@/components/slider";
import ProductCard from "@/components/ProductCard";
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
    const [products, setProducts] = useState<Product[]>([])
    const [selected, setSelected] = useState(cats[0]);
    const hundelSearch = (value: string) => {
        setSearch(value)
        setResulte(data.filter(el => el.title.includes(search)))
    }
    const getProducts = async () => {
        try {
            const snapshot = await firestore()
                .collection('products')
                .where('category', '==', selected.title)
                .get();

            const discountedProducts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(discountedProducts as Product[]);
        } catch (error) {
            console.error('Error fetching  products:', error);
            throw error;
        }
    };
    useEffect(() => {
        getProducts()
    }, [selected])

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
            {/* <Slider /> */}
            {/* <Text className="mt-6 px-5 text-2xl font-600 font-semibold ">Shop by Categorys</Text> */}
            <FlatList className='w-full flex-1 mt-5' data={cats}
                contentContainerStyle={{ gap: 15,paddingHorizontal:18 }}
                horizontal
                bounces={false}
                overScrollMode="never"
              
                showsHorizontalScrollIndicator={false}
              
                keyExtractor={(item) => item.title}
                renderItem={({ item, index }) => <CatCard selected={selected} setSelected={setSelected} item={item} />}
            />
            <View className="flex-row px-5 mt-7 items-center justify-between">
              <Text className="capitalize flex-1"> more then {products.length} products</Text>
              <Pressable className="px-4 flex-row gap-2 items-center  py-2 bg-black rounded-3xl">
              <Settings2 size={16} color={"#fff"} />
                <Text className="text-white">Filter</Text></Pressable>
            </View>
            <FlatList showsVerticalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full px-5 mt-5 flex-1' data={products}
                contentContainerStyle={{ gap: 25 }}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ gap: 20 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <ProductCard index={index} item={item} />}
            />

        </PageWrapper>
    );
};

export default search;
