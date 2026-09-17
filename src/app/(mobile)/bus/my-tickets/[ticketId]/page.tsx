'use client';
import React, { use, useState } from 'react';
import Button from '@/components/button';
import Download from '@/assets/download';
import Topbar from '@/components/topbar';
import {
    downloadTicketPdfAction,
    getTicketByIdAction,
    refundTicketAction,
} from './actions';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import Ticket from './ticket';
import Spinner from '@/components/spinner';
import Skeleton from '@/components/skeleton';
import Payment from '../../main/tickets/_components/payment';
import { useServerAction } from 'zsa-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const MyTicketPage = ({ params }: { params: Promise<{ ticketId: string }> }) => {
    const { ticketId } = use(params);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data, isLoading } = useServerActionQuery(getTicketByIdAction, {
        input: { ticket_id: Number(ticketId) },
        queryKey: ['ticket', ticketId],
    });
    const [paymentWidgetOpen, setPaymentWidgetOpen] = useState(false);
    const [refundConfirmationOpen, setRefundConfirmationOpen] = useState(false);
    const { execute: downloadTicket, isPending: isTicketDownloading } =
        useServerAction(downloadTicketPdfAction, {
            onSuccess: ({ data: pdf }) => {
                const binary = window.atob(pdf.base64);
                const bytes = Uint8Array.from(binary, (char) =>
                    char.charCodeAt(0)
                );
                const url = URL.createObjectURL(
                    new Blob([bytes], { type: 'application/pdf' })
                );
                const link = document.createElement('a');
                link.href = url;
                link.download = pdf.filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            },
            onError: (error) => {
                toast.error(error.err.message || 'Не удалось скачать билет');
            },
        });
    const { execute: refundTicket, isPending: isTicketRefunding } =
        useServerAction(refundTicketAction, {
            onSuccess: async () => {
                await Promise.all(
                    [
                        ['tickets'],
                        ['my-tickets'],
                        ['ticket'],
                        ['passengers'],
                        ['bus-seats'],
                    ].map((queryKey) =>
                        queryClient.invalidateQueries({
                            queryKey,
                            refetchType: 'all',
                        })
                    )
                );
                setRefundConfirmationOpen(false);
                toast.success('Возврат оформлен');
                router.refresh();
            },
            onError: (error) => {
                toast.error(error.err.message || 'Не удалось оформить возврат');
            },
        });

    if (isLoading || !data) {
        return <MyTicketPageSkeleton ticketId={ticketId} />;
    }

    if (paymentWidgetOpen) {
        return (
            <Payment
                ticketId={data.id}
                onBack={() => setPaymentWidgetOpen(false)}
                onSuccess={() => setPaymentWidgetOpen(false)}
            />
        );
    }

    return (
        <>
            <Topbar backHref="/bus/my-tickets">Билет №{ticketId}</Topbar>
            <div className="fade-in p-5">
                <Ticket ticket={data} />
                <div className="mb-2 flex flex-row justify-between gap-3 rounded-lg border border-[#D1D1D1] bg-none p-5">
                    <p className="text-base font-normal text-[#4A4A4A]">
                        Гос. номер транспорта
                    </p>
                    <p className="text-base font-bold text-[#E74949]">
                        {data.direction.bus.state_number}
                    </p>
                </div>
                {data.passengers.map((passenger) => (
                    <div
                        key={passenger.passenger}
                        className="mb-2 flex flex-col justify-between gap-2 rounded-lg border border-[#D1D1D1] bg-none p-5"
                    >
                        <p className="text-xs font-bold text-[#A0A0A0] uppercase">
                            Пассажир
                        </p>
                        <p className="text-base font-medium text-[#4A4A4A]">
                            {passenger.passenger}
                        </p>
                        <div className="flex flex-row justify-between gap-3">
                            <p className="text-base font-normal text-[#4A4A4A]">
                                Место
                            </p>
                            <p className="text-base font-bold text-[#E74949]">
                                {passenger.place_num}
                            </p>
                        </div>
                    </div>
                ))}
                {data.status === 'Booked' && (
                    <Button
                        variant="ghost"
                        className="border border-[#D21F1F]"
                        onClick={() => setPaymentWidgetOpen(true)}
                    >
                        Оплатить банковской картой
                    </Button>
                )}
                <div className="mt-8 w-full rounded-[10px] bg-[#F9F9F9] px-4 pt-6 pb-1">
                    <div className="pb-[20px] text-[20px] leading-[22px] font-bold">
                        Действия
                    </div>
                    <div className="flex flex-col">
                        {data.status === 'Payed' && (
                            <>
                                <button
                                    type="button"
                                    disabled={isTicketDownloading}
                                    onClick={() =>
                                        downloadTicket({
                                            ticket_id: data.id,
                                        })
                                    }
                                    className="flex flex-row items-center justify-between py-4 text-left disabled:opacity-50"
                                >
                                    <span className="flex items-center gap-3 text-[16px] leading-[17.6px] font-normal">
                                        Скачать билет
                                    </span>
                                    {isTicketDownloading && (
                                        <Spinner size="sm" color="#E74949" />
                                    )}
                                </button>
                                <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            </>
                        )}
                        {data.status === 'Payed' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setRefundConfirmationOpen(true)
                                    }
                                    className="flex w-full flex-row items-center justify-between py-4 text-left"
                                >
                                    Оформить возврат
                                </button>
                                {refundConfirmationOpen && (
                                    <div className="mb-4 rounded-[10px] border border-[#D1D1D1] bg-white p-4">
                                        <p className="text-base font-medium text-[#4A4A4A]">
                                            Подтвердить возврат билета?
                                        </p>
                                        <div className="mt-4 flex gap-3">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={isTicketRefunding}
                                                onClick={() =>
                                                    setRefundConfirmationOpen(
                                                        false
                                                    )
                                                }
                                            >
                                                Отмена
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                loading={isTicketRefunding}
                                                onClick={() =>
                                                    refundTicket({
                                                        ticket_id: data.id,
                                                    })
                                                }
                                            >
                                                Подтвердить возврат
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const MyTicketPageSkeleton = ({ ticketId }: { ticketId: string }) => {
    return (
        <>
            <Topbar backHref="/bus/my-tickets">Билет №{ticketId}</Topbar>
            <div className="p-5">
                <Skeleton className="mt-2 mb-2 h-[174px] w-full rounded-lg" />{' '}
                {/* Ticket component placeholder */}
                <Skeleton className="mb-2 h-[60px] w-full rounded-lg" />{' '}
                {/* Bus number placeholder */}
                <Skeleton className="mb-2 h-[120px] w-full rounded-lg" />
                <div className="mt-8 w-full rounded-[10px] bg-[#F9F9F9] px-4 pt-6 pb-1">
                    <div className="pb-[20px] text-[20px] leading-[22px] font-bold">
                        Действия
                    </div>
                    <div className="flex flex-col">
                        <Skeleton className="mb-1 h-[50px] w-full rounded-lg" />
                        <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                        <Skeleton className="mb-1 h-[50px] w-full rounded-lg" />
                        <div className="color-[#E9E9E9] h-1 w-full border-t"></div>
                        <Skeleton className="mb-1 h-[50px] w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyTicketPage;
