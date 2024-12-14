import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Camera, ChevronRight, CreditCard, FileText, HelpCircle, ImageIcon, Lock, LogOut, LucideIcon, Package, Shield, Trash2, UserPen } from 'lucide-react-native'
import { Link, Route } from 'expo-router'
import auth, { getAuth, updateProfile } from '@react-native-firebase/auth';
import LogoutSheet from '@/components/logout-sheet'
import { useSharedValue } from 'react-native-reanimated'
import { useAppContext } from '@/hooks/app-context'
import * as ImagePicker from "expo-image-picker";
import * as Crypto from 'expo-crypto';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";


import { ScrollView } from 'moti'
type linkType = {
  Icon: LucideIcon,
  label: string,
  url: Route | string
}
const links: linkType[] = [
  // {
  //   Icon: UserPen,
  //   label: "Edit Profile",
  //   url: "/profile/edit",
  // },
  {
    Icon: Lock,
    label: "Change Password",
    url: "/change-password",
  },
  {
    Icon: CreditCard,
    label: "Payment Methods",
    url: "/credit-cards",
  },
  {
    Icon: Package,
    label: "My Orders",
    url: "/orders",
  },
  {
    Icon: Shield,
    label: "Privacy Policy",
    url: "/privacy-policy",
  },
  {
    Icon: FileText,
    label: "Terms & Conditions",
    url: "/terms-and-conditions",
  },
  {
    Icon: HelpCircle,
    label: "FAQs",
    url: "/faqs",
  },
];



const profile = () => {

  const { toggleSheet } = useAppContext()

  const user = auth().currentUser;
  const [img, setImg] = useState<String | null>(user?.photoURL || null)
  const logout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }
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
    <>

      <SafeAreaView className='flex-1 bg-white'>
        <ScrollView scrollEventThrottle={16} bounces={false} overScrollMode='never' showsVerticalScrollIndicator={false} className='flex-1' contentContainerStyle={{ paddingBottom: 80, paddingTop: 24, paddingHorizontal: 20 }}>
          <View className='flex-1'>
            <Pressable onPress={toggleSheet} className='flex-row items-center gap-1.5 py-2 px-4 rounded-3xl bg-neutral ml-auto'>
              <LogOut size={16} strokeWidth={1.3} color={"#dc2626"} />

              <Text className='text-sm '>LogOut</Text>

            </Pressable>
            <View className='pt-1 pb-5  gap-5  items-center'>
              <View ><Image className='size-32 border border-neutral bg-white shadow-2xl rounded-full object-cover' resizeMode='cover' source={img ? { uri: img } : require("@/assets/images/profile.png")} />
                <Pressable onPress={handlePresentModalPress} className='absolute bottom-0 right-0 size-10 bg-neutral rounded-full items-center justify-center'>
                  <Camera size={20} color={"#111"} />
                </Pressable>
              </View>
              <View className=''>
                <Text className=' text-xl text-center capitalize font-semibold ' numberOfLines={1} adjustsFontSizeToFit>{user?.displayName}</Text>
                <Text className=' mt-1 text-center text-meuted'>{user?.email}</Text>
              </View>

            </View>
            <View className='h-0.5 w-4/5 mt-2 mb-7 bg-gray-50 mx-auto' />

            {links.slice(0, 3).map(({ url, label, Icon }) => (
              <Link href={url as Route} key={url} >
                <View className='px-0.5 py-2  flex-row items-center gap-5 rounded-lg mb-2'>
                  <View className='bg-neutral rounded-lg size-12 justify-center items-center'>
                    <Icon size={24} color={"#222"} />
                  </View>

                  <Text className='text-xl flex-1'>{label}</Text>
                  <ChevronRight size={20} color={"#222"} /></View>
              </Link>
            ))}
            <View className='h-0.5 w-4/5 my-7 bg-gray-50 mx-auto' />
            {links.slice(3, 6).map(({ url, label, Icon }) => (
              <View key={url} className='px-0.5 py-1 flex flex-row items-center gap-5 rounded-lg mb-2'>
                <View className='bg-neutral/70 rounded-lg size-12 justify-center items-center'>
                  <Icon size={24} color={"#222"} /></View>
                <Text className='text-xl flex-1'>{label}</Text>
                <ChevronRight size={20} color={"#222"} />
              </View>
            ))}</View>
        </ScrollView>
      </SafeAreaView>
      <BottomSheetModal
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        backgroundStyle={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.44,
          shadowRadius: 10.32,
          elevation: 20,
        }}
        snapPoints={[180]}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <UpdateImage setImg={setImg} />
        </BottomSheetView>
      </BottomSheetModal>

      {/* </LinearGradient> */}
    </>
  )
}

