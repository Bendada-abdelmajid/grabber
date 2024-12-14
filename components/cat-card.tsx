import { View, Text, Image, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Cat } from '@/constants/data'
import { Link, useRouter } from 'expo-router'
type Props = {
    item: Cat
}
const {width}=Dimensions.get("window")
const itemSize= width/3
const CatCard = ({ item }: Props) => {
    const router = useRouter()
    return (
        <Pressable onPress={()=>router.push({pathname:"/categorys/[slug]", params:{slug:item.title}})}  style={{maxWidth:itemSize -20}} key={item.title} className='flex flex-1'>
            <View className='bg-neutral rounded-lg w-full aspect-square justify-center items-center'>
                <Image className='object-contain size-[90%]' resizeMode='contain' source={item.img} />
            </View>
            <Text className='text-center mt-1'>{item.title}</Text>

        </Pressable>
    )
}

export default CatCard