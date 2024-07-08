
'use client'
import React, { useState } from 'react';
import Radio from '@/components/radio-input';
import Input from '@/components/input';
import Button from '@/components/button';
import Calendar from '../../../../../../public/assets/calendar';

const PersonalDataPage = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (value: React.SetStateAction<null>) => {
    setSelectedValue(value);
  };

  const items: { value: string, label: string }[] = [
    { value: 'udo', label: 'Удостоверение личности' },
    { value: 'pasport', label: 'Пасспорт' },
    { value: 'svid', label: 'Свидетельство о рождении' },

  ]
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className='p-5'>
      <div>
        <div className='pb-3 font-medium text-[20px] leading-[22px] tracking-[-3%]'>Тип Документа</div>
        <div>
          <Radio
            items={[
              {
                label: 'Удостоверение личности',
                value: 'idCard'
              },
              {
                label: 'Паспорт',
                value: 'passport'
              },
              {
                label: 'Свидетельство о рождении',
                value: 'birthCertificate'
              }
            ]}
            value={selectedValue}
            onChange={setValue} name={''}
          />
        </div>
      </div>
      <div className='pt-7 gap-2 flex flex-col'>
        <Input
          placeholder='Номер документа или ИИН'
        />
        <Input
          placeholder="Дата рождения"
        />
        <Input
          placeholder='Номер телефона'
        />
      </div>
      <div className='pt-20'>
        <Button variant='ghost'>Изменить данные</Button>
      </div>
    </div>
  );
}

export default PersonalDataPage;
