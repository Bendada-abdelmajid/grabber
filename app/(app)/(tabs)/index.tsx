import CartBtn from '@/components/cart-btn';
import ProductCard from '@/components/ProductCard';
import Slider from '@/components/slider';
import { cats, Product } from '@/constants/data';
import { Link, useRouter } from 'expo-router';
import { ChevronDown, MapPin, Search, Settings2 } from 'lucide-react-native';
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from 'react';
import SearchIcon from '@/components/icons/search-icon';
import PageWrapper from '@/components/page-wrapper';

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([])
  const getDiscountedProducts = async () => {
    try {
      const snapshot = await firestore()
        .collection('products')
        .where('discountPrice', '!=', null)
        .orderBy("discountPrice")
        .limit(8) // Fetch where discountPrice is not null
        .get();

      const discountedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(discountedProducts as Product[]);
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      throw error;
    }
  };
  useEffect(() => {
    getDiscountedProducts()

  }, [])

  return (
    <PageWrapper>
          <Link href={"/search"}  className='flex-1 mt-5 mx-5 '>
            <View className='bg-neutral flex-1 px-4 h-12 flex-row items-center rounded-[40px]'>
            <SearchIcon color={"#A1A1AB"} size={20}  />
            <Text className=' text-meuted pl-2  font-300 font-light flex-1'>Search</Text>
            </View>
          </Link>

          
        <View className='mt-7 '>
          <View className='px-5 flex-row items-center justify-between'>
            <Text className='text-xl text-gray-900 font-medium'>Shop by Category</Text>
            <Pressable className=' '>
              <Text className='border-b border-b-green-900'>See All</Text>
            </Pressable>
          </View>
          <View className='px-3 mt-3 flex-row flex-wrap '>
            {cats.map(el => (
              <View key={el.title} className='w-1/4 px-2 mb-3'>
                <View className='bg-neutral rounded-lg w-full aspect-square justify-center items-center'>
                  <Image className='object-contain size-[90%]' resizeMode='contain' source={el.img} />
                </View>
                <Text className='text-center mt-1'>{el.title}</Text>

              </View>
            ))}
          </View>
        </View>
        <Slider />
        <View className='mt-7'>
          <View className='px-5 mb-4 flex-row items-center justify-between'>
            <Text className='text-xl text-gray-900 font-medium'>Best Deal</Text>
            <Pressable className=' '>
              <Text className='border-b border-b-green-900'>See All</Text>
            </Pressable>
          </View>
          <FlatList className='w-full' data={products}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 25 }}
            numColumns={2}

            columnWrapperStyle={{ gap: 20 }}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
          />
        </View>



    </PageWrapper>
  );
}

