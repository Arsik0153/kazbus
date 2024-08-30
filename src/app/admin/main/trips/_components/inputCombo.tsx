'use client';
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    ComboboxButton,
} from '@headlessui/react';
import { useState } from 'react';
import DownBtn from '@/assets/admin/DownBtb';

const cruise = [
    { id: 1, name: 'Все маршруты' },
    { id: 2, name: 'Алматы / Сайран' },
    { id: 3, name: 'Алматы / Саяхат' },
    { id: 4, name: 'Алмалы' },
    { id: 5, name: 'Аленушка' },
];

interface Person {
    id: number;
    name: string;
}

interface ComboBoxProps {
    name: string;
    placeholder?: string;
    onSelectionChange?: (name: string, selected: Person | null) => void;
}

function ComboBox({ name, placeholder = 'Выберите нужный вариант', onSelectionChange = () => {} }: ComboBoxProps) {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [query, setQuery] = useState('');

    // Фильтрация городов по запросу
    const filteredPeople =
        query === ''
            ? cruise
            : cruise.filter((person) =>
                  person.name.toLowerCase().includes(query.toLowerCase())
              );

    // Проверяем, существует ли введенный город в списке
    const cityExists = filteredPeople.some(
        (person) => person.name.toLowerCase() === query.toLowerCase()
    );

    // Добавляем новый элемент в список, если его нет
    if (query !== '' && !cityExists) {
        filteredPeople.push({ id: -1, name: `Добавить "${query}"` });
    }

    return (
        <div className="relative">
            <Combobox
                value={selectedPerson}
                onChange={(person: Person) => {
                    if (person.id === -1) {
                        // Если пользователь выбрал опцию добавления нового города
                        const newPerson = { id: cruise.length + 1, name: query };
                        setSelectedPerson(newPerson);
                        onSelectionChange(name, newPerson);
                    } else {
                        setSelectedPerson(person);
                        onSelectionChange(name, person);
                    }
                }}
                onClose={() => setQuery('')}
            >
                <div className="relative w-full">
                    <ComboboxInput
                        aria-label="Assignee"
                        displayValue={(person: Person | null) =>
                            person ? person.name : ''
                        }
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                        className="rounded-[10px] border border-[#A0A0A0] p-3 pl-4 text-base font-medium text-[#4A4A4A] focus:outline-none"
                    />
                    <ComboboxButton className="absolute right-4 top-[30%] flex items-center p-2">
                        <DownBtn color="#4A4A4A" className="p-2" />
                    </ComboboxButton>
                </div>
                <ComboboxOptions className="absolute z-10 mt-2 w-full rounded-[10px] bg-[#F1F5F9] p-3">
                    {filteredPeople.map((person, index) => (
                        <div key={person.id}>
                            <ComboboxOption
                                value={person}
                                className="group flex flex-col data-[focus]:rounded-[5px] data-[focus]:bg-white"
                            >
                                {({ selected }) => (
                                    <div
                                        className={`flex flex-row justify-between p-2 text-base font-medium text-[#4A4A4A] hover:rounded-[5px] hover:bg-white ${selected ? 'bg-white' : ''}`}
                                    >
                                        {person.name}
                                    </div>
                                )}
                            </ComboboxOption>
                            {index !== filteredPeople.length - 1 && person.id !== -1 && (
                                <div className="my-2 h-[1px] w-full bg-[#CDCDCD]" />
                            )}
                        </div>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}

export default ComboBox;
