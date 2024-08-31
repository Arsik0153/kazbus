import React from 'react';

const ChooseRow = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 10C11.7614 10 14 12.2386 14 15C14 17.7614 11.7614 20 9 20C6.23858 20 4 17.7614 4 15C4 12.2386 6.23858 10 9 10ZM10 12H8V13.999L6 14V16L8 15.999V18H10V15.999L12 16V14L10 13.999V12ZM17 0C17.5523 0 18 0.44772 18 1V7C18 7.5523 17.5523 8 17 8H1C0.44772 8 0 7.5523 0 7V1C0 0.44772 0.44772 0 1 0H17ZM2 2V6H16V2H2Z"
                fill={color} />
        </svg>
    );
};

export default ChooseRow;
