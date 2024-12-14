import CartBtn from '@/components/cart-btn';
import PageWrapper from '@/components/page-wrapper';
import ProductCard from '@/components/ProductCard';
import { cats, discounts, Product } from '@/constants/data';
import { useAppContext } from '@/hooks/app-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Archive, ChevronLeft, Heart, Plus } from 'lucide-react-native';
import { MotiText, MotiView } from 'moti';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { Text } from 'react-native';
import { StyleSheet, Image, Platform, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TabTwoScreen() {
  const { favorites } = useAppContext()
  const filters=["all", ...cats.map(el=>el.title)]
  const [active, setActive] = useState("all");
  return (
    <PageWrapper>
       <FlatList showsHorizontalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full mt-5 flex-1' data={filters}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
       horizontal
        keyExtractor={(item) => "filter-"+item}
        renderItem={({ item, index }) => <FilterBtn el={item} active={active} setActive={setActive}/>}
      />
      <FlatList showsVerticalScrollIndicator={false} bounces={false} overScrollMode='never' className='w-full mt-7 px-5 flex-1' data={discounts}
        contentContainerStyle={{ paddingBottom: 100, gap: 25 }}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={{ gap: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ProductCard index={index} item={item} />}
      />
    </PageWrapper>
  );
}
type CardProp = {
  item: Product;

};
const Card = ({ item }: CardProp) => {
  return (
    <View className="flex-1 flex-row justify-center gap-5 bg-white rounded-xl border border-neutral p-2">
      <View className=" w-28 h-24 justify-center items-center bg-neutral rounded-xl">
        <Image className="size-20" source={{ uri: item.imageUrl }} />

      </View>
      <View className='flex-1 flex-row justify-between'>

        <View className="flex-1 bg-b">
          <Text className="font-semibold text-lg mt-1 w-36" numberOfLines={1}>{item.title}</Text>
          <Text className="opacity-65">{item.size}</Text>
          {item.discountPrice ? (
            <View className="flex-row mt-auto items-center gap-1.5">
              <Text className="font-semibold">${item.discountPrice}</Text>
              <Text className="opacity-65 line-through text-sm">${item.price}</Text>
            </View>
          ) : (
            <Text className="font-semibold mt-1 ">${item.price}</Text>
          )}
        </View>

        <View className="justify-between">
          <Pressable className='size-10 justify-center items-center bg-white rounded-full shadow-xl'>
            <Heart size={20} fill={"#000"} strokeWidth={1.4} />
          </Pressable>
          <Pressable className=' shadow-xl  bg-[#4aa556] size-10 rounded-full justify-center items-center '>
            <Plus size={20} color={"#fff"} />
          </Pressable>
          {/* <Pressable className=' shadow-xl  rounded-lg bg-neutral px-4 py-2 justify-center items-center '>
            <Text className="text-black">Add</Text>
          </Pressable> */}

        </View>



      </View>
    </View>
  )
}
type FilterBtnType = {
    active: string;
    el: string
    setActive: (v: string) => void
}

const FilterBtn = ({ active, el, setActive }: FilterBtnType) => {
    return (
        <Pressable
            onPress={() => setActive(el)}
            key={el}
            className=""
        >
            <MotiView
                animate={{ backgroundColor: active == el ? "#4aa556" : "#fff", opacity: active == el ? 1 : .6, }}
                className="py-1.5 px-6  w-full rounded-[40px]"
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