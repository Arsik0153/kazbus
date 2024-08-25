import React from 'react';

const ChooseRow = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 0C7.5523 0 8 0.44772 8 1V17C8 17.5523 7.5523 18 7 18H1C0.44772 18 0 17.5523 0 17V1C0 0.44772 0.44772 0 1 0H7ZM6 2H2V16H6V2ZM15 4C17.7614 4 20 6.23858 20 9C20 11.7614 17.7614 14 15 14C12.2386 14 10 11.7614 10 9C10 6.23858 12.2386 4 15 4ZM16 6H14V7.999L12 8V10L14 9.999V12H16V9.999L18 10V8L16 7.999V6Z"
                fill={color} />
        </svg>
    );
};

export default ChooseRow;
