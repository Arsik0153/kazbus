'use client';

import { useMemo, useState } from 'react';
import Topbar from '@/components/topbar';
import SupportRequestForm from '@/features/support/SupportRequestForm';
import type { SupportRequestTopic } from '@/features/support/types';
import BusIssueOptionCard from '../_components/BusIssueOptionCard';
import { busIssueOptionsMock } from '../_data/bus-driver.mock';
import type { BusIssueOption } from '../_types/bus-driver';

const priorityBySeverity: Record<
    BusIssueOption['severity'],
    SupportRequestTopic['priority']
> = {
    normal: 'low',
    warning: 'medium',
    urgent: 'high',
};

const BusDriverIssuesPage = () => {
    const [selectedIssueId, setSelectedIssueId] = useState(
        busIssueOptionsMock[0]?.id
    );

    const supportTopics = useMemo<SupportRequestTopic[]>(
        () =>
            busIssueOptionsMock.map((option) => ({
                id: option.id,
                title: option.title,
                description: option.description,
                helperText: option.helperText,
                priority: priorityBySeverity[option.severity],
            })),
        []
    );

    const selectedIssue = busIssueOptionsMock.find(
        (option) => option.id === selectedIssueId
    );
    const selectedTopic =
        supportTopics.find((topic) => topic.id === selectedIssueId) || null;

    return (
        <>
            <Topbar backHref="/busdriver/trip">Ситуации</Topbar>
            <div className="min-h-full bg-(--gray) px-5 pt-5 pb-28">
                <div className="rounded-[0.625rem] border border-[#D1D1D1] bg-white p-5">
                    <h1 className="text-xl leading-5.5 font-bold text-[#4A4A4A]">
                        Что произошло в рейсе
                    </h1>
                    <p className="leading-4.4 mt-2 text-sm text-[#A0A0A0]">
                        Выберите подходящий сценарий, добавьте сообщение, и
                        обращение попадёт в локальную очередь поддержки.
                    </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    {busIssueOptionsMock.map((option) => (
                        <BusIssueOptionCard
                            key={option.id}
                            option={option}
                            selected={selectedIssue?.id === option.id}
                            onSelect={(issue) => setSelectedIssueId(issue.id)}
                        />
                    ))}
                </div>

                <div className="mt-4">
                    <SupportRequestForm
                        requesterRole="busDriver"
                        selectedTopic={selectedTopic}
                    />
                </div>
            </div>
        </>
    );
};

export default BusDriverIssuesPage;
