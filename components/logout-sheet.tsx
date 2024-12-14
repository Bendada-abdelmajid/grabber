import { View, Text, useColorScheme, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
type Props = {
    toggleSheet: () => void;
    isOpen: SharedValue<boolean>
}
const duration = 500
const LogoutSheet = ({ isOpen, toggleSheet }: Props) => {
    const router = useRouter()
    const logout = async () => {
        await GoogleSignin.signOut();
        await auth().signOut().then(() => console.log('User signed out!'));
        router.replace('/');
    }

    const height = useSharedValue(0);
    const progress = useDerivedValue(() =>
        withTiming(isOpen.value ? 0 : 1, { duration })
    );

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: progress.value * 2 * height.value }],
    }));

    const backgroundColorSheetStyle = {
        backgroundColor: '#f8f9ff'
    };

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
        pointerEvents: isOpen.value
            ? "auto"
            : "none",
    }));
    return (

        <>


            <Animated.View key={"backdrop"} style={[StyleSheet.absoluteFillObject, { zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', }, backdropStyle]}>
                <TouchableOpacity className='flex-1' onPress={toggleSheet} />
            </Animated.View>
            <Animated.View key={"sheet"}
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                }} className={"p-6  rounded-2xl shadow-3xl bg-white  absolute bottom-2 left-2 right-2 z-50"}
                style={[sheetStyle, backgroundColorSheetStyle, { zIndex: 20 }]}>
                <View>
                    <Text className='text-3xl font-semibold font-600' >Logout</Text>
                    <Text className='text-lg   mt-1 font-400'>Are you sure you want to log out?</Text>
                    <View className='flex-row gap-4 mt-6'>
                        <Pressable onPress={toggleSheet} className="border  flex-1 py-3 rounded-[40px] ">
                            <Text style={{ fontFamily: "Manrope_500Medium" }} className="text-center text-xl">Cancel</Text>
                        </Pressable>
                        <Pressable onPress={logout} className="bg-black flex-1 py-3 rounded-[40px] ">
                            <Text style={{ fontFamily: "Manrope_500Medium" }} className="text-white text-center text-xl">Yes, Logout</Text>
                        </Pressable>
                    </View>
                </View>

            </Animated.View>
        </>


    )
}

export default LogoutSheet