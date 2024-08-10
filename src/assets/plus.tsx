import React from 'react';

interface PlusProps {
    color: string;
    width: number;
    height: number;
}

const Plus: React.FC<PlusProps> = ({ color, width, height }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M7.00004 13.6668C3.31814 13.6668 0.333374 10.682 0.333374 7.00016C0.333374 3.31826 3.31814 0.333496 7.00004 0.333496C10.6819 0.333496 13.6667 3.31826 13.6667 7.00016C13.6667 10.682 10.6819 13.6668 7.00004 13.6668ZM6.33337 6.3335H3.66671V7.66683H6.33337V10.3335H7.66671V7.66683H10.3334V6.3335H7.66671V3.66683H6.33337V6.3335Z"
                fill={color} />
        </svg>

    );
};

export default Plus;
// now to use
{/* <Plus color="#fff" width={20} height={20} /> */ }
