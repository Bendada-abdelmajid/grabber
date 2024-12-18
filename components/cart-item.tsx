import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { Product } from '@/constants/data';
import { Minus, Plus } from 'lucide-react-native';
import { CartItem as CartProps, useAppContext } from '@/hooks/app-context';
type Props = {
    item: CartProps;
    index:number;
};
const CartItem = ({ item, index }: Props) => {
    const { handleCart } = useAppContext()
    return (
        <View className={`flex-1 flex-row items-center gap-5 ${index>0 ? " border-t border-t-gray-100 pt-5":""} `}>
            <View className="size-20 p-3 justify-center items-center bg-neutral rounded-xl">
                <Image className="size-full " source={{ uri: item.product.imageUrl }} />
            </View>
            <View className='flex-1'>
                <Text className="font-500 w-36" numberOfLines={1}>{item.product.title}</Text>



                <Text className="opacity-65 text-sm font-400">{item.product.size}</Text>
                {item.product.discountPrice ? (
                    <View className="flex-row mt-1 items-center gap-1.5">
                        <Text className="font-semibold">${item.product.discountPrice}</Text>
                        <Text className="opacity-65 line-through text-sm">${item.product.price}</Text>
                    </View>
                ) : (
                    <Text className="font-semibold mt-1 ">${item.product.price}</Text>
                )}


            </View>

            <View className="flex-row items-center gap-2">
                <Pressable onPress={() => handleCart(item.product, "Remove")} className='   size-11 bg-neutral rounded-full justify-center items-center '>
                    <Minus size={18} strokeWidth={2.5} color={"#000"} />
                </Pressable>
                <Text className=' px-2 text-center'>{item.count}</Text>
                <Pressable onPress={() => handleCart(item.product, "Add")} className=' bg-neutral  size-11 rounded-full justify-center items-center '>
                    <Plus size={18} strokeWidth={2.5} color={"#000"} />
                </Pressable>

            </View>
        </View>
    )
}

export default CartItem
