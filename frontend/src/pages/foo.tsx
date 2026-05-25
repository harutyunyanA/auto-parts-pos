import { AutoComplete } from 'antd';
import { useState, useCallback } from 'react';
import { carSearchOptions } from '../lib/data.ts';

// Иконки для типов подсказок
const typeIcon = {
  brand: '🚗',
  model: '📋',
};

interface CarAutoCompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default function CarAutoComplete({
  value,
  onChange,
  placeholder = 'Например: BMW X5, Toyota Camry...',
  style,
  ...rest
}: CarAutoCompleteProps) {
  const [options, setOptions] = useState([]);

  const handleSearch = useCallback((input) => {
    const q = input?.trim().toLowerCase();

    if (!q) {
      setOptions([]);
      return;
    }

    const filtered = carSearchOptions
      .filter((item) => item.value.toLowerCase().includes(q))
      .slice(0, 20)
      .map((item) => ({
        value: item.value,
        label: (
          <span>
            <span style={{ marginRight: 6 }}>{typeIcon[item.type]}</span>
            {item.value}
          </span>
        ),
      }));

    setOptions(filtered);
  }, []);

  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      options={options}
      onSearch={handleSearch}
      filterOption={false}
      allowClear
      placeholder={placeholder}
      style={{ width: '100%', ...style }}
      {...rest}
    />
  );
}