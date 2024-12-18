import { View, Text, Pressable } from 'react-native'
import React, {  useEffect } from 'react'
import { Link, Route, usePathname } from 'expo-router'
import HomeIcon from './icons/home'
import HeartIcon from './icons/heart-icon'
import { Icon } from '@/libs/types'
import CategoryIcon from './icons/category-icon'

import Animated, { Easing, interpolate, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Svg, { SvgProps } from 'react-native-svg'
import UserIcon from './icons/user-icon'



type Props = {}
type linkItem = { name: Route, label: string, Icon:({}: Icon)=>React.JSX.Element }
const links: linkItem[] = [
    { name: "/", label: "home", Icon: HomeIcon },
    { name: "/favorite", label: "favorite", Icon: HeartIcon },
    { name: "/categorys", label: "Shop", Icon: CategoryIcon },
    { name: "/profile", label: "Profile", Icon: UserIcon },
]


const Bar = (props: Props) => {
    return (
        <View className='w-full absolute bottom-0 bg-white left-0 right-0 py-3 flex-row '>
            {links.map(el => (
                <Tab item={el} key={el.name} />
            ))}
        </View>
    )
}

const Tab= ({ item: { label, Icon, name } }: { item: linkItem }) => {
    const pathname = usePathname();

    // Determine if this tab is active by comparing the current pathname
    const active = pathname === name;
  
    const activevalue = useSharedValue(0);
    
    // Update the animation value based on whether the tab is active
    useEffect(() => {
      activevalue.value = withTiming(active ? 1 : 0, { duration: 200, easing: Easing.ease });
    }, [active]);
  
    // Animated styles for text
    const textStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(activevalue.value, [0, 1], ["#222", "#4aa556"]),
      };
    }, [activevalue]);
  
    // Animated icon styles
    const iconStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(activevalue.value, [0, 1], [1, 1.2]), // Scale up when active
          },
        ],
      };
    }, [activevalue]);
  
    return (
      <Link href={name} className="flex-1" onPress={() => {}}>
        <View className="flex-1 w-full items-center justify-center">
        
            <Icon color={active ? "#fff" : "#222"} strockColor={active ? "#4aa556" : "#222"} fill={active ? "#4aa556" : "none"} size={27} />
        
          <Animated.Text style={textStyle} className="text-center w-full mt-1 text-xs text capitalize font-400">
            {label}
          </Animated.Text>
        </View>
      </Link>
    );
}

export default Bar