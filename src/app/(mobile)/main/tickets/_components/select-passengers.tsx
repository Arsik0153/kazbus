'use client';
import React, { useCallback, useState } from 'react';
import Topbar from '@/components/topbar';
import PassengerCard from '@/components/passenger-card';
import Link from 'next/link';
import Button from '@/components/button';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { getUserAction } from '../actions';
import { Steps } from '../types';
import { useSearchParams } from 'next/navigation';
import { Profile } from '@/data/user';
import CreatePassenger from './create-passenger';

export type User = Omit<Profile, 'phone_number'> & {
    user_id: number;
};

type Props = {
    setStep: (step: Steps) => void;
    onPassengersSelect: (users: User[]) => void;
};

// const passenger = {
//     full_name: 'Максим Максимович',
//     document_type: 'id',
//     document_number_or_iin: '123213123312',
//     birth_date: '12.12.2000',
//     user_id: 17,
//     email: 'asdfasdf',
// };

const SelectPassengers = (props: Props) => {
    const { setStep, onPassengersSelect } = props;
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { data: user } = useServerActionQuery(getUserAction, {
        input: undefined,
        queryKey: ['user'],
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
        setUsers((prevSelected) => [...prevSelected, user]);
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
                    {user && (
                        <PassengerCard
                            selected={isSelected(user)}
                            user={user}
                            onClick={() => handlePassengerClick(user)}
                        />
                    )}
                    {users
                        .filter(
                            (selectedUser) =>
                                selectedUser.user_id !== user?.user_id
                        )
                        .map((selectedUser) => (
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
