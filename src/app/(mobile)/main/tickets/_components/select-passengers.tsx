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
    const { data: user, isPending: isUserPending } = useServerActionQuery(
        getUserAction,
        {
            input: undefined,
            queryKey: ['user'],
        }
    );
    const { data: passengers, isPending: isPassengersPending } =
        useServerActionQuery(getMyPassengersAction, {
            input: undefined,
            queryKey: ['passengers'],
        });

    const [isNewUserFormOpen, setIsNewUserFormOpen] = useState(false);

    const searchParams = useSearchParams();

    const passengerCountParam =
        Number(searchParams.get('passenger_count')) || 0;

    const handlePassengerClick = (user: User) => {
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

    if (isNewUserFormOpen) {
        return (
            <CreatePassenger
                onBack={() => setIsNewUserFormOpen(false)}
                onAddPassenger={handleAddPassenger}
            />
        );
    }

    if (isUserPending || isPassengersPending) {
        return (
            <>
                <Topbar onBack={() => setStep(Steps.SelectPlace)}>
                    <div className="flex flex-col items-center">
                        Покупка билета
                    </div>
                </Topbar>
                <div className="mt-[42px] flex flex-col px-5">
                    <p className="mb-4 text-[30px] font-medium text-[#4A4A4A]">
                        Данные пассажиров
                    </p>
                    <div className="flex justify-center gap-3 py-5">
                        <Spinner size="md" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar onBack={() => setStep(Steps.SelectPlace)}>
                <div className="flex flex-col items-center">Покупка билета</div>
            </Topbar>
            <div className="mt-[42px] flex flex-col px-5">
                <p className="mb-4 text-[30px] font-medium text-[#4A4A4A]">
                    Данные пассажиров
                </p>
                <div className="flex flex-col gap-3">
                    {user && user.document_number_or_iin && (
                        <PassengerCard
                            selected={isSelected(user)}
                            user={user}
                            onClick={() => handlePassengerClick(user)}
                        />
                    )}
                    {passengers?.length !== 0 &&
                        passengers
                            ?.filter(
                                (selectedUser) =>
                                    selectedUser.user_id !== user?.user_id &&
                                    selectedUser.document_number_or_iin // Проверка наличия ИИН
                            )
                            .map((selectedUser) => (
                                <PassengerCard
                                    key={selectedUser.user_id}
                                    selected={isSelected(selectedUser)}
                                    user={selectedUser}
                                    onClick={() => handlePassengerClick(selectedUser)}
                                />
                            ))}
                </div>

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

export default SelectPassengers;
