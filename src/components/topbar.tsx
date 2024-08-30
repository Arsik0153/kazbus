'use client';
import BackIcon from '@/assets/shared/back-icon';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import React, { useEffect } from 'react';

type Props = React.HTMLProps<HTMLDivElement> & {
    backHref?: string;
    children: React.ReactNode;
    onBack?: () => void;
};

const Topbar = (props: Props) => {
    const { backHref, children, className, onBack, ...rest } = props;
    const [hideGap, setHideGap] = React.useState(false);

    useEffect(() => {
        const gap = !!localStorage.getItem('hideGap');
        setHideGap(gap);
    }, []);

    return (
        <div
            className={cn(
                'relative flex w-full items-center justify-between overflow-hidden rounded-b-[10px] bg-gradient-to-b from-[#E32828] to-[#E13535] px-5 pb-[26px]',
                {
                    'pt-[26px]': hideGap,
                    'pt-[65px]': !hideGap,
                }
            )}
        >
            {/* <div className="pointer-events-none absolute left-1/2 top-1/2 h-[521px] w-[120%] -translate-x-1/2 -translate-y-1/2 transform bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,rgba(255,255,255,0)_100%)] opacity-30"></div> */}
            {backHref && (
                <Link href={backHref}>
                    <BackIcon color="#fff" width={17} height={22} />
                </Link>
            )}
            {onBack && (
                <button onClick={onBack}>
                    <BackIcon color="#fff" width={17} height={22} />
                </button>
            )}
            <div
                className={`mx-auto text-xl font-medium tracking-[-3%] text-[#fff] ${className}`}
                {...rest}
            >
                {children}
            </div>
        </div>
    );
};

export default Topbar;
