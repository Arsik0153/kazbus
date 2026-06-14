'use client';

import * as React from 'react';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

export type BaseComboboxProps = {
    options: readonly ComboboxOption[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (
        value: string | null,
        option: ComboboxOption | null
    ) => void;
    placeholder?: string;
    emptyText?: string;
    disabled?: boolean;
    clearable?: boolean;
    name?: string;
    required?: boolean;
    className?: string;
    contentClassName?: string;
    listClassName?: string;
};

export function BaseCombobox({
    options,
    value,
    defaultValue = null,
    onValueChange,
    placeholder = 'Выберите значение',
    emptyText = 'Ничего не найдено',
    disabled = false,
    clearable = false,
    name,
    required,
    className,
    contentClassName,
    listClassName,
}: BaseComboboxProps) {
    const inputId = React.useId();
    const listboxId = React.useId();
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState<string | null>(null);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const selectedValue = isControlled ? value : internalValue;
    const selectedOption =
        options.find((option) => option.value === selectedValue) ?? null;

    const filteredOptions = React.useMemo(() => {
        const normalizedQuery = query?.trim().toLocaleLowerCase() ?? '';

        if (!normalizedQuery) {
            return options;
        }

        return options.filter((option) =>
            option.label.toLocaleLowerCase().includes(normalizedQuery)
        );
    }, [options, query]);

    const getNextEnabledIndex = React.useCallback(
        (startIndex: number, direction: 1 | -1) => {
            if (filteredOptions.length === 0) {
                return -1;
            }

            for (
                let offset = 1;
                offset <= filteredOptions.length;
                offset += 1
            ) {
                const index =
                    (startIndex + direction * offset + filteredOptions.length) %
                    filteredOptions.length;

                if (!filteredOptions[index].disabled) {
                    return index;
                }
            }

            return -1;
        },
        [filteredOptions]
    );

    const selectOption = React.useCallback(
        (option: ComboboxOption | null) => {
            if (option?.disabled) {
                return;
            }

            const nextValue = option?.value ?? null;

            if (!isControlled) {
                setInternalValue(nextValue);
            }

            setQuery(null);
            setOpen(false);
            setActiveIndex(-1);
            onValueChange?.(nextValue, option);
        },
        [isControlled, onValueChange]
    );

    const openList = React.useCallback(() => {
        if (disabled) {
            return;
        }

        setOpen(true);
        setActiveIndex((currentIndex) =>
            currentIndex >= 0 ? currentIndex : getNextEnabledIndex(-1, 1)
        );
    }, [disabled, getNextEnabledIndex]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();

            if (!open) {
                setOpen(true);
                setActiveIndex(
                    event.key === 'ArrowDown'
                        ? getNextEnabledIndex(-1, 1)
                        : getNextEnabledIndex(0, -1)
                );
            } else {
                setActiveIndex((currentIndex) =>
                    getNextEnabledIndex(
                        currentIndex,
                        event.key === 'ArrowDown' ? 1 : -1
                    )
                );
            }
            return;
        }

        if (event.key === 'Enter' && open && activeIndex >= 0) {
            event.preventDefault();
            selectOption(filteredOptions[activeIndex]);
            return;
        }

        if (event.key === 'Escape' && open) {
            event.preventDefault();
            setOpen(false);
            setActiveIndex(-1);
            setQuery(null);
        }
    };

    const inputValue = query ?? selectedOption?.label ?? '';

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                if (!nextOpen) {
                    setActiveIndex(-1);
                }
            }}
        >
            <PopoverAnchor asChild>
                <div className={cn('relative w-full', className)}>
                    <Input
                        id={inputId}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-controls={listboxId}
                        aria-expanded={open}
                        aria-activedescendant={
                            activeIndex >= 0
                                ? `${listboxId}-option-${activeIndex}`
                                : undefined
                        }
                        value={inputValue}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        autoComplete="off"
                        className="h-12 pr-16"
                        onFocus={(event) => {
                            openList();
                            event.currentTarget.select();
                        }}
                        onClick={openList}
                        onChange={(event) => {
                            const nextQuery = event.target.value;

                            if (
                                nextQuery.trim() === '' &&
                                selectedValue !== null
                            ) {
                                selectOption(null);
                                return;
                            }

                            setQuery(nextQuery);
                            setOpen(true);
                            setActiveIndex(-1);
                        }}
                        onBlur={(event) => {
                            if (
                                event.currentTarget.value.trim() === '' &&
                                selectedValue !== null
                            ) {
                                selectOption(null);
                                return;
                            }

                            setQuery(null);
                            setOpen(false);
                            setActiveIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                    />

                    <div className="absolute inset-y-0 right-1 flex items-center">
                        {clearable && selectedOption && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label="Очистить значение"
                                disabled={disabled}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectOption(null)}
                            >
                                <XIcon />
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            aria-label={
                                open ? 'Закрыть список' : 'Открыть список'
                            }
                            aria-controls={listboxId}
                            aria-expanded={open}
                            disabled={disabled}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                                setOpen((currentOpen) => {
                                    if (currentOpen) {
                                        setQuery(null);
                                        setActiveIndex(-1);
                                    }

                                    return !currentOpen;
                                });
                            }}
                        >
                            <ChevronDownIcon
                                className={cn(
                                    'transition-transform',
                                    open && 'rotate-180'
                                )}
                            />
                        </Button>
                    </div>

                    {name && (
                        <input
                            type="hidden"
                            name={name}
                            value={selectedValue ?? ''}
                        />
                    )}
                </div>
            </PopoverAnchor>

            <PopoverContent
                align="start"
                sideOffset={4}
                onOpenAutoFocus={(event) => event.preventDefault()}
                onCloseAutoFocus={(event) => event.preventDefault()}
                className={cn(
                    'w-(--radix-popover-trigger-width) p-1',
                    contentClassName
                )}
            >
                <div
                    id={listboxId}
                    role="listbox"
                    aria-labelledby={inputId}
                    className={cn('max-h-72 overflow-y-auto', listClassName)}
                >
                    {filteredOptions.length === 0 ? (
                        <div className="text-muted-foreground py-6 text-center text-sm">
                            {emptyText}
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => {
                            const isSelected = option.value === selectedValue;
                            const isActive = index === activeIndex;

                            return (
                                <button
                                    id={`${listboxId}-option-${index}`}
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    disabled={option.disabled}
                                    className={cn(
                                        'relative flex w-full min-w-0 items-center rounded-md py-2 pl-2 pr-8 text-left text-sm outline-none',
                                        isActive &&
                                            'bg-accent text-accent-foreground',
                                        !option.disabled &&
                                            'hover:bg-accent hover:text-accent-foreground cursor-pointer',
                                        option.disabled &&
                                            'cursor-not-allowed opacity-50'
                                    )}
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onMouseEnter={() => {
                                        if (!option.disabled) {
                                            setActiveIndex(index);
                                        }
                                    }}
                                    onClick={() => selectOption(option)}
                                >
                                    <span className="truncate">
                                        {option.label}
                                    </span>
                                    {isSelected && (
                                        <CheckIcon className="absolute right-2 size-4" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
