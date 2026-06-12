'use client';

import BackIcon from '@/assets/shared/back-icon';
import Button from '@/components/button';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useServerAction } from 'zsa-react';
import { payTicketAction } from '../actions';

type Props = {
    ticketId: number;
    onBack: () => void;
    onSuccess?: () => void;
};

const digitsOnly = (value: string, maxLength: number) =>
    value.replace(/\D/g, '').slice(0, maxLength);

const Payment = ({ ticketId, onBack, onSuccess }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const { execute, isPending } = useServerAction(payTicketAction, {
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['tickets'] }),
                queryClient.invalidateQueries({ queryKey: ['bus-seats'] }),
                queryClient.invalidateQueries({ queryKey: ['my-tickets'] }),
                queryClient.invalidateQueries({ queryKey: ['ticket'] }),
            ]);

            toast.success('Билет оплачен');

            if (onSuccess) {
                onSuccess();
                return;
            }

            router.push(`/bus/my-tickets/${ticketId}`);
        },
        onError: (data) => {
            toast.error(data.err.message || 'Не удалось оплатить билет');
        },
    });

    const formattedCardNumber = cardNumber
        .replace(/(\d{4})(?=\d)/g, '$1 - ')
        .padEnd(16, '');
    const isFormValid =
        cardNumber.length === 16 && expiry.length === 4 && cvv.length === 3;

    const handleExpiryChange = (value: string) => {
        const digits = digitsOnly(value, 4);
        setExpiry(digits);
    };

    const handleSubmit = () => {
        if (!isFormValid || isPending) {
            return;
        }

        execute({ ticket_id: ticketId });
    };

    return (
        <main className="fade-in flex min-h-[calc(100dvh-80px)] flex-col bg-white px-5 pb-8 pt-7 text-[#4A4A4A]">
            <button
                type="button"
                aria-label="Назад"
                onClick={onBack}
                className="mb-7 flex h-10 w-10 items-center justify-start"
            >
                <BackIcon color="#4A4A4A" width={17} height={22} />
            </button>

            <h1 className="max-w-[330px] text-[50px] font-semibold leading-[1.04] tracking-[-0.04em]">
                Оплата банковской картой
            </h1>

            <div className="mt-6 rounded-[10px] bg-[#EC3033] p-4 text-white">
                <label
                    htmlFor="card-number"
                    className="mb-2 block text-base font-medium"
                >
                    Номер карты
                </label>
                <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={formattedCardNumber.trimEnd()}
                    placeholder="XXXX  -  XXXX  -  XXXX  -  XXXX"
                    onChange={(event) =>
                        setCardNumber(digitsOnly(event.target.value, 16))
                    }
                    className="h-[70px] w-full rounded-[10px] border border-white bg-transparent px-5 text-center text-lg font-medium text-white outline-none placeholder:text-white"
                />

                <div className="mt-3 grid grid-cols-[1.2fr_1fr] gap-5">
                    <div>
                        <label
                            htmlFor="card-expiry"
                            className="mb-2 block text-base font-medium"
                        >
                            Срок действия
                        </label>
                        <input
                            id="card-expiry"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={
                                expiry.length > 2
                                    ? `${expiry.slice(0, 2)}/${expiry.slice(2)}`
                                    : expiry
                            }
                            placeholder="__/__"
                            onChange={(event) =>
                                handleExpiryChange(event.target.value)
                            }
                            className="h-[70px] w-full rounded-[10px] border border-white bg-transparent px-4 text-center text-2xl font-medium text-white outline-none placeholder:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="card-cvv"
                            className="mb-2 block text-base font-medium"
                        >
                            CVV
                        </label>
                        <input
                            id="card-cvv"
                            type="password"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={cvv}
                            placeholder="•••"
                            onChange={(event) =>
                                setCvv(digitsOnly(event.target.value, 3))
                            }
                            className="h-[70px] w-full rounded-[10px] border border-white bg-transparent px-4 text-center text-2xl font-medium tracking-[0.3em] text-white outline-none placeholder:text-white"
                        />
                    </div>
                </div>
            </div>

            <Button
                type="button"
                variant="secondary"
                loading={isPending}
                disabled={!isFormValid}
                onClick={handleSubmit}
                className="mt-auto min-h-[72px] bg-[#EC3033]"
            >
                Оплатить
            </Button>
        </main>
    );
};

export default Payment;
