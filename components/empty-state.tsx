import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import { Route, useRouter } from 'expo-router'
type Props = {
    imageSource: ImageSourcePropType;
    title: string;
    description: string;
    buttonText?: string;
    url?: Route;
    className?:string,
}
const EmptySate = ({ imageSource, title, description, buttonText, url, className="" }: Props) => {
    const router = useRouter()
    return (
        <View className={'flex-1 justify-center items-center ' + className}>
            <Image className='h-60 ' resizeMode='contain' source={imageSource} />
            <Text className='text-center text-xl font-600 font-semibold mt-5'>{title}</Text>
            <Text className='text-center font-500 text-meuted mt-1'>{description}</Text>
            {url && <TouchableOpacity onPress={() => router.push(url)} activeOpacity={.9} className='mt-6 py-3 px-8 shadow-3xl bg-primary rounded-[40px]'>
                <Text className='text-center  text-white text-lg font-500 font-medium '>{buttonText}</Text>
            </TouchableOpacity>}
        </View>
    )
}

export default EmptySate