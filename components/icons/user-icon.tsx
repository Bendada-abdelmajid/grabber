import { Icon } from "@/libs/types";

import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const UserIcon = ({
  color = "black",
  strockColor = "black",
  fill = "none",
  size = 24,
  className,
}: Icon) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
       fill={"#0000"}
      strokeWidth={1.3}
      
      className={className}
    >
      <Circle cx="12" cy="12" r="10" stroke={strockColor}></Circle>
      <Circle cx="12" cy="10" r="3" stroke={strockColor}  fill={fill}></Circle>
      <Path
        d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"
        stroke={strockColor}
        fill={fill}
      ></Path>
    </Svg>
  );
};

export default UserIcon;