export default profile


const UpdateImage = ({ setImg }: { setImg: (e: string | null) => void }) => {
  const { currentUser } = getAuth();

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImg(result.assets[0].uri);
      await photoUploader(result.assets[0])

    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImg(result.assets[0].uri);
      await photoUploader(result.assets[0])

    }
  };

  const photoUploader = async (photo: ImagePicker.ImagePickerAsset) => {
    const upload_preset = process.env.EXPO_PUBLIC_UPLOAD_PRESET;
    console.log("upload_preset", upload_preset)
    try {
      const file = {
        uri: photo.uri,
        type: photo.mimeType || "",
        name: photo.fileName || ""
      }

      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", upload_preset || "");

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body,
        }
      );
      console.log("uploadResponse", uploadResponse)
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const image = await uploadResponse.json();
      const imgUrl = image.url.split("/upload/");
      const resizedUrl = `${imgUrl[0]}/upload/w_300,h_300,c_fill/${imgUrl[1]}`;
      if (currentUser) {
        await updateProfile(currentUser, { photoURL: resizedUrl });
      }
      console.log("Uploaded image URL:", image.url);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const generateSHA1 = async (data: any) => {
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, data)
    return digest
  }




  const deleteImg = async () => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUD_NAME;
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const apiSecret = process.env.EXPO_PUBLIC_SECRET_KEY;
    try {
      const url = currentUser?.photoURL || ""
      if (url && currentUser) {


        const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
        const publicId = url.match(regex);

        if (!publicId) {
          console.log("Missing Cloudinary environment variables!");
          return;
        }
        const timestamp = new Date().getTime();
        const string = `public_id=${publicId[1]}&timestamp=${timestamp}${apiSecret}`;
        const signature = await generateSHA1(string);

        console.log("hi signature")
        console.log(" signature", signature)
        const formData = new FormData();
        formData.append("public_id", publicId[1]);
        formData.append("timestamp", timestamp.toString());

        formData.append("api_key", apiKey || "");
        formData.append("signature", signature);
        console.log({ formData })
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await res.json();
        if (result.result === "ok") {
          await updateProfile(currentUser, { photoURL: "" });
          setImg(null)
          console.log("Image deleted successfully!");
        } else {
          console.error("Failed to delete image:", result);
        }
      }
    }
    catch (error) {
      console.log("Error uploading photo:", error);

    }
  }




  return (
    <View className='pt-3 pb-5 px-7'>
      <Text className='font-600 font-semibold text-xl'>Profile Photo</Text>
      <View className='flex-row items-center gap-5 mt-5'>
        <TouchableOpacity onPress={takePhoto} className='flex-1 py-4 bg-neutral justify-center items-center rounded-lg'>
          <Camera size={23} color={"#4aa556"} />
          <Text className='mt-1 font-400 text-center'>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} className='flex-1 py-4 bg-neutral justify-center items-center rounded-lg'>
          <ImageIcon size={23} color={"#4aa556"} />
          <Text className='mt-1 font-400 text-center'>Labrary</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteImg} className='flex-1 py-4 bg-neutral justify-center items-center rounded-lg'>
          <Trash2 size={23} color={"#333"} />
          <Text className='mt-1 font-400 text-center'>Delelte</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}