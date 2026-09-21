import type { Assignment } from '../_api/schema';

export default function LiveSeatMap({
    assignment,
}: {
    assignment: Assignment;
}) {
    const { trip, run } = assignment;
    const seats = trip.bus.seats.filter(
        (seat) => seat.seat_type === 'passenger'
    );
    const paid = run.passengers.filter(
        (passenger) => passenger.ticketStatus === 'Payed'
    );
    const booked = run.passengers.filter(
        (passenger) => passenger.ticketStatus === 'Booked'
    );
    return (
        <section className="rounded-xl border border-[#D1D1D1] bg-white p-5">
            <h2 className="mb-3 font-semibold">Места на {run.tripDate}</h2>
            <p className="mb-4 text-sm">
                Оплачено: {paid.length} · Бронь: {booked.length} · Свободно:{' '}
                {Math.max(
                    0,
                    run.passengerCapacity - paid.length - booked.length
                )}
            </p>
            {seats.length === 0 ? (
                <p className="text-sm">Схема мест не настроена диспетчером.</p>
            ) : (
                <div className="grid grid-cols-4 gap-3">
                    {[...seats]
                        .sort(
                            (a, b) =>
                                a.seat_row - b.seat_row ||
                                a.seat_col - b.seat_col
                        )
                        .map((seat) => {
                            const passenger = run.passengers.find(
                                (item) =>
                                    item.seatNumber === String(seat.seat_id)
                            );
                            const label =
                                passenger?.ticketStatus === 'Payed'
                                    ? 'Оплачено'
                                    : passenger
                                      ? 'Бронь'
                                      : 'Свободно';
                            return (
                                <div
                                    key={seat.seat_id}
                                    className={`rounded-lg border p-3 text-center text-xs ${passenger ? 'border-[#E23333] bg-red-50' : 'border-[#D1D1D1]'}`}
                                >
                                    <strong className="block text-lg">
                                        {seat.seat_id}
                                    </strong>
                                    {label}
                                </div>
                            );
                        })}
                </div>
            )}
        </section>
    );
}
