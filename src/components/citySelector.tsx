import React from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { cities } from '@/static/city'; // Импортируйте список городов

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
  children: React.ReactNode;
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={classnames(className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = 'SelectItem';

const CitySelector = () => (
  <Select.Root>
    <Select.Trigger className="flex w-fit items-center gap-2 rounded-full border border-[#E74949] px-5 py-[5px] text-sm font-semibold text-[#E74949]" aria-label="Cities">
      <Select.Value placeholder="Выберите направление" />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className='z-10 flex ml-3 w-fit items-center gap-2 rounded-2xl text-base  bg-white border border-[#E74949] px-5 py-[5px] font-semibold text-[#050505]'>
        <Select.ScrollUpButton>
          <ChevronUpIcon />
        </Select.ScrollUpButton>

        <Select.Viewport>
          <Select.Group className='flex flex-col p-2 gap-2 mb-5 '>
            <Select.Label>Выберите направление</Select.Label>
            <div className="w-full h-0 border"></div>
            {cities.map(city => (
              <SelectItem key={city.id} value={city.name} className='text-base font-normal flex flex-row justify-between items-center'>
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