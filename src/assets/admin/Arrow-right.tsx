import React from 'react';

const ArrowRight = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.78121 6.66657L0.66683 6.66657L0.66683 5.33324L8.78121 5.33324L5.20523 1.75727L6.14803 0.814453L11.3335 5.99991L6.14803 11.1854L5.20523 10.2426L8.78121 6.66657Z" 
            fill={color} />
        </svg>






    );
};

export default ArrowRight;
