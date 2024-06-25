import { useState } from 'react';

const InputWithFloatingLabel = () => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="inputText w-48 h-9 border border-gray-300 rounded px-3"
        value={inputValue}
        onChange={handleChange}
        required
      />
      <span
        className={`floating-label absolute left-3 transition duration-200 ${
          inputValue ? 'top-2 text-xs' : 'top-3 text-sm'
        }`}
      >
        Your email address
      </span>
    </div>
  );
};

export default InputWithFloatingLabel;
