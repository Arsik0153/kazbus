'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type {
    SupportRequestDraft,
    SupportRequesterRole,
    SupportRequestTopic,
} from './types';

type Props = {
    requesterRole: SupportRequesterRole;
    selectedTopic: SupportRequestTopic | null;
    submitLabel?: string;
    onSubmit?: (draft: SupportRequestDraft) => void;
};

const rolePlaceholder: Record<SupportRequesterRole, string> = {
    passenger: 'Опишите, что произошло с билетом, оплатой или поездкой...',
    busDriver: 'Напишите, что произошло в рейсе и какая помощь нужна...',
    dispatcher: 'Опишите обращение или операционную ситуацию...',
};

const SupportRequestForm = ({
    requesterRole,
    selectedTopic,
    submitLabel = 'Отправить в поддержку',
    onSubmit,
}: Props) => {
    const [message, setMessage] = useState('');
    const [sentDraft, setSentDraft] = useState<SupportRequestDraft | null>(
        null
    );

    const canSubmit = Boolean(selectedTopic && message.trim().length >= 8);

    const handleSubmit = () => {
        if (!selectedTopic || !canSubmit) {
            return;
        }

        const draft: SupportRequestDraft = {
            topicId: selectedTopic.id,
            topicTitle: selectedTopic.title,
            requesterRole,
            message: message.trim(),
        };

        setSentDraft(draft);
        setMessage('');
        onSubmit?.(draft);
    };

    return (
        <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl leading-5.5 font-bold text-[#4A4A4A]">
                        Сообщение поддержке
                    </h2>
                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                        {selectedTopic
                            ? selectedTopic.helperText ||
                              'Добавьте детали, чтобы оператор быстрее взял обращение в работу.'
                            : 'Сначала выберите ситуацию выше.'}
                    </p>
                </div>
                {sentDraft && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1.5 text-xs font-semibold text-[#15803D]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Отправлено
                    </span>
                )}
            </div>

            {selectedTopic && (
                <div className="mt-4 rounded-[0.625rem] bg-[#F8F8F8] px-4 py-3">
                    <p className="text-xs font-semibold text-[#A0A0A0] uppercase">
                        Тема обращения
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4A4A4A]">
                        {selectedTopic.title}
                    </p>
                </div>
            )}

            <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={rolePlaceholder[requesterRole]}
                className="hide-tabbar mt-4 min-h-[128px] resize-none rounded-[0.625rem] border-[#D1D1D1] bg-[#FBFBFB] text-sm"
            />

            <Button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="mt-4 h-12 w-full gap-2 rounded-[0.625rem] bg-[#E23333] text-base text-white hover:bg-[#F16363]"
            >
                <Send className="h-4 w-4" />
                {submitLabel}
            </Button>

            {sentDraft && (
                <div className="mt-4 rounded-[0.625rem] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
                    Обращение по теме «{sentDraft.topicTitle}» добавлено в
                    локальную очередь поддержки. Подключение к серверу будет
                    добавлено позже.
                </div>
            )}
        </div>
    );
};

export default SupportRequestForm;
