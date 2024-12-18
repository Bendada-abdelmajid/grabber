import { View, Text, Image, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Cat } from '@/constants/data'
import { Link, useRouter } from 'expo-router'
type Props = {
    item: Cat,
    selected: Cat,
    setSelected: (itrem: Cat) => void
}
const { width } = Dimensions.get("window")

const CatCard = ({ item, setSelected, selected }: Props) => {
    const router = useRouter()
    const active = selected.title == item.title
    return (
        <Pressable  onPress={() => setSelected(item)} key={item.title} className='flex flex-1'>
            <View style={{backgroundColor:item.backgroundColor, borderColor:active?"#222":"#0000", borderWidth:2}} className=' rounded-full size-20 p-4 justify-center items-center'>
                <Image className='object-contain size-full' resizeMode='contain' source={item.img} />
            </View>
            <Text className=' text-sm font-400 text-center mt-1'>{item.title}</Text> 
           

        </Pressable>
    )
}

export default CatCard