import React from 'react';
import * as Select from '@radix-ui/react-select';
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@radix-ui/react-icons';
import classnames from 'classnames';
import { cities } from '@/static/city'; // Импортируйте список городов

interface SelectItemProps
    extends React.ComponentPropsWithoutRef<typeof Select.Item> {
    children: React.ReactNode;
    className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, ...props }, forwardedRef) => {
        return (
            <Select.Item
                className={classnames(className)}
                {...props}
                ref={forwardedRef}
            >
                <Select.ItemText>{children}</Select.ItemText>
                <Select.ItemIndicator>
                    <CheckIcon />
                </Select.ItemIndicator>
            </Select.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';

const CitySelector = () => (
    <Select.Root>
        <Select.Trigger
            className="flex w-fit items-center gap-2 rounded-full border border-[#E74949] px-5 py-[5px] text-sm font-semibold text-[#E74949]"
            aria-label="Cities"
        >
            <Select.Value placeholder="Выберите направление" />
            <Select.Icon>
                <ChevronDownIcon />
            </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
            <Select.Content
                position="item-aligned"
                className="z-10 ml-3 flex w-fit items-center gap-2 rounded-2xl border border-[#E74949] bg-white px-5 py-[5px] text-base font-semibold text-[#050505]"
            >
                <Select.ScrollUpButton>
                    <ChevronUpIcon />
                </Select.ScrollUpButton>

                <Select.Viewport>
                    <Select.Group className="mb-5 flex flex-col gap-2 p-2">
                        <Select.Label>Выберите направление</Select.Label>
                        <div className="h-0 w-full border"></div>
                        {cities.map((city) => (
                            <SelectItem
                                key={city.id}
                                value={city.name}
                                className="flex flex-row items-center justify-between text-base font-normal"
                            >
                                {city.name}
                            </SelectItem>
                        ))}
                    </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton>
                    <ChevronDownIcon />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

export default CitySelector;
