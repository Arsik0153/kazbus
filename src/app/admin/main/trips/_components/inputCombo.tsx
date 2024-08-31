import React, { useState } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from '@headlessui/react';
import DownBtn from '@/assets/admin/DownBtb';

// Определение типа Item
interface Item {
    id: number;
    name: string;
}

interface ComboBoxProps {
    name: string;
    options: Item[];
    placeholder?: string;
    onOptionSelect: (name: string, selected: Item | null) => void;
    onNewItem: (name: string) => void;
    onSelectionChange?: (name: string, selected: Item | null) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({ name, options, placeholder = 'Выберите...', onOptionSelect, onNewItem, onSelectionChange }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [query, setQuery] = useState('');

    // Проверяем, что options определен и является массивом
    const safeOptions = Array.isArray(options) ? options : [];
    
    // Фильтруем варианты по запросу
    const filteredOptions = query === '' 
        ? safeOptions 
        : safeOptions.filter(option => option.name.toLowerCase().includes(query.toLowerCase()));

    // Проверяем, существует ли элемент, соответствующий запросу
    const itemExists = filteredOptions.some(option => option.name.toLowerCase() === query.toLowerCase());

    // Добавляем опцию "Добавить" только если такого элемента нет в filteredOptions
    if (query !== '' && !itemExists) {
        filteredOptions.push({ id: -1, name: `Добавить "${query}"` });
    }

    return (
        <div className="relative">
            <Combobox
                value={selectedItem}
                onChange={(item: Item) => {
                    if (item.id === -1) {
                        const newItem = { id: Date.now(), name: query };
                        setSelectedItem(newItem);
                        onNewItem(query);
                        if (onOptionSelect) onOptionSelect(name, newItem);
                    } else {
                        setSelectedItem(item);
                        if (onOptionSelect) onOptionSelect(name, item);
                    }
                    if (onSelectionChange) onSelectionChange(name, item);
                }}
                onClose={() => setQuery('')}
            >
                <div className="relative w-full">
                    <ComboboxInput
                        aria-label="Select item"
                        displayValue={(item: Item | null) => item ? item.name : ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        className="rounded-[10px] border border-[#A0A0A0] p-3 pl-4 text-base font-medium text-[#4A4A4A] focus:outline-none"
                    />
                    <ComboboxButton className="absolute right-4 top-[30%] flex items-center p-2">
                        <DownBtn color="#4A4A4A" className="p-2" />
                    </ComboboxButton>
                </div>
                <ComboboxOptions className="absolute z-10 mt-2 w-full rounded-[10px] bg-[#F1F5F9] p-3">
                    {filteredOptions.map((option, index) => (
                        <div key={option.id}>
                            <ComboboxOption
                                value={option}
                                className="group flex flex-col data-[focus]:rounded-[5px] data-[focus]:bg-white"
                            >
                                {({ active }) => (
                                    <div
                                        className={`flex flex-row justify-between p-2 text-base font-medium text-[#4A4A4A] hover:rounded-[5px] hover:bg-white ${active ? 'bg-white' : ''}`}
                                    >
                                        {option.name}
                                    </div>
                                )}
                            </ComboboxOption>
                            {index !== filteredOptions.length - 1 && option.id !== -1 && (
                                <div className="my-2 h-[1px] w-full bg-[#CDCDCD]" />
                            )}
                        </div>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
};

export default ComboBox;
