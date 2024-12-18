import CartBtn from '@/components/cart-btn';
import PageWrapper from '@/components/page-wrapper';
import ProductCard from '@/components/ProductCard';
import { cats, discounts, Product } from '@/constants/data';
import { useAppContext } from '@/hooks/app-context';
import { Dumbbell, Minus, Plus, SearchIcon } from 'lucide-react-native';

import { MotiText, MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text } from 'react-native';

import { Pressable, View } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function TabTwoScreen() {
  const { favorites } = useAppContext()
  const [loading, setLoading] = useState(true)
  const filters = ["all", ...cats.map(el => el.title)]
  const [active, setActive] = useState("all");
  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <PageWrapper >
      {/* <View className='absolute top-0 left-0 right-0 h-40 bg-neutral' /> */}
      <View className='flex-1 px-5 '>
        {/* <View className='flex-row mt-5  items-center justify-between'>
          <Text className='text-3xl font-500 font-medium'>Wishlist</Text>
          <CartBtn />
        </View> */}
        <View className='bg-neutral mt-7 px-4 h-14 flex-row items-center rounded-[40px]'>
          <SearchIcon color={"#A1A1AB"} size={20} />
          <Text className=' text-meuted pl-2  font-300 font-light flex-1'>Search</Text>
        </View>


        {/* <FlatList showsHorizontalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full mt-5 flex-1' data={filters}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          horizontal
          keyExtractor={(item) => "filter-" + item}
          renderItem={({ item, index }) => <FilterBtn el={item} active={active} setActive={setActive} />}
        /> */}
        <FlatList showsVerticalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full mt-10' data={favorites}
          contentContainerStyle={{ paddingBottom: 100, gap: 25 }}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 20 }}

          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ProductCard index={index} item={item} />}
        />
      </View></PageWrapper>
  );
}
type CardProp = {
  item: Product;

};

type FilterBtnType = {
  active: string;
  el: string
  setActive: (v: string) => void
}

const FilterBtn = ({ active, el, setActive }: FilterBtnType) => {
  const activeValue = useSharedValue(0)
  useEffect(() => {
    activeValue.value = withTiming(active == el ? 1 : 0, { duration: 300 })
  }, [active])

  const btnAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        activeValue.value,
        [0, 1],
        [.6, 1]
      ),
      backgroundColor: interpolateColor(
        activeValue.value,
        [0, 1],
        ["transparent", "#4aa556"]
      )
    }
  })
  return (
    <Pressable
      onPress={() => setActive(el)}
      key={el}
      className=""
    >
      <Animated.View style={btnAnimation}
        // animate={{ backgroundColor: active == el ? "#4aa556" : "#fff", opacity: active == el ? 1 : .6, }}
        className="py-1.5 px-6  w-full rounded-[40px]"
      >
        <Text
          style={{ color: active == el ? "#fff" : "#333" }}
          className="text-center capitalize text-lg  font-500"
        >
          {el}
        </Text>
      </Animated.View>
    </Pressable>
  )
}