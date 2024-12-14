import { View, Text, TextInput, Pressable, ActivityIndicator, Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LockKeyhole, Mail } from 'lucide-react-native';
import GoogleIcon from '@/components/icons/google-icon';
import { Link } from 'expo-router';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
type Props = {
  setActive: React.Dispatch<React.SetStateAction<0 | 1>>
}

GoogleSignin.configure(
  { webClientId: "407971151107-5ifrlbopse618th0p5rsg2fnqipf1b12.apps.googleusercontent.com", offlineAccess: true, }
);

const SignIn = ({ setActive }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const hundelSignIn = async () => {
    setLoading(true);
    try {

      await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      alert('Sign in failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };
  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const {data} = await GoogleSignin.signIn();

      // Ensure we have a valid ID token
      if (!data?.idToken) {
        console.error("Google Sign-In failed: No ID token provided.");
        return;
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);

      // Sign-in the user with the credential
      const res = await auth().signInWithCredential(googleCredential);
      const id = res.user.uid;

      // Check if the user exists in Firestore
      const userDoc = await firestore().collection('users').doc(id).get();
      if (!userDoc.exists) {
        await firestore()
          .collection('users')
          .doc(id)
          .set({
            hasPassword: false,
            orders:[]
          });
        console.log('User added to Firestore.');
      }

      console.log("User ID:", id);
      return res // Return the user's data from Firestore if needed
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return error;
    }
  }

  // async function onGoogleButtonPress() {


  //   try {
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });

  //     const { type, data } = await GoogleSignin.signIn();

  //     /**
  //      * @type can be "cancelled" in which can @data will be 'null'; 
  //      * If @type is "success" then @data will be:
  //      * user: {
  //             id: string;
  //             name: string | null;
  //             email: string;
  //             photo: string | null;
  //             familyName: string | null;
  //             givenName: string | null;
  //         };
  //         scopes: string[];
  //         idToken: string | null;
  //         serverAuthCode: string | null;
  //      */

  //     if (type === 'success') {
  //       // const { id, name, email, photo, familyName, givenName } = data.user;

  //       // Create a Google credential with the token
  //       const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
  //       console.log("userId - googleCredential", data.user.id)
  //       // Sign-in the user with the credential
  //       const res = auth().signInWithCredential(googleCredential);
  //       const id = (await res).user.uid
  //       const userDoc = await firestore().collection('Users').doc(id).get();
  //       if (!userDoc.exists) {
  //         firestore()
  //           .collection('users')
  //           .doc(id)
  //           .set({
  //             hasPassword: false
  //           })
  //           .then(() => {
  //             console.log('User added!');
  //           }).catch((error) => {
  //             console.log(error)
  //           });
  //       }
  //       console.log("user - googleCredential",id)
  //       return res
  //     } else if (type === 'cancelled') {
  //       // When the user cancels the flow for any operation that requires user interaction.
  //       return; // do nothing
  //     }
  //   } catch (error) {
  //     console.error('ERROR: ', error);
  //     return error;
  //   }
  // }

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <Text style={{ fontFamily: "Manrope_700Bold" }} className="text-5xl font-bold mt-16">
        Hey,
      </Text>
      <Text style={{ fontFamily: "Manrope_700Bold" }} className="text-5xl font-bold mt-3">
        Welcome Back
      </Text>
      <Text style={{ fontFamily: "Manrope_400Regular" }} className="text-meuted mt-2 text-lg max-w-[300px]">
        Log in to your account using email or social networks
      </Text>

      <View className="bg-neutral flex-row mt-14 rounded-lg">
        <View className="items-center justify-center size-14">
          <Mail strokeWidth={1.3} />
        </View>
        <TextInput
          onChangeText={setEmail}
          className="text-lg flex-1"
          inputMode="email"
          autoCapitalize="none"
          placeholder="Enter your email"
        />
      </View>

      <View className="bg-neutral flex-row mt-5 rounded-lg">
        <View className="items-center justify-center size-14">
          <LockKeyhole strokeWidth={1.3} />
        </View>
        <TextInput
          onChangeText={setPassword}
          className="text-lg flex-1"
          secureTextEntry={true}
          keyboardType="default"
          placeholder="Enter your password"
        />
      </View>

      <Pressable className="mt-5 ml-auto items-end">
        <Text className="text-lg font-medium" style={{ fontFamily: "Manrope_500Medium" }}>
          Forgot Password?
        </Text>
      </Pressable>

      <Pressable onPress={hundelSignIn} className="mt-10 py-4 rounded-[40px] bg-primary">
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text
            className="text-2xl font-semibold tracking-wider text-center text-white"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            Login
          </Text>
        )}
      </Pressable>

      <View className="flex-row items-center gap-3 my-7">
        <View className="h-[1px] flex-1 bg-neutral" />
        <Text style={{ fontFamily: "Manrope_400Regular" }} className="text-meuted">
          Or continue
        </Text>
        <View className="h-[1px] flex-1 bg-neutral" />
      </View>

      <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
      />
      {/* <Pressable
     
        className="py-3 flex-row items-center gap-3 justify-center rounded-[40px] border border-gray-300"
      >
        <GoogleIcon size={30} />
        <Text
          className="text-2xl font-semibold tracking-wider text-center"
          style={{ fontFamily: "Manrope_600SemiBold" }}
        >
          Google
        </Text>
      </Pressable> */}

      <View className="mt-10 flex-row items-center justify-center gap-2">
        <Text style={{ fontFamily: "Manrope_400Regular" }} className="text-meuted text-lg">
          Don't have an account?
        </Text>
        <Pressable onPress={() => setActive(1)}>
          <Text className="font-semibold" style={{ fontFamily: "Manrope_600SemiBold" }}>
            Sign Up
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
};

export default SignIn;
