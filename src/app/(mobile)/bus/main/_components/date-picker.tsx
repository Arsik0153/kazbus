import { dayjsExt } from '@/lib/dayjs';
import { useServerActionQuery } from '@/lib/server-action-hooks';
import { Dayjs } from 'dayjs';
import { getDatesAction } from '../actions';
import { AvailableDate } from '@/data/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const generateMonths = () => {
    const today = dayjsExt();
    return [today, today.add(1, 'month'), today.add(2, 'month')];
};

const renderDays = (
    month: Dayjs,
    handleDayClick: (day: Dayjs) => void,
    pricesByDate: Map<string, string>,
    selectedDate: string | null
) => {
    const today = dayjsExt().startOf('day');
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const startDayOfWeek = startOfMonth.day() === 0 ? 7 : startOfMonth.day();
    const days = [];

    for (let i = 1; i < startDayOfWeek; i++) {
        days.push(
            <div
                key={`empty-${i}`}
                className="flex h-14 items-center justify-center"
            ></div>
        );
    }

    for (
        let date = startOfMonth;
        date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day');
        date = date.add(1, 'day')
    ) {
        const dateString = date.format('YYYY-MM-DD');
        const isPast = date.isBefore(today, 'day');
        const price = pricesByDate.get(dateString);
        const isAvailable = !isPast && price !== undefined;
        const isSelected = selectedDate === dateString;
        days.push(
            <button
                type="button"
                key={dateString}
                className={`flex h-14 items-start justify-center rounded-lg ${
                    isSelected ? 'bg-[#FFF1F1]' : ''
                } ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => handleDayClick(date)}
                disabled={!isAvailable}
                aria-label={`${date.format('D MMMM')}${
                    price ? `, от ${formatPrice(price)}` : ', рейсов нет'
                }`}
            >
                <div
                    className={`flex flex-col items-center ${!isAvailable ? 'opacity-40' : ''}`}
                >
                    <div
                        className={`text-[22px] font-medium ${isSelected ? 'text-[#E74949]' : 'text-[var(--black)]'}`}
                    >
                        {date.date()}
                    </div>
                    <div className="text-xs text-[#E74949]">
                        {price ? formatPrice(price) : null}
                    </div>
                </div>
            </button>
        );
    }

    return days;
};

const renderMonth = (
    month: Dayjs,
    handleDayClick: (day: Dayjs) => void,
    pricesByDate: Map<string, string>,
    selectedDate: string | null
) => (
    <div key={month.format('YYYY-MM')} className="mb-5">
        <div className="my-4 flex items-center justify-center text-2xl font-bold capitalize text-[#E74949]">
            {month.format('MMMM')}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
            {renderDays(month, handleDayClick, pricesByDate, selectedDate)}
        </div>
    </div>
);

const formatPrice = (price: string) =>
    `${new Intl.NumberFormat('ru-KZ', { maximumFractionDigits: 0 }).format(
        Number(price)
    )} ₸`;

type Props = {
    handleSelectDate: () => void;
};

const DatePicker = (props: Props) => {
    const { handleSelectDate } = props;
    const months = generateMonths();

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const selectedDate = searchParams.get('date');
    const passengerCount = Number(searchParams.get('passenger_count')) || 1;
    const dateFrom = dayjsExt().startOf('day').format('YYYY-MM-DD');
    const dateTo = dayjsExt()
        .add(2, 'month')
        .endOf('month')
        .format('YYYY-MM-DD');
    const hasRoute = Boolean(Number(fromParam) && Number(toParam));

    const { data, isPending, error } = useServerActionQuery(getDatesAction, {
        input: {
            from: Number(fromParam),
            to: Number(toParam),
            passengerCount,
            dateFrom,
            dateTo,
        },
        queryKey: [
            'getDates',
            fromParam,
            toParam,
            passengerCount,
            dateFrom,
            dateTo,
        ],
        enabled: hasRoute,
    });

    const pricesByDate = new Map(
        (data || []).map((item: AvailableDate) => [item.date, item.price])
    );

    const handleDayClick = (day: Dayjs) => {
        handleSelectDate();
        updateSearchQuery({ date: day.format('YYYY-MM-DD') });
    };

    const updateSearchQuery = (updatedQuery: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updatedQuery).forEach(([key, value]) => {
            if (value !== null) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        const queryString = params.toString();
        const updatedPath = queryString
            ? `${pathname}?${queryString}`
            : pathname;
        router.push(updatedPath);
    };

    return (
        <div className="h-[calc(100vh-274px)] overflow-y-scroll px-5">
            {!hasRoute ? (
                <p className="py-8 text-center text-sm text-[#A0A0A0]">
                    Сначала выберите города отправления и прибытия.
                </p>
            ) : isPending ? (
                <p className="py-8 text-center text-sm text-[#A0A0A0]">
                    Загружаем доступные даты…
                </p>
            ) : error ? (
                <p className="py-8 text-center text-sm text-[#E74949]">
                    Не удалось загрузить даты. Попробуйте открыть календарь
                    снова.
                </p>
            ) : (
                months.map((month) =>
                    renderMonth(
                        month,
                        handleDayClick,
                        pricesByDate,
                        selectedDate
                    )
                )
            )}
        </div>
    );
};

export default DatePicker;
