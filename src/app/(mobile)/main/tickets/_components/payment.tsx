import Button from '@/components/button';
import { Ticket } from '@/data/types';
import { payTicketAction } from '../actions';
import { useServerAction } from 'zsa-react';
import BackIcon from '@/assets/shared/back-icon';
import { Steps } from '../types';
import { useRouter } from 'next/navigation';
import { useMask } from '@react-input/mask';
import { v4 as uuidv4 } from 'uuid';
import Script from 'next/script';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
    ticked_id: number;
    setStep: (step: Steps) => void;
    totalPrice: number;
};

const Payment = (props: Props) => {
    const { ticked_id, setStep, totalPrice } = props;
    const queryClient = useQueryClient();
    const router = useRouter();
    const { execute } = useServerAction(payTicketAction, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tickets'],
            });
            queryClient.invalidateQueries({
                queryKey: ['bus-seats'],
            });
            closeWidget();
            router.push('/my-tickets');
        },
        onError: (data) => {
            console.log(data);
        },
    });
    const [isError, setIsError] = useState(false);

    const closeWidget = () => {
        // @ts-ignore
        const widget = document.getElementById('onevision-widget');
        if (widget) {
            widget.style.display = 'none';
        }
    };

    const handleWidgetOpen = () => {
        function openPaymentWidgetHandler() {
            // @ts-ignore
            openPaymentWidget(
                {
                    api_key: '9693c689-92b7-4b22-865d-4765a1523916', // Ваш API ключ
                    amount: totalPrice, // Сумма платежа (например, 1000 KZT)
                    currency: 'KZT', // Валюта платежа
                    order_id: uuidv4(), // Уникальный ID заказа
                    description: 'Покупка билета', // Описание платежа
                    payment_type: 'pay', // Тип платежа
                    payment_method: 'ecom', // Способ оплаты
                    items: [
                        {
                            merchant_id: '527868da-6fa5-4850-91ff-6ee7d3a67029', // ID продавца
                            service_id: 'eca0ac74-e61d-49bd-85a1-d30f9e4e15c5', // ID услуги
                            merchant_name: 'Example', // Название продавца
                            name: 'Билет', // Название товара
                            quantity: 1, // Количество товаров
                            amount_one_pcs: totalPrice, // Цена за штуку
                            amount_sum: totalPrice, // Общая сумма
                        },
                    ],
                    user_id: '1223345', // Уникальный идентификатор пользователя
                    email: 'example@gmail.com', // E-mail плательщика
                    phone: '+77777777777', // Телефон плательщика
                    // success_url: 'http://example.com/success', // URL успешной оплаты
                    // failure_url: 'http://example.com/failure', // URL неуспешной оплаты
                    // callback_url: 'http://example.com/callback', // URL для callback
                    payment_lifetime: 3600, // Время жизни платежа в секундах
                    create_recurrent_profile: false, // Создание рекуррентного профиля
                    recurrent_profile_lifetime: 0, // Срок действия рекуррентного профиля
                    lang: 'ru', // Язык интерфейса
                    extra_params: {},
                    payment_gateway_host: 'https://api.onevisionpay.com/', // Хост платежного API
                    payment_widget_host: 'https://widget.onevisionpay.com', // Хост виджета
                },
                (success: any) => {
                    console.log(success);
                    execute({
                        ticket_id: ticked_id,
                    });
                },
                (error: any) => {
                    console.log(error);
                    setIsError(true);
                }
            );
        }
        openPaymentWidgetHandler();
    };

    // const cardRef = useMask({
    //     mask: '____-____-____-____',
    //     replacement: { _: /\d/ },
    // });

    // const dateRef = useMask({
    //     mask: '__/__',
    //     replacement: { _: /\d/ },
    // });

    // const cvvRef = useMask({
    //     mask: '___',
    //     replacement: { _: /\d/ },
    // });

    return (
        <div>
            <Script
                src="https://widget.onevisionpay.com"
                onReady={() => handleWidgetOpen()}
            />
            {isError && <div>Ошибка при оплате</div>}
        </div>
    );

    // return (
    //     <>
    //         <div className="h-full bg-[var(--gray)] px-5">
    //             <button
    //                 onClick={() => setStep(Steps.Booking)}
    //                 className="pt-[75px]"
    //             >
    //                 <BackIcon color="#4A4A4A" width={17} height={22} />
    //             </button>
    //             <h1 className="pt-[25px] text-[42px] font-semibold leading-[46.2px] tracking-[-3%] text-[var(--black)]">
    //                 Оплата банковской картой
    //             </h1>

    //             <div className="mt-5 w-full rounded-[10px] bg-[#E23333] px-4 pb-4 pt-8">
    //                 <label
    //                     htmlFor="cardnumber"
    //                     className="font-medium text-white"
    //                 >
    //                     Номер карты
    //                 </label>
    //                 <input
    //                     type="tel"
    //                     id="cardnumber"
    //                     className="hide-tabbar mt-2 h-[70px] w-full rounded-[10px] border border-white bg-[#FFFFFF14] px-4 text-white placeholder:text-white focus:outline-none"
    //                     placeholder="XXXX - XXXX - XXXX - XXXX"
    //                     ref={cardRef}
    //                 />
    //                 <div className="flex gap-7">
    //                     <div className="mt-4 flex flex-col gap-2">
    //                         <label
    //                             htmlFor="date"
    //                             className="font-medium text-white"
    //                         >
    //                             Срок действия
    //                         </label>
    //                         <input
    //                             type="tel"
    //                             id="date"
    //                             className="hide-tabbar h-[70px] w-[120px] rounded-[10px] border border-white bg-[#FFFFFF14] px-4 text-white placeholder:text-white focus:outline-none"
    //                             placeholder="MM/YY"
    //                             ref={dateRef}
    //                         />
    //                     </div>
    //                     <div className="mt-4 flex flex-col gap-2">
    //                         <label
    //                             htmlFor="cvv"
    //                             className="font-medium text-white"
    //                         >
    //                             CVV
    //                         </label>
    //                         <input
    //                             type="tel"
    //                             id="cvv"
    //                             className="hide-tabbar h-[70px] w-[100px] rounded-[10px] border border-white bg-[#FFFFFF14] px-4 text-white placeholder:text-white focus:outline-none"
    //                             placeholder="XXX"
    //                             ref={cvvRef}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>

    //             <Button
    //                 className="mt-16"
    //                 type="button"
    //                 variant="secondary"
    //                 onClick={() => handleSubmit()}
    //                 loading={isPending}
    //             >
    //                 Оплатить
    //             </Button>
    //         </div>
    //     </>
    // );
};

export default Payment;
