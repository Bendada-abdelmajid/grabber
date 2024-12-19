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
  const uniqueCategories = [...new Set(favorites.map(product => product.category))];
  const filters = ["all", ...uniqueCategories]
  const [active, setActive] = useState("all");
  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>

      <PageWrapper >
  
        <View className='flex-1  '>
       


          <FlatList showsHorizontalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full mt-5 flex-1' data={filters}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            horizontal
            keyExtractor={(item) => "filter-" + item}
            renderItem={({ item, index }) => <FilterBtn el={item} active={active} setActive={setActive} />}
          />
          <FlatList showsVerticalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full px-5 mt-7' data={favorites}
            contentContainerStyle={{ gap: 15 }}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 15 }}

            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <ProductCard index={index} item={item} />}
          />
        </View></PageWrapper>
      <Pressable className='py-3.5 w-[90%] border  rounded-[40px]  left-[5%] absolute bottom-24 bg-white'>
        <Text className='text-center text-xl font-500 font-medium tracking-wider'>Add All ({favorites.length})</Text>
      </Pressable>
    </>
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
        ["#0000", "#111"]
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
        className="py-2 px-4 border   w-full rounded-[40px]"
      >
        <Text
          style={{ color: active == el ? "#fff" : "#333" }}
          className="text-center capitalize font-500"
        >
          {el}
        </Text>
      </Animated.View>
    </Pressable>
  )
}