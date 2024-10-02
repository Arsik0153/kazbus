import Topbar from '@/components/topbar';
import React from 'react';

const PersonalDataSkeleton = () => {
    return (
        <>
            <Topbar backHref="/profile">Мои личные данные</Topbar>

            <div className="h-full animate-pulse px-5">
                <div className="mt-10">
                    {/* Document type title skeleton */}
                    <div className="mb-3 h-7 w-1/2 rounded-md bg-gray-200"></div>

                    {/* Radio buttons skeleton */}
                    {[1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className="mb-2 h-[66px] rounded-md bg-gray-200"
                        ></div>
                    ))}

                    {/* Inputs skeleton */}
                    <div className="mb-8 mt-10">
                        {[1, 2].map((index) => (
                            <div
                                key={index}
                                className="mb-2 h-[80px] rounded-md bg-gray-200"
                            ></div>
                        ))}
                    </div>

                    {/* Button skeleton */}
                    <div className="h-[70px] rounded-md bg-gray-200"></div>
                </div>
            </div>
        </>
    );
};

export default PersonalDataSkeleton;
