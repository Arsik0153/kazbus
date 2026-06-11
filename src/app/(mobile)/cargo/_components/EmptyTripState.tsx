const EmptyTripState = () => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5 text-center">
            <p className="leading-5.5 text-xl font-bold text-[#4A4A4A]">
                Сейчас нет активного рейса
            </p>
            <p className="mt-2 text-sm text-[#A0A0A0]">
                Когда диспетчер назначит новый маршрут, он появится здесь.
            </p>
        </div>
    );
};

export default EmptyTripState;
