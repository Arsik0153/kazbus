import React from 'react';

const Direction = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.20812 0.875164L0.0833282 4.99994L4.20605 9.12269L4.20688 5.83327H11.7917L11.7917 9.12427L15.9167 4.99952L11.7919 0.874756L11.7918 4.16661H4.2073L4.20812 0.875164Z" 
            fill={color} />
        </svg>

    );
};

export default Direction;
