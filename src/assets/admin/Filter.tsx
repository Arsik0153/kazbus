import React from 'react';

const Filter = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11L0 2V0H16V2L10 11V17L6 19V11Z"
                fill={color} />
        </svg>



    );
};

export default Filter;
