import React from 'react';

interface TrashCanProps {
    color?: string;
    width?: string;
    height?: string;
}

const Door = ({ color, width = "14", height = "14" }: TrashCanProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0.498047 19.5001V17.5001L2.49805 17.4999V3.33465C2.49805 2.85136 2.84367 2.43723 3.31916 2.35078L12.7907 0.628679C13.1167 0.569399 13.4291 0.785639 13.4884 1.11167C13.4948 1.14708 13.498 1.18301 13.498 1.219V2.4999L17.498 2.50007C18.0503 2.50007 18.498 2.94779 18.498 3.50007V17.4999L20.498 17.5001V19.5001H16.498V4.50007L13.498 4.4999V19.5001H0.498047ZM10.498 9.5001H8.49805V11.5001H10.498V9.5001Z"
                fill={color} />
        </svg>

    );
}

export default Door;
