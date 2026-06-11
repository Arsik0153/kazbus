import { ScanIcon } from './BusDriverIcons';

const QRCodeScannerPlaceholder = () => {
    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="rounded-[0.625rem] border border-dashed border-[#F0B5B5] bg-[#FFFCFC] px-5 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E23333]">
                    <ScanIcon color="#FFF" width={28} height={28} />
                </div>
                <h2 className="mt-5 text-[1.75rem] font-bold leading-[1.925rem] text-[#4A4A4A]">
                    Сканирование билета
                </h2>
                <p className="mt-3 text-base leading-[1.375rem] text-[#A0A0A0]">
                    Покажите QR-код или номер билета пассажира для быстрой
                    проверки перед отправлением.
                </p>
            </div>
        </div>
    );
};

export default QRCodeScannerPlaceholder;
