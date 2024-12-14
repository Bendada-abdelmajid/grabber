import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const BagIcon = ({size, className, color="#fff"}:{size:number, className?:string, color:string}) => {
  return (
    <Svg
    className={className}
      stroke={color}
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      height={size}
      width={size}
    
    >
      <Path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></Path>
      <Path d="M9 11v-5a3 3 0 0 1 6 0v5"></Path>
    </Svg>
  );
};

export default BagIcon;
