import Skeleton from '@/components/skeleton';

import Topbar from '@/components/topbar';

export const SelectTicketSkeleton = () => {
    return (
        <>
            <Topbar backHref="/main">
                <div className="flex flex-col items-center">
                    <div className="mb-2 h-6 w-40" />
                    <div className="h-4 w-32" />
                </div>
            </Topbar>
            <div className="my-5 px-4">
                <div className="mb-5 flex flex-wrap gap-1">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-8 w-32 rounded-full" />
                    ))}
                </div>
                {[1, 2].map((i) => (
                    <Skeleton
                        key={i}
                        className="mb-3 h-[173px] w-full rounded-lg"
                    />
                ))}
            </div>
        </>
    );
};

export const SelectPlaceSkeleton = () => {
    return (
        <>
            <>
                <Topbar>
                    <div className="flex flex-col items-center">
                        <Skeleton className="mb-2 h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </Topbar>
                <div className="p-4">
                    <Skeleton className="mb-5 h-8 w-48" />
                    <div className="aspect-[2/3] w-full">
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>
                </div>
            </>
        </>
    );
};
