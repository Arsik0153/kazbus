'use client';
import { useEffect, useRef, useState } from 'react';

type Detector = {
    detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};
type DetectorConstructor = new (options: { formats: string[] }) => Detector;
function detectorConstructor(): DetectorConstructor | null {
    if (
        'BarcodeDetector' in window &&
        typeof window.BarcodeDetector === 'function'
    ) {
        return window.BarcodeDetector as DetectorConstructor;
    }
    return null;
}

export default function TicketCamera({
    onScan,
    disabled,
}: {
    onScan: (value: string) => void;
    disabled: boolean;
}) {
    const video = useRef<HTMLVideoElement>(null);
    const stream = useRef<MediaStream | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState('');
    const generation = useRef(0);
    function stop() {
        generation.current += 1;
        stream.current?.getTracks().forEach((track) => track.stop());
        stream.current = null;
        clearTimeout(timer.current);
        setActive(false);
    }
    useEffect(
        () => () => {
            generation.current += 1;
            stream.current?.getTracks().forEach((track) => track.stop());
            clearTimeout(timer.current);
        },
        []
    );
    async function start() {
        const Constructor = detectorConstructor();
        if (!Constructor || !navigator.mediaDevices?.getUserMedia) {
            setMessage(
                'В этом браузере камера для QR недоступна. Используйте поиск пассажира или введите содержимое кода.'
            );
            return;
        }
        const current = ++generation.current;
        setMessage('');
        try {
            const media = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            if (current !== generation.current) {
                media.getTracks().forEach((track) => track.stop());
                return;
            }
            stream.current = media;
            setActive(true);
            if (!video.current) {
                stop();
                return;
            }
            video.current.srcObject = media;
            await video.current.play();
            const detector = new Constructor({ formats: ['qr_code'] });
            const detect = async () => {
                if (current !== generation.current || !video.current) return;
                try {
                    const codes = await detector.detect(video.current);
                    if (current !== generation.current) return;
                    const value = codes[0]?.rawValue;
                    if (value) {
                        stop();
                        onScan(value);
                        return;
                    }
                    timer.current = setTimeout(detect, 300);
                } catch {
                    stop();
                    setMessage(
                        'Не удалось прочитать код. Попробуйте снова или найдите пассажира в списке.'
                    );
                }
            };
            void detect();
        } catch {
            if (current !== generation.current) return;
            stop();
            setMessage(
                'Нет доступа к камере. Разрешите доступ в браузере или проверьте билет вручную.'
            );
        }
    }
    return (
        <div>
            <video
                ref={video}
                muted
                playsInline
                className={
                    active
                        ? 'mb-3 max-h-72 w-full rounded-lg bg-black'
                        : 'hidden'
                }
            />
            <button
                type="button"
                disabled={disabled}
                onClick={active ? stop : start}
                className="rounded-lg border border-[#E23333] px-4 py-3 text-sm font-semibold text-[#E23333] disabled:opacity-50"
            >
                {active ? 'Остановить камеру' : 'Сканировать камерой'}
            </button>
            {message && (
                <p role="status" className="mt-3 text-sm">
                    {message}
                </p>
            )}
        </div>
    );
}
