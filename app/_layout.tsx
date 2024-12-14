

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
import "../global.css";
import { Slot } from "expo-router";

export default function RootLayout() {


  return (
    <Slot />
  );
}
