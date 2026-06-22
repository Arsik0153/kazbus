'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { Drawer } from 'vaul';
import type {
    CargoShipperContact,
    CargoShipperContactStatus,
} from '../_types/cargo';

export const cargoOrderStatusMeta: Record<
    CargoShipperContactStatus,
    { className: string; label: string }
> = {
    loaded: {
        label: 'Загружен',
        className: 'bg-[#E8F7D9] text-[#5E9F14]',
    },
    inTransit: {
        label: 'В пути',
        className: 'bg-[#FFF2F2] text-[#E23333]',
    },
    awaitingDelivery: {
        label: 'Ожидает',
        className: 'bg-[#fafafa] text-[#7A7A7A]',
    },
};

const copyToClipboard = async (value: string) => {
    try {
        await navigator.clipboard.writeText(value);
        toast.success('Скопировано');
        return true;
    } catch {
        toast.error('Не удалось скопировать');
        return false;
    }
};

const OrderDetailRow = ({
    label,
    value,
    copied,
    onCopy,
}: {
    label: string;
    value: string;
    copied: boolean;
    onCopy: () => void;
}) => (
    <div className="flex items-start justify-between gap-3 border-t border-[#EFEFEF] py-3 first:border-t-0 first:pt-0 last:pb-0">
        <p className="text-sm font-medium text-[#A0A0A0]">{label}</p>
        <div className="flex max-w-[68%] items-start justify-end gap-2">
            <p className="text-right text-sm font-semibold leading-5 text-[#4A4A4A]">
                {value}
            </p>
            <button
                type="button"
                onClick={onCopy}
                aria-label={
                    copied ? `${label} скопировано` : `Скопировать ${label}`
                }
                className={`mt-[-0.1875rem] flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F8F8F8] transition-colors active:bg-[#EFEFEF] ${
                    copied
                        ? 'text-[#A0A0A0]'
                        : 'text-[#A0A0A0] active:text-[#A0A0A0]'
                }`}
            >
                {copied ? (
                    <Check className="size-4" strokeWidth={3} />
                ) : (
                    <Copy className="size-4" />
                )}
            </button>
        </div>
    </div>
);

const ShipperOrderDetails = ({ order }: { order: CargoShipperContact }) => {
    const status = cargoOrderStatusMeta[order.status];
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setCopiedKey(null);
    }, [order.id]);

    useEffect(() => {
        return () => {
            if (copyResetTimeout.current) {
                clearTimeout(copyResetTimeout.current);
            }
        };
    }, []);

    const handleCopy = async (key: string, value: string) => {
        const copied = await copyToClipboard(value);

        if (!copied) {
            return;
        }

        setCopiedKey(key);

        if (copyResetTimeout.current) {
            clearTimeout(copyResetTimeout.current);
        }

        copyResetTimeout.current = setTimeout(() => {
            setCopiedKey(null);
        }, 1800);
    };

    return (
        <div className="space-y-5">
            <div className="rounded-[0.875rem] border border-[#E8E8E8] bg-[#FBFBFB] p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xl font-bold leading-[1.4rem] text-[#4A4A4A]">
                            {order.companyName}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[#A0A0A0]">
                            {order.orderNumber}
                        </p>
                    </div>
                    <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Тип груза
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-[#4A4A4A]">
                        {order.cargoTitle}
                    </p>
                </div>
                <div className="rounded-xl bg-[#F8F8F8] p-3">
                    <p className="text-xs font-medium text-[#A0A0A0]">
                        Контакт
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-[#4A4A4A]">
                        {order.contactName}
                    </p>
                </div>
            </div>

            <div className="rounded-[0.875rem] border border-[#E8E8E8] bg-white p-4">
                <OrderDetailRow
                    label="Телефон"
                    value={order.phone}
                    copied={copiedKey === 'phone'}
                    onCopy={() => void handleCopy('phone', order.phone)}
                />
                <OrderDetailRow
                    label="Забрать"
                    value={order.pickupPoint}
                    copied={copiedKey === 'pickupPoint'}
                    onCopy={() =>
                        void handleCopy('pickupPoint', order.pickupPoint)
                    }
                />
                <OrderDetailRow
                    label="Адрес забора"
                    value={order.pickupAddress}
                    copied={copiedKey === 'pickupAddress'}
                    onCopy={() =>
                        void handleCopy('pickupAddress', order.pickupAddress)
                    }
                />
                <OrderDetailRow
                    label="Доставить"
                    value={order.dropoffPoint}
                    copied={copiedKey === 'dropoffPoint'}
                    onCopy={() =>
                        void handleCopy('dropoffPoint', order.dropoffPoint)
                    }
                />
                <OrderDetailRow
                    label="Адрес доставки"
                    value={order.dropoffAddress}
                    copied={copiedKey === 'dropoffAddress'}
                    onCopy={() =>
                        void handleCopy('dropoffAddress', order.dropoffAddress)
                    }
                />
            </div>

            <div className="flex flex-row items-center justify-between gap-1.5">
                <a
                    href={`tel:${order.phone.replaceAll(' ', '')}`}
                    className="flex min-h-14 w-full items-center justify-center rounded-[0.625rem] bg-[#E23333] px-4 py-4 text-sm font-semibold text-white active:bg-[#D92727]"
                >
                    Позвонить shipper
                </a>
            </div>
        </div>
    );
};

type CargoOrderDetailsDrawerProps = {
    order: CargoShipperContact | null;
    onOpenChange: (open: boolean) => void;
};

const CargoOrderDetailsDrawer = ({
    order,
    onOpenChange,
}: CargoOrderDetailsDrawerProps) => {
    return (
        <Drawer.Root open={!!order} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[88vh] flex-col rounded-t-2xl bg-white">
                    {order && (
                        <div className="overflow-y-auto px-5 pb-8 pt-4">
                            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D6D6D6]" />
                            <Drawer.Title className="text-center text-xl font-bold text-[#4A4A4A]">
                                Детали заказа
                            </Drawer.Title>
                            <Drawer.Description className="sr-only">
                                Полная информация по заказу shipper для водителя
                            </Drawer.Description>

                            <div className="mt-5">
                                <ShipperOrderDetails order={order} />
                            </div>
                        </div>
                    )}
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

export default CargoOrderDetailsDrawer;
