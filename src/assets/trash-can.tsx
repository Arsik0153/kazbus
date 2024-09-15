import React from 'react';

interface TrashCanProps {
    color?: string;
    width?: string;
    height?: string;
}

const TrashCan = ({ color, width = "14", height = "14" }: TrashCanProps) => {
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 14 14" 
            fill={color} 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10.333 2.99992H13.6663V4.33325H12.333V12.9999C12.333 13.3681 12.0345 13.6666 11.6663 13.6666H2.33301C1.96482 13.6666 1.66634 13.3681 1.66634 12.9999V4.33325H0.333008V2.99992H3.66634V0.999919C3.66634 0.631732 3.96482 0.333252 4.33301 0.333252H9.66634C10.0345 0.333252 10.333 0.631732 10.333 0.999919V2.99992ZM4.99967 6.33325V10.3333H6.33301V6.33325H4.99967ZM7.66634 6.33325V10.3333H8.99967V6.33325H7.66634ZM4.99967 1.66659V2.99992H8.99967V1.66659H4.99967Z" />
        </svg>
    );
}

export default TrashCan;
