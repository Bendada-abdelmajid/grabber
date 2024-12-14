import { View, Text, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BackBtn from '@/components/back-btn';

import { data, discounts, Product } from '@/constants/data';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react-native';
import firestore from "@react-native-firebase/firestore";
const Category = () => {
  const { slug } = useLocalSearchParams();
  const router = useRouter()
  const [products, setProducts]= useState<Product[]>([])
  const getDiscountedProducts = async () => {
    try {
      const snapshot = await firestore()
        .collection('products')
        .where('category', '==', slug)
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
    getDiscountedProducts()
  }, [slug])
  
  return (
    <SafeAreaView className='flex-1 relative  bg-white pt-15 px-5'>
      <View className='flex-1'>
        <LinearGradient
          locations={[.2, 1]} colors={["#ffffff", "transparent"]} className='absolute top-0   z-10 flex-row w-full justify-between items-center pt-5 pb-8'>
          <BackBtn />
          <Text className='text-center text-2xl font-semibold'>{slug}</Text>
          <Pressable onPress={() => router.push("/search")} className="size-11 rounded-full items-center justify-center bg-neutral">
            <Search size={20} strokeWidth={1.3} color={"#222"} />
          </Pressable>
        </LinearGradient>
        <FlatList showsVerticalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full flex-1' data={products}
          contentContainerStyle={{ paddingTop: 90, paddingBottom: 100, gap: 25 }}
          numColumns={2}
          columnWrapperStyle={{ gap: 20 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ProductCard index={index} item={item} />}
        /></View>
    </SafeAreaView>
  )
}

export default Category