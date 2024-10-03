import { payTicketAction } from '../actions';
import { useServerAction } from 'zsa-react';
import { Steps } from '../types';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Script from 'next/script';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
    ticked_id: number;
    totalPrice: number;
};

const Payment = (props: Props) => {
    const { ticked_id, totalPrice } = props;
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
            queryClient.invalidateQueries({
                queryKey: ['my-tickets'],
            });
            queryClient.invalidateQueries({
                queryKey: ['ticket', ticked_id],
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

    return (
        <div>
            <Script
                src="https://widget.onevisionpay.com"
                onReady={() => handleWidgetOpen()}
            />
            {isError && <div>Ошибка при оплате</div>}
        </div>
    );
};

export default Payment;
