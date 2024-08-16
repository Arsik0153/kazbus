import React from 'react';

const Yes = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.17503 5.99999L0.62915 1.45411L1.45411 0.62915L5.99998 5.17498L10.5458 0.62915L11.3708 1.45411L6.82493 5.99999L11.3708 10.5458L10.5458 11.3708L5.99998 6.82494L1.45411 11.3708L0.62915 10.5458L5.17503 5.99999Z"
            fill={color} />
        </svg>





    );
};

export default Yes;
