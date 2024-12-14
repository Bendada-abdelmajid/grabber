import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, LayoutAnimationConfig, LinearTransition } from 'react-native-reanimated'
import SignIn from './sing-in'
import SignUp from './sign-up'


const AuthScreen = () => {
    const [acrive , setActive]= useState<0|1>(0)
  return (
    <View style={{flex:1, backgroundColor:"#fff"}} className='flex-1 bg-black'>
     
    <LayoutAnimationConfig skipEntering >

    {acrive==0 && <Animated.View className={"flex-1"}  key={"sign-in"} layout={LinearTransition} entering={FadeInLeft} exiting={FadeOutLeft} >
       <SignIn setActive={setActive}/>
    </Animated.View>}
    {acrive==1 && <Animated.View  className={"flex-1"} key={"sign-up"} layout={LinearTransition} entering={FadeInRight} exiting={FadeOutRight} >
       <SignUp setActive={setActive}/>
    </Animated.View>}

</LayoutAnimationConfig>

</View>
  )
}

export default AuthScreen