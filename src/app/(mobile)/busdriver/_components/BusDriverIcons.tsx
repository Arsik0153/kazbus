import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
    color?: string;
};

export const ScanIcon = ({
    color = '#E23333',
    width = 20,
    height = 20,
    ...rest
}: IconProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                d="M1 6V3.5C1 2.11929 2.11929 1 3.5 1H6M14 1H16.5C17.8807 1 19 2.11929 19 3.5V6M19 14V16.5C19 17.8807 17.8807 19 16.5 19H14M6 19H3.5C2.11929 19 1 17.8807 1 16.5V14"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M5 10H15"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M7 7H13V13H7V7Z"
                fill={color}
                fillOpacity="0.18"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export const SeatIcon = ({
    color = '#E23333',
    width = 20,
    height = 20,
    ...rest
}: IconProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                d="M5.5 3.5C5.5 2.67157 6.17157 2 7 2H10C10.8284 2 11.5 2.67157 11.5 3.5V8C11.5 8.55228 11.9477 9 12.5 9H14.25C15.2165 9 16 9.7835 16 10.75V13.5H4V7.5C4 6.67157 4.67157 6 5.5 6H5.5V3.5Z"
                fill={color}
            />
            <path
                d="M4 14.5H16V16C16 16.5523 15.5523 17 15 17H14C13.4477 17 13 16.5523 13 16V15.5H7V16C7 16.5523 6.55228 17 6 17H5C4.44772 17 4 16.5523 4 16V14.5Z"
                fill={color}
                opacity="0.24"
            />
        </svg>
    );
};

export const IssueIcon = ({
    color = '#E23333',
    width = 18,
    height = 18,
    ...rest
}: IconProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                d="M9 1.5L16.125 14.25C16.4165 14.7715 16.0444 15.4125 15.4453 15.4125H2.55469C1.95558 15.4125 1.58348 14.7715 1.875 14.25L9 1.5Z"
                fill={color}
                opacity="0.18"
            />
            <path
                d="M9 6V9.75"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M9 12.375V12.5625"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M9 1.5L16.125 14.25C16.4165 14.7715 16.0444 15.4125 15.4453 15.4125H2.55469C1.95558 15.4125 1.58348 14.7715 1.875 14.25L9 1.5Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
};
