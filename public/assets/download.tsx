import React from 'react'

const Download = ({color} : { color? : string}) => {
    return (
        <svg width="19" height="20" viewBox="0 0 19 20" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 18H18.5V20H0.5V18ZM10.5 8H17.5L9.5 16L1.5 8H8.5V0H10.5V8Z" fill={color} />
        </svg>
    )
}

export default Download;