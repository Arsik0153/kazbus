import Button from '@/components/button';
import { Ticket } from '@/data/types';
import { payTicketAction } from '../actions';
import { useServerAction } from 'zsa-react';
import BackIcon from '@/assets/shared/back-icon';
import { Steps } from '../types';
import { useRouter } from 'next/navigation';

type Props = {
    ticked_id: number;
    setStep: (step: Steps) => void;
};

const Payment = (props: Props) => {
    const { ticked_id, setStep } = props;
    const router = useRouter();
    const { execute, isPending } = useServerAction(payTicketAction, {
        onSuccess: () => {
            router.push('/my-tickets');
        },
        onError: (data) => {
            console.log(data);
        },
    });

    const handleSubmit = () => {
        execute({
            ticket_id: ticked_id,
        });
    };

    return (
        <>
            <div className="h-full bg-[var(--gray)] px-5">
                <button
                    onClick={() => setStep(Steps.Booking)}
                    className="pt-[75px]"
                >
                    <BackIcon color="#4A4A4A" width={17} height={22} />
                </button>
                <h1 className="pt-[25px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
                    Оплата банковской картой
                </h1>

                <div className="mt-5 w-full rounded-[10px] bg-[#E23333] px-4 pb-4 pt-8">
                    <label
                        htmlFor="cardnumber"
                        className="font-medium text-white"
                    >
                        Номер карты
                    </label>
                    <input
                        type="text"
                        id="cardnumber"
                        className="hide-tabbar mt-2 h-[70px] w-full rounded-[10px] border border-white bg-[#FFFFFF14] px-4 text-white placeholder:text-white focus:outline-none"
                        placeholder="XXXX - XXXX - XXXX - XXXX"
                    />
                    <div className="flex gap-7">
                        <div className="mt-4 flex flex-col gap-2">
                            <label
                                htmlFor="date"
                                className="font-medium text-white"
                            >
                                Срок действия
                            </label>
                            <input
                                type="text"
                                id="date"
                                className="hide-tabbar h-[70px] w-[120px] rounded-[10px] border border-white bg-[#FFFFFF14] px-4 text-white placeholder:text-white focus:outline-none"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <label
                                htmlFor="cvv"
                                className="font-medium text-white"
                            >
                                CVV
                            </label>
                            <input
                                type="text"
                                id="cvv"
                                className="hide-tabbar h-[70px] w-[100px] rounded-[10px] border border-white bg-[#FFFFFF14] px-4 text-white placeholder:text-white focus:outline-none"
                                placeholder="XXX"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    className="mt-16"
                    type="button"
                    variant="secondary"
                    onClick={() => handleSubmit()}
                    loading={isPending}
                >
                    Оплатить
                </Button>
            </div>
        </>
    );
};

export default Payment;
