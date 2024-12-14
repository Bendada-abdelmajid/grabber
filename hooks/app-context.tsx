
import { Manrope_700Bold, Manrope_600SemiBold, Manrope_300Light, Manrope_400Regular, Manrope_500Medium, useFonts } from '@expo-google-fonts/manrope';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { data, Product } from "@/constants/data";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import LogoutSheet from '@/components/logout-sheet';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AuthScreen from '@/components/auth';
import { Address, Card } from '@/libs/types';


type ContextType = {
  user: User,
  favorites: Product[],
  toggleSheet: () => void;
  isOpen: SharedValue<boolean>
  cart: CartItem[],
  handleCart: (product: Product, type: "Add" | "Remove", n?: number) => Promise<void>,
  handleFavorites: (item: Product) => Promise<void>
  clearCart: () => Promise<void>
};
interface User extends FirebaseAuthTypes.User {
  hasPassword?: boolean;
  activeCard?: string;
  activeAddress: string;
  phone?: string;
  addresses?: Address[];
  creditCards?: Card[];
}
const Context = createContext<ContextType | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};
export type CartItem = {
  product: Product,
  count: number,
  total: number,
}
const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log("error", e)
    return []
  }
};

export const AppProvider = ({ children }: ProviderProps) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const isOpen = useSharedValue(false)
  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
  };
  useEffect(() => {
    const fetchData = async () => {
      setFavorites(await getData('favorites-items'));
      setCart(await getData('cart-items'));
    };
    fetchData();
  }, []);
  const [loaded] = useFonts({
    Manrope_700Bold, Manrope_600SemiBold, Manrope_300Light, Manrope_400Regular, Manrope_500Medium,
  });


  const onAuthStateChanged = async (newUser: any | null) => {

    if (newUser !== null) {
      setUser({ ...newUser._user })
    } else {
      setUser(null);
    }
    setInitializing(false);
  };


  useEffect(() => {
    if (user?.uid) {
      const subscriber = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(documentSnapshot => {
          const userData = documentSnapshot.data()
          setUser(prev => ({ ...prev, ...userData } as User));

        });

      return () => subscriber();
    }

  }, [user?.uid])

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Cleanup subscription
  }, []);



  const handleCart = async (product: Product, type: "Add" | "Remove", n?: number) => {
    try {


      const data = [...cart];
      const itemIndex = data.findIndex(el => el.product.id === product.id);

      if (itemIndex > -1) {
        const item = data[itemIndex];
        console.log(`count ${n}`)
        const count = n ? n : type === "Add" ? item.count + 1 : item.count - 1;

        if (count > 0) {
          data[itemIndex] = { ...item, count, total: count * product.price };
        } else {
          data.splice(itemIndex, 1); // Remove item if count is 0
        }
      } else if (type === "Add") {
        data.push({ product, count: n ? n : 1, total: product.price * (n ? n : 1) });
      }

      setCart(data);
      await AsyncStorage.setItem('cart-items', JSON.stringify(data));
    } catch (e) {
      console.log("error", e)
    }
  };
const clearCart= async ()=>{
  await AsyncStorage.setItem('cart-items', JSON.stringify([]));
  setCart([])
}
  const handleFavorites = async (item: Product) => {
    try {

      const data = [...favorites];
      const exists = data.find(el => el.id === item.id);

      if (exists) {
        setFavorites(data.filter(el => el.id !== item.id)); // Remove if exists
      } else {
        setFavorites([...data, item]); // Add if not exists
      }
      await AsyncStorage.setItem('favorites-items', JSON.stringify(data));
    } catch (e) {
      console.log("error", e)
    }
  };



  if (!loaded || initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (user == null) {
    return <AuthScreen />
  }






  return (
    <Context.Provider
      value={{ user, favorites, cart, handleCart, handleFavorites, toggleSheet, isOpen, clearCart }}
    >
      {/* <Pressable onPress={getProductsCount} className='py-4 w-full mt-40 bg-primary'>
        {hasUploaded && <ActivityIndicator /> }
        <Text className='text-center text-white text-2xl'>AddProducts</Text>
      </Pressable> */}
      {children}
      <LogoutSheet isOpen={isOpen} toggleSheet={toggleSheet} />
    </Context.Provider>
  );
};

export const useAppContext = (): ContextType => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
