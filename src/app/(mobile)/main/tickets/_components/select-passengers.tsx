'use client';
import React, { useCallback, useState } from 'react';
import Topbar from '@/components/topbar';
import PassengerCard from '@/components/passenger-card';
import Link from 'next/link';
import Button from '@/components/button';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getMyPassengersAction, getUserAction } from '../actions';
import { Steps } from '../types';
import { useSearchParams } from 'next/navigation';
import { Profile } from '@/data/user';
import CreatePassenger from './create-passenger';
import Spinner from '@/components/spinner';
import { getStringByNumber } from '@/utils/helper.';
import NewUser from './new-user';
import Skeleton from '@/components/skeleton';

export type User = Omit<Profile, 'phone_number' | 'email'> & {
    user_id: number;
};

type Props = {
    setStep: (step: Steps) => void;
    onPassengersSelect: (users: User[]) => void;
};

const SelectPassengers = (props: Props) => {
    const { setStep, onPassengersSelect } = props;
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const {
        data: user,
        isPending: isUserPending,
        refetch,
    } = useServerActionQuery(getUserAction, {
        input: undefined,
        queryKey: ['user'],
    });
    const {
        data: passengers,
        isPending: isPassengersPending,
        refetch: refetchPassengers,
    } = useServerActionQuery(getMyPassengersAction, {
        input: undefined,
        queryKey: ['passengers'],
    });

    const [isNewUserFormOpen, setIsNewUserFormOpen] = useState(false);

    const searchParams = useSearchParams();

    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;
    const isPassengerCountEnough =
        passengers && passengers?.length >= passengerCountParam;

    const handlePassengerClick = (user: User) => {
        if (!isPassengerCountEnough) {
            return;
        }
        setSelectedUsers((prevSelected) => {
            const isAlreadySelected = prevSelected.some(
                (selected) => selected.user_id === user.user_id
            );
            if (isAlreadySelected) {
                return prevSelected.filter(
                    (selected) => selected.user_id !== user.user_id
                );
            } else {
                if (prevSelected.length < passengerCountParam) {
                    return [...prevSelected, user];
                }
            }
            return prevSelected;
        });
    };

    const isSelected = useCallback(
        (user: User) =>
            selectedUsers.some((selected) => selected.user_id === user.user_id),
        [selectedUsers]
    );

    const handleAddPassenger = (user: User) => {
        setIsNewUserFormOpen(false);
    };

    if (!isUserPending && !user?.full_name) {
        return (
            <>
                <Topbar onBack={() => setStep(Steps.SelectPlace)}>
                    <div className="flex flex-col items-center">
                        Покупка билета
                    </div>
                </Topbar>
                <div className="flex flex-col px-5">
                    <div className="flex justify-center gap-3 py-5">
                        <NewUser
                            onSuccess={async () => {
                                await refetch();
                                await refetchPassengers();
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }

    if (isNewUserFormOpen) {
        return (
            <CreatePassenger
                onBack={() => setIsNewUserFormOpen(false)}
                onAddPassenger={handleAddPassenger}
            />
        );
    }

    if (isPassengersPending || isUserPending) {
        return <SelectPassengersSkeleton />;
    }

    return (
        <>
            <Topbar onBack={() => setStep(Steps.SelectPlace)}>
                <div className="flex flex-col items-center">Покупка билета</div>
            </Topbar>
            <div className="fade-in mt-[42px] flex flex-col px-5">
                <p className="mb-4 text-[30px] font-medium text-[#4A4A4A]">
                    Данные пассажиров
                </p>
                <div className="flex flex-col gap-3">
                    {passengers?.length !== 0 &&
                        passengers?.map((selectedUser) => (
                            <PassengerCard
                                key={selectedUser.user_id}
                                selected={isSelected(selectedUser)}
                                user={selectedUser}
                                onClick={() =>
                                    handlePassengerClick(selectedUser)
                                }
                            />
                        ))}
                </div>

                {!isPassengerCountEnough && (
                    <p className="mx-auto mt-3 w-fit rounded-full border-[1px] bg-[#E23333] px-4 py-2 text-xs font-medium text-white">
                        Вам нужно добавить хотя-бы{' '}
                        {passengerCountParam - (passengers?.length || 0)}{' '}
                        {getStringByNumber(
                            passengerCountParam - (passengers?.length || 0),
                            ['пассажира', 'пассажиров', 'пассажиров']
                        )}
                    </p>
                )}

                <Button
                    variant="ghost"
                    className="mt-6"
                    onClick={() => setIsNewUserFormOpen(true)}
                >
                    Добавить другого пассажира
                </Button>

                {selectedUsers.length === passengerCountParam && (
                    <Button
                        variant="secondary"
                        className="mb-6 mt-4"
                        onClick={() => onPassengersSelect(selectedUsers)}
                    >
                        Продолжить
                    </Button>
                )}
            </div>
        </>
    );
};

const SelectPassengersSkeleton = () => {
    return (
        <>
            <Topbar>
                <div className="flex flex-col items-center">
                    <div className="h-7 w-32" />
                </div>
            </Topbar>
            <div className="mt-[42px] flex flex-col px-5">
                <Skeleton className="mb-4 h-9 w-64" />{' '}
                {/* "Данные пассажиров" text */}
                <div className="flex flex-col gap-3">
                    {[...Array(1)].map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-20 w-full rounded-lg"
                        />
                    ))}
                </div>
                <Skeleton className="mt-6 h-12 w-full rounded-[10px]" />{' '}
                {/* "Добавить другого пассажира" button */}
                <Skeleton className="mb-6 mt-4 h-12 w-full rounded-[10px]" />{' '}
                {/* "Продолжить" button */}
            </div>
        </>
    );
};

export default SelectPassengers;
