import React from 'react';

const Upload = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 17H18V10H20V18C20 18.5523 19.5523 19 19 19H1C0.44772 19 0 18.5523 0 18V10H2V17ZM12 7V13H8V7H3L10 0L17 7H12Z"
                fill={color} />
        </svg>


    );
};

export default Upload;
