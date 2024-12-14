import { View, Text, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleIcon from "@/components/icons/google-icon";
import auth from '@react-native-firebase/auth';
import { LockKeyhole, Mail, User } from "lucide-react-native";
import firestore from '@react-native-firebase/firestore';
type Props = {
  setActive: React.Dispatch<React.SetStateAction<0 | 1>>
}
const SignUp = ({ setActive }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const createUser = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update user profile with username (optional)
      if (user && username) {
        await user.updateProfile({
          displayName: username,
        });
        firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            hasPassword: true
          })
          .then(() => {
            console.log('User added!');
          }).catch((error) => {
            console.log(error)
          });

      }

      Alert.alert("Success", "Your account has been created.");
      // router.replace("/"); // Redirect to login or home screen
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white py-5 px-5">
      <Text
        style={{ fontFamily: "Manrope_700Bold" }}
        numberOfLines={1}
        className="text-5xl font-bold mt-12"
      >
        Create
      </Text>
      <Text
        style={{ fontFamily: "Manrope_700Bold" }}
        numberOfLines={1}
        className="text-5xl font-bold mt-1"
      >
        New Account
      </Text>
      <Text
        style={{ fontFamily: "Manrope_400Regular" }}
        className="text-meuted mt-2 text-lg max-w-[300px]"
      >
        Set up your username and password. You can always change it later.
      </Text>

      <View className="bg-neutral flex-row mt-10 rounded-lg">
        <View className="items-center justify-center size-14">
          <User strokeWidth={1.3} />
        </View>
        <TextInput
          className="text-lg flex-1"
          inputMode="text"
          autoCapitalize="none"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View className="bg-neutral flex-row mt-5 rounded-lg">
        <View className="items-center justify-center size-14">
          <Mail strokeWidth={1.3} />
        </View>
        <TextInput
          value={email}
          className="text-lg flex-1"
          inputMode="email"
          autoCapitalize="none"
          placeholder="Enter your email"
          onChangeText={setEmail}
        />
      </View>

      <View className="bg-neutral flex-row mt-5 rounded-lg">
        <View className="items-center justify-center size-14">
          <LockKeyhole strokeWidth={1.3} />
        </View>
        <TextInput
          value={password}
          className="text-lg flex-1"
          secureTextEntry={true}
          keyboardType="default"
          placeholder="Enter your password"
          onChangeText={setPassword}
        />
      </View>

      <View className="bg-neutral flex-row mt-5 rounded-lg">
        <View className="items-center justify-center size-14">
          <LockKeyhole strokeWidth={1.3} />
        </View>
        <TextInput
          value={confirmPassword}
          className="text-lg flex-1"
          secureTextEntry={true}
          keyboardType="default"
          placeholder="Confirm your password"
          onChangeText={setConfirmPassword}
        />
      </View>

      <Pressable onPress={createUser} className="mt-10 py-4 rounded-[40px] bg-primary">
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text
            className="text-2xl font-semibold tracking-wider text-center text-white"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            Sign Up
          </Text>
        )}
      </Pressable>

      <View className="flex-row items-center gap-3 my-7">
        <View className="h-[1px] flex-1 bg-neutral" />
        <Text
          style={{ fontFamily: "Manrope_400Regular" }}
          className="text-meuted"
        >
          Or continue
        </Text>
        <View className="h-[1px] flex-1 bg-neutral" />
      </View>

      <Pressable className="py-3 flex-row items-center gap-3 justify-center rounded-[40px] border border-gray-300">
        <GoogleIcon size={30} />
        <Text
          className="text-2xl font-semibold tracking-wider text-center"
          style={{ fontFamily: "Manrope_600SemiBold" }}
        >
          Google
        </Text>
      </Pressable>

      <View className="mt-10 flex-row items-center justify-center gap-2">
        <Text
          style={{ fontFamily: "Manrope_400Regular" }}
          className="text-meuted text-lg"
        >
          Already have an account?
        </Text>
        <Pressable onPress={() => setActive(0)} className="">
          <Text
            className="font-semibold"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            Log in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
