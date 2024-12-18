import { Icon } from '@/libs/types';
import React from 'react';
import Svg, { Path } from 'react-native-svg';



const HomeIcon = ({ color = 'black',strockColor = "black", fill = 'none', size = 24, className }: Icon) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
    >
      <Path
        d="M3 12.1349C3 10.6938 3 9.97331 3.30505 9.34958C3.61011 8.72585 4.17886 8.28349 5.31636 7.39877L8.31636 5.06544C10.0859 3.68913 10.9707 3.00098 12 3.00098C13.0293 3.00098 13.9141 3.68913 15.6836 5.06544L18.6836 7.39877C19.8211 8.28349 20.3899 8.72585 20.6949 9.34958C21 9.97331 21 10.6938 21 12.1349V15.0004C21 17.8288 21 19.243 20.1213 20.1217C19.2426 21.0004 17.8284 21.0004 15 21.0004H9C6.17157 21.0004 4.75736 21.0004 3.87868 20.1217C3 19.243 3 17.8288 3 15.0004V12.1349Z"
        stroke={strockColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17V12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default HomeIcon;
