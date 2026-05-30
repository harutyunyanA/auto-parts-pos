import { AutoComplete } from "antd";
import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { carSearchOptions } from "../../lib/data";

// Иконки для типов подсказок
const typeIcon: Record<string, string> = {
  brand: "🚗",
  model: "📋",
};

interface CarAutoCompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}

type Option = { value: string; label: ReactNode };

export default function CarAutoComplete({
  value,
  onChange,
  placeholder = "e.g. BMW X5, Toyota Camry...",
  style,
  children,
  ...rest
}: CarAutoCompleteProps) {
  const [options, setOptions] = useState<Option[]>([]);

  const handleSearch = useCallback((input: string) => {
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
      style={{ width: "100%", ...style }}
      // when wrapping a custom input (e.g. Input.Search) let it own these props
      {...(children ? {} : { allowClear: true, placeholder })}
      {...rest}
    >
      {children}
    </AutoComplete>
  );
}
