import { View, Text } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { ChevronLeft } from 'lucide-react-native'
import { useRouter } from 'expo-router'

const BackBtn = () => {
  const router = useRouter()
  return (
    <Pressable onPress={()=>router.back()} className="size-11 rounded-full items-center justify-center bg-neutral">
    <ChevronLeft size={20} strokeWidth={1.3} color={"#222"} />
  </Pressable>
  )
}

export default BackBtn