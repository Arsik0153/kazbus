import React from 'react'

const ArrowRightIcon = ({ color }: { color?: string }) => {
    return (

        <svg width="20" height="20" viewBox="0 0 20 20" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M10 9L10 6L14 10L10 14V11L6 11L6 9L10 9ZM10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0ZM10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18Z" fill={color} />
        </svg>

    )
}

export default ArrowRightIcon;