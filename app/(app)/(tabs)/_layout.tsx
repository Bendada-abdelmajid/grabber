import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '@/components/tab-bar';
import { Dimensions, View } from 'react-native';
import Bar from '@/components/bar';



export default function TabLayout() {

const {height, width}= Dimensions.get("window")
  return (
  
    <Tabs  tabBar={(props) => <Bar />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="favorite"

        options={{
          title: 'Favorite',
          animation:"fade",
          popToTopOnBlur:true
        }}
      />
      <Tabs.Screen
        name="categorys"
        options={{
          title: 'Shop',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>

  );
}
