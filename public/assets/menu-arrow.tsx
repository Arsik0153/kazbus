import React from 'react'

const MenuArrow = ({ color }: { color?: string }) => {
    return (
        <svg width="6" height="10" viewBox="0 0 6 10" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M3.87835 5.00052L0.166016 1.2882L1.22668 0.227539L5.99965 5.00052L1.22668 9.77345L0.166016 8.7128L3.87835 5.00052Z" fill={color} />
        </svg>

    )
}

export default MenuArrow;