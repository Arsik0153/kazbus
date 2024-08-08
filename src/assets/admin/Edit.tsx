import React from 'react';

const Edit = ({
    color,
    ...rest
}: { color: string } & React.SVGProps<SVGSVGElement>) => {
    return (

        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.24264 15.9967H0V11.754L11.435 0.319013C11.8256 -0.0715069 12.4587 -0.0715069 12.8492 0.319013L15.6777 3.14744C16.0682 3.53796 16.0682 4.17113 15.6777 4.56165L4.24264 15.9967ZM0 17.9967H18V19.9967H0V17.9967Z" fill={color} />
        </svg>

    );
};

export default Edit;
