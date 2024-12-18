import {
    View,
    Text,
    Pressable,
    ActivityIndicator,
    TextInput,
    Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import auth, { updatePassword } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import BackBtn from "@/components/back-btn";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

const ChangePassword = () => {
    const user = auth().currentUser
    const [img, setImg] = useState<String | null>(user?.photoURL || null)
    const [hasPassword, setHasPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    useEffect(() => {
        const checkHasPassword = async () => {
            const userDoc = await firestore().collection('users').doc(user?.uid).get()
            const value = userDoc.get("hasPassword")
            setHasPassword(value as boolean)
        }
        checkHasPassword()

    }, [user])
    const hundelSubmit = async () => {
        if (!user) return
        if (!password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            await updatePassword(user, password);
            firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    hasPassword: true
                }).catch((er) => {
                    console.log(er)
                })

            Alert.alert("Success", "Password set successfully");
            // router.replace("/"); // Redirect to login or home screen
        } catch (error: any) {
            console.log(error)
            Alert.alert("Error setting password:", error.message);
        } finally {
            setLoading(false);
            setConfirmPassword("")
            setPassword("")
            setOldPassword("")
        }
    };
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const dismiss = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                {...props}
            />
        ),
        []
    );

    return (
        <SafeAreaView className="flex-1 bg-white py-5 px-5">
            <View className="flex-row items-center gap-5 mb-10">
                <BackBtn />
                <Text className="text-2xl font-500 font-medium">Edit profile</Text>
            </View>

            <View className=" ">
                <Text className="text-lg font-500 font-medium">First Name</Text>
                <TextInput
                    value={oldPassword}
                    className="text-lg  bg-neutral h-14 rounded-xl px-3 mt-2"

                    placeholder="Enter your first name"
                    onChangeText={setOldPassword}
                />
            </View>
            <View className="mt-5  ">
                <Text className="text-lg font-500 font-medium">Last Name</Text>
                <TextInput
                    value={oldPassword}
                    className="text-lg  bg-neutral h-14 rounded-xl px-3 mt-2"

                    placeholder="Enter your last name"
                    onChangeText={setOldPassword}
                />
            </View>


            <View className="mt-5">
                <Text className="text-lg font-500 font-medium">Phone number</Text>
                <TextInput
                    value={confirmPassword}
                    className="text-lg  bg-neutral h-14 rounded-xl px-3 mt-2"
                    secureTextEntry={true}
                    keyboardType="default"
                    placeholder="0659839839"
                    onChangeText={setConfirmPassword}
                />
            </View>

            <Pressable onPress={hundelSubmit} className="mt-10 py-3 rounded-[40px] bg-black">
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text className="text-2xl font-medium font-500 tracking-wider text-center text-white">
                        Update
                    </Text>
                )}
            </Pressable>
        </SafeAreaView>
    );
};

export default ChangePassword;
