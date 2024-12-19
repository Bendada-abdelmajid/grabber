import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Address } from '@/libs/types';
import BackBtn from '@/components/back-btn';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/hooks/app-context';
import { generateUniqueId } from '@/libs/utils';
import firestore from '@react-native-firebase/firestore';
const initialAddressState: Address = {
    id:"",
    title: "",
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",

};

const AddressForm = () => {

    const [address, setAddress] = useState<Address>(initialAddressState)
    const [loading, setLoading] = useState(false)
    const { id, back } = useLocalSearchParams();
    const router = useRouter()
    const {user}= useAppContext()
    const usersCollection = firestore().collection('users');
   const addresses = user.addresses
   useEffect(() => {
    if (id && addresses) {
        console.log(addresses.find(el => el.id == id))
        setAddress(addresses.find(el => el.id == id) || initialAddressState)
    }
}, [id])
    const handleInputChange = (field: keyof Address, value: string) => {
        setAddress({ ...address, [field]: value });
    };
    const handleSave = async () => {
        console.log(user.uid)
        let updatedAddresses;
        if (!address.addressLine || !address.city || !address.title || !address.city) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            setLoading(true)
            if (id) {
                console.log("update")
                updatedAddresses = addresses?.map(el =>
                    id === el.id ? address : el
                );
                console.log("update", updatedAddresses)
            } else {
                const newCard = { ...address, id: generateUniqueId() + "-address" }
                console.log("add")
                updatedAddresses = addresses ? [...addresses, newCard] : [newCard]
            }

            await usersCollection.doc(user.uid).update({
                addresses: updatedAddresses,
            });
            
            Alert.alert("Success", 'Card added successfully!');
        } catch (er) {
            console.log(er)
        } finally {
            setLoading(false)
            if(back == "true"){
                router.back()
            }
        }
    };

    return (
        <KeyboardAvoidingView className='bg-white flex-1'>
            <SafeAreaView className='bg-white pt-5 py-7 flex-1 px-5'>
                <View className="flex-row items-center gap-5 ">
                    <BackBtn />
                    <Text className="text-2xl">{id ? "Update" : "Add"} Address</Text>
                </View>


                <View className='mt-10'>
                    <Text className='font-500 font-medium mb-2'>title</Text>
                    <TextInput
                        className='h-14 w-full rounded-lg bg-neutral px-3'
                        placeholder="Name on Card"
                        value={address.title}
                        onChangeText={(value) => handleInputChange("title", value)}
                    />
                </View>


                {/* Address Line */}
                <View className='mt-5'>
                    <Text className='font-500 font-medium mb-2'>Address Line</Text>
                    <TextInput
                        className='h-14 w-full rounded-lg bg-neutral px-3'
                        placeholder="Street Address"
                        value={address.addressLine}
                        onChangeText={(value) => handleInputChange("addressLine", value)}
                    />
                </View>

                <View className='flex-row items-center gap-5 mt-5 '>
                    <View className='flex-1'>
                        <Text className='font-500 font-medium mb-2'>City</Text>
                        <TextInput
                            className='h-14 w-full rounded-lg bg-neutral px-3'
                            placeholder="City"
                            value={address.city}
                            onChangeText={(value) => handleInputChange("city", value)}
                        />
                    </View>


                    <View className='flex-1'>
                        <Text className='font-500 font-medium mb-2'>State</Text>
                        <TextInput
                            className='h-14 w-full rounded-lg bg-neutral px-3'
                            placeholder="State"
                            value={address.state}
                            onChangeText={(value) => handleInputChange("state", value)}
                        />
                    </View>
                </View>
                <View className='flex-row items-center gap-5 mt-5 '>

                    {/* ZIP Code */}
                    <View className='flex-1'>
                        <Text className='font-500 font-medium mb-2'>ZIP Code</Text>
                        <TextInput
                            className='h-14 w-full rounded-lg bg-neutral px-3'
                            placeholder="ZIP Code"
                            value={address.zipCode}
                            keyboardType="numeric"
                            onChangeText={(value) => handleInputChange("zipCode", value)}
                        />
                    </View>

                    {/* Country */}
                    <View className='flex-1'>
                        <Text className='font-500 font-medium mb-2'>Country</Text>
                        <TextInput
                            className='h-14 w-full rounded-lg bg-neutral px-3'
                            placeholder="Country"
                            value={address.country}
                            onChangeText={(value) => handleInputChange("country", value)}
                        />
                    </View></View>

                {/* Phone */}
                <View className='mt-5'>
                    <Text className='font-500 font-medium mb-2'>Phone</Text>
                    <TextInput
                        className='h-14 w-full rounded-lg bg-neutral px-3'
                        placeholder="Phone Number"
                        value={address.phone}
                        keyboardType="phone-pad"
                        onChangeText={(value) => handleInputChange("phone", value)}
                    />
                </View>
              
                    <Pressable onPress={handleSave} className="mt-10 py-4 rounded-[40px] bg-primary">
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text
                                className="text-2xl font-medium font-500 tracking-wider text-center text-white"

                            >
                                Save Address
                            </Text>
                        )}
                    </Pressable>
                

            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default AddressForm