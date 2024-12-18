

import { Redirect, Slot, Stack, useRouter, useSegments } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

import { AppProvider } from '@/hooks/app-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
export default function RootLayout() {



  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <AppProvider>
          <Stack >

            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false, animation: "slide_from_left" }} />
            <Stack.Screen name="cart" options={{ headerShown: false, animation: "ios_from_right", presentation: "modal" }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: false, animation: "fade" }} />

            <Stack.Screen name="change-password" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="credit-cards" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="address" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="add-address" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="checkout" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="payement" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="orders" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="add-card" options={{ headerShown: false, animation: "slide_from_right" }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: false, animation: "slide_from_right" }} />
          </Stack>
          <StatusBar style="auto" />
        </AppProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
