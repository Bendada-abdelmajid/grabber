import { Icon } from '@/libs/types';
import React from 'react';
import Svg, { G, Path } from 'react-native-svg';



const CategoryIcon = ({ color = '#3E4554', strockColor = "black", fill = 'none', size = 24 }: Icon) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <G id="Iconly/Curved/Category">
        <G id="Category">
          <G id="Stroke 1">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.0005 6.6738C21.0005 8.7024 19.3553 10.3476 17.3267 10.3476C15.2981 10.3476 13.6538 8.7024 13.6538 6.6738C13.6538 4.6452 15.2981 3 17.3267 3C19.3553 3 21.0005 4.6452 21.0005 6.6738Z"
               stroke={strockColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.0005 6.6738C21.0005 8.7024 19.3553 10.3476 17.3267 10.3476C15.2981 10.3476 13.6538 8.7024 13.6538 6.6738C13.6538 4.6452 15.2981 3 17.3267 3C19.3553 3 21.0005 4.6452 21.0005 6.6738Z"
              stroke={strockColor}
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
          <G id="Stroke 3">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.3467 6.6738C10.3467 8.7024 8.7024 10.3476 6.6729 10.3476C4.6452 10.3476 3 8.7024 3 6.6738C3 4.6452 4.6452 3 6.6729 3C8.7024 3 10.3467 4.6452 10.3467 6.6738Z"
               stroke={strockColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.3467 6.6738C10.3467 8.7024 8.7024 10.3476 6.6729 10.3476C4.6452 10.3476 3 8.7024 3 6.6738C3 4.6452 4.6452 3 6.6729 3C8.7024 3 10.3467 4.6452 10.3467 6.6738Z"
              stroke={strockColor}
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
          <G id="Stroke 5">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.0005 17.2619C21.0005 19.2905 19.3553 20.9348 17.3267 20.9348C15.2981 20.9348 13.6538 19.2905 13.6538 17.2619C13.6538 15.2333 15.2981 13.5881 17.3267 13.5881C19.3553 13.5881 21.0005 15.2333 21.0005 17.2619Z"
               stroke={strockColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.0005 17.2619C21.0005 19.2905 19.3553 20.9348 17.3267 20.9348C15.2981 20.9348 13.6538 19.2905 13.6538 17.2619C13.6538 15.2333 15.2981 13.5881 17.3267 13.5881C19.3553 13.5881 21.0005 15.2333 21.0005 17.2619Z"
              stroke={strockColor}
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
          <G id="Stroke 7">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.3467 17.2619C10.3467 19.2905 8.7024 20.9348 6.6729 20.9348C4.6452 20.9348 3 19.2905 3 17.2619C3 15.2333 4.6452 13.5881 6.6729 13.5881C8.7024 13.5881 10.3467 15.2333 10.3467 17.2619Z"
               stroke={strockColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.3467 17.2619C10.3467 19.2905 8.7024 20.9348 6.6729 20.9348C4.6452 20.9348 3 19.2905 3 17.2619C3 15.2333 4.6452 13.5881 6.6729 13.5881C8.7024 13.5881 10.3467 15.2333 10.3467 17.2619Z"
              stroke={strockColor}
              strokeOpacity="0.2"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default CategoryIcon;
