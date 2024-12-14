import { View, Text } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { ShoppingBasket } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useAppContext } from '@/hooks/app-context'
import { SafeAreaView } from 'react-native-safe-area-context';
const CartBtn = () => {

    const router = useRouter()
    const {cart}= useAppContext()
    const count = cart.reduce((a,b)=> a+b.count , 0)
    return (
        <Pressable onPress={()=>router.push("/cart")} className='pt-1'>
            <ShoppingBasket size={27} strokeWidth={1.3} color={"#222"} />
            <View className='absolute -top-0 -right-1 size-5 bg-[#0CA201]  rounded-full justify-center items-center'>
                <Text className='text-white text-xs'>{count}</Text>
            </View>

        </Pressable>
    )
}

export default CartBtn