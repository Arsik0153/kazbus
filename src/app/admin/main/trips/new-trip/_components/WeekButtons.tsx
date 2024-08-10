import React, { useState } from 'react';

const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const DayButton = ({ day, isActive, onClick }: { day: string, isActive: boolean, onClick: () => void }) => {
  return (
    <button
      className={`px-9 rounded-[10px] border text-base font-medium p-3 transition-colors duration-200 ease-in-out ${isActive ? 'text-white bg-[#E74949]' : 'text-[#4A4A4A] border'
        }`}
      onClick={onClick}
    >
      {day}
    </button>
  );
};

const WeekButtons = () => {
  const [activeDays, setActiveDays] = useState<string[]>([]);

  const handleClick = (day: string) => {
    setActiveDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  // Формирование текста для выбранных дней
  const generateText = () => {
    if (activeDays.length === 0) {
      return 'Выберите дни недели';
    }
    const formattedDays = activeDays.join(', ').replace(/, ([^,]*)$/, ' и $1');
    return `Рейс будет отправляться каждый: ${formattedDays}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-start gap-2">
        {daysOfWeek.map((day) => (
          <DayButton
            key={day}
            day={day}
            isActive={activeDays.includes(day)}
            onClick={() => handleClick(day)}
          />
        ))}
      </div>
      <p className="mt-4 text-base font-medium opacity-50 lowercase text-black">{generateText()}</p>
    </div>
  );
};

export default WeekButtons;
