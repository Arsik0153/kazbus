import { cargoOrderStatusMeta } from './CargoOrderDetailsDrawer';
import type { CargoShipperContact } from '../_types/cargo';
import { cn } from '@/utils/cn';

const TripOrdersCard = ({
    contacts,
    onSelectOrder,
}: {
    contacts: CargoShipperContact[];
    onSelectOrder: (contact: CargoShipperContact) => void;
}) => {
    return (
        <section className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl leading-5.5 font-bold text-[#4A4A4A]">
                    Текущие заказы
                </h2>
                <span className="text-sm font-medium text-[#A0A0A0]">
                    {contacts.length}
                </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
                {contacts.map((contact) => {
                    const status = cargoOrderStatusMeta[contact.status];

                    return (
                        <button
                            key={contact.id}
                            type="button"
                            onClick={() => onSelectOrder(contact)}
                            className="w-full rounded-[0.625rem] bg-[#F8F8F8] p-4 text-left active:bg-[#F0F0F0]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-row items-center gap-2">
                                    <p className="text-base leading-5 font-bold text-[#4A4A4A]">
                                        {contact.companyName}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#A0A0A0]">
                                        {contact.orderNumber}
                                    </p>
                                </div>
                                <span
                                    className={cn(
                                        'shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold',
                                        status.className
                                    )}
                                >
                                    {status.label}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 rounded-[0.5rem] bg-white p-3">
                                <p className="text-xs font-medium text-[#A0A0A0]">
                                    Тип груза
                                </p>
                                <p className="text-sm leading-5 font-semibold text-[#4A4A4A]">
                                    {contact.cargoTitle}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export default TripOrdersCard;
