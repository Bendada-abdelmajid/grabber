import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { Product } from '@/constants/data';
import { Minus, Plus } from 'lucide-react-native';
import { CartItem as CartProps, useAppContext } from '@/hooks/app-context';
type Props = {
    item: CartProps;

};
const CartItem = ({ item }: Props) => {
    const { handleCart } = useAppContext()
    return (
        <View className="flex-1 flex-row  gap-5 bg-white rounded-xl border border-neutral p-2">
            <View className=" w-28 h-24 justify-center items-center bg-neutral rounded-xl">
                <Image className="size-20" source={{ uri: item.product.imageUrl }} />
            </View>
            <View className='flex-1'>
                <Text className="font-semibold text-lg mt-1 w-36" numberOfLines={1}>{item.product.title}</Text>

                <View className='flex-1 items-end flex-row justify-between'>

                    <View className="flex-1">

                        <Text className="opacity-65">{item.product.size}</Text>
                        {item.product.discountPrice ? (
                            <View className="flex-row mt-auto items-center gap-1.5">
                                <Text className="font-semibold">${item.product.discountPrice}</Text>
                                <Text className="opacity-65 line-through text-sm">${item.product.price}</Text>
                            </View>
                        ) : (
                            <Text className="font-semibold mt-1 ">${item.product.price}</Text>
                        )}
                    </View>

                    <View style={{ width: 95, borderRadius: 40 }} className="flex-row border border-neutral  items-center  justify-between  bg-white rounded-[40px] shadow">
                        <Pressable onPress={() => handleCart(item.product, "Remove")} className='   size-10 rounded-full justify-center items-center '>
                            <Minus size={18} strokeWidth={2.5} color={"#000"} />
                        </Pressable>
                        <Text className='flex-1 px-2 text-center'>{item.count}</Text>
                        <Pressable onPress={() => handleCart(item.product, "Add")} className=' font-medium size-10 rounded-full justify-center items-center '>
                            <Plus size={18} strokeWidth={2.5} color={"#000"} />
                        </Pressable>

                    </View>



                </View>
            </View>
        </View>
    )
}

export default CartItem