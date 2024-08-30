import React from 'react';

const Cursor = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="14" height="21" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.9093 11.3604L11.0007 19.8538L8.1816 20.8799L5.0902 12.3865L0.917969 15.5423L2.4087 0.633301L13.134 11.096L7.9093 11.3604Z"
                fill={color} />
        </svg>

    );
};

export default Cursor;
