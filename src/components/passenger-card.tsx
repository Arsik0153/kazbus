import React from 'react';
import UserIcon from '@/assets/user';
import { z } from 'zod';
import { profileSchema } from '@/data/schemas';
import { dateToReadable } from '@/utils/helper.';
import { Profile } from '@/data/user';
import { documentTypes } from '@/static/constants';
import { cn } from '@/utils/cn';
import { User } from '@/app/(mobile)/bus/main/tickets/_components/select-passengers';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    user: User;
    selected?: boolean;
};

const PassengerCard = (props: Props) => {
    const { user, selected, ...rest } = props;
    console.log('PassengerCard user:', user);

    return (
        <div
            className={cn(
                'flex flex-col rounded-[10px] border border-[#D1D1D1] pb-7 pl-4 pr-6 pt-6',
                {
                    'border-[#E74949]': selected,
                }
            )}
            {...rest}
        >
            <div className="mb-1 flex flex-row items-center gap-2">
                <UserIcon />
                <p className="text-xl font-semibold text-[#4A4A4A]">
                    {user.full_name}
                </p>
            </div>
            <p className="text-sm font-medium">
                {
                    documentTypes.find(
                        (type) => type.value === user.document_type
                    )?.label
                }
            </p>
            <div className="mt-[30px] flex flex-row items-start justify-between">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                        Номер документа или ИИН
                    </p>
                    <p className="text-base font-medium text-[#4A4A4A]">
                        {user.document_number_or_iin}
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase text-[#A0A0A0]">
                        Дата рождения
                    </p>
                    <p className="text-base font-medium text-[#4A4A4A]">
                        {dateToReadable(user.birth_date)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PassengerCard;
