import { Icon } from '@/libs/types';
import React from 'react';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

const HeartIcon = ({ color = 'black', strockColor = "black", fill = 'none', size = 24, className }: Icon) => {


    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={fill}
            className={className}

        >

            <G id="Iconly/Two-tone/Heart">
                <G id="Heart">
                    <G id="Stroke 1">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M2.87187 11.5983C1.79887 8.24832 3.05287 4.41932 6.56987 3.28632C8.41987 2.68932 10.4619 3.04132 11.9999 4.19832C13.4549 3.07332 15.5719 2.69332 17.4199 3.28632C20.9369 4.41932 22.1989 8.24832 21.1269 11.5983C19.4569 16.9083 11.9999 20.9983 11.9999 20.9983C11.9999 20.9983 4.59787 16.9703 2.87187 11.5983Z" stroke={strockColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <Path fillRule="evenodd" clipRule="evenodd" d="M2.87187 11.5983C1.79887 8.24832 3.05287 4.41932 6.56987 3.28632C8.41987 2.68932 10.4619 3.04132 11.9999 4.19832C13.4549 3.07332 15.5719 2.69332 17.4199 3.28632C20.9369 4.41932 22.1989 8.24832 21.1269 11.5983C19.4569 16.9083 11.9999 20.9983 11.9999 20.9983C11.9999 20.9983 4.59787 16.9703 2.87187 11.5983Z" stroke={strockColor} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </G>
                    <G id="Stroke 3" opacity="0.4">
                        <Path d="M16 6.69995C17.07 7.04595 17.826 8.00095 17.917 9.12195" stroke="#3E4554" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <Path d="M16 6.69995C17.07 7.04595 17.826 8.00095 17.917 9.12195" stroke={color} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </G>
                </G>
            </G>


        </Svg>
    );
};

export default HeartIcon;
