import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Address } from '@/libs/types';
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
    const addressKeys = Object.keys(initialAddressState) as (keyof Address)[]

    const handleInputChange = (field: keyof Address, value: string) => {
        setAddress({ ...address, [field]: value });
    };
    const handleSave = () => {
        console.log()
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <Text className='text-2xl font-500 font-medium'>Add Address</Text>


                <View className='mt-5'>
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
                <View className='flex-row items-center gap-5 mt-5'>
                    <Pressable className="py-3 px-10 rounded-[40px] bg-neutral">
                        <Text className="text-xl font-medium font-500 tracking-wider text-center" >
                            Cancel
                        </Text>
                    </Pressable>
                    <Pressable onPress={handleSave} className=" flex-1 py-3 rounded-[40px] bg-primary">
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text
                                className="text-xl font-medium font-500 tracking-wider text-center text-white"

                            >
                                Save Address
                            </Text>
                        )}
                    </Pressable>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddressForm