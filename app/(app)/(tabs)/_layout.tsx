import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '@/components/tab-bar';


export default function TabLayout() {


  return (
    <Tabs safeAreaInsets={{ left: 100 }} tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift",
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
        }}
      />
      <Tabs.Screen
        name="categorys"
        options={{
          title: 'Categorys',
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
