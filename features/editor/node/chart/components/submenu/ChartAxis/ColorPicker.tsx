import * as React from "react";
import { useDebounce } from "use-debounce";

interface Props {
  value: string;
  onChange: (value: string) => unknown;
}

export const ColorPicker = React.memo(function ColorPicker({
  value,
  onChange,
}: Props) {
  const [rawValue, setRawValue] = React.useState<string>(value);

  const [debouncedValue] = useDebounce(rawValue, 500);

  React.useEffect(() => {
    if (debouncedValue === value) return;

    onChange(debouncedValue);
  }, [debouncedValue, onChange, value]);

  return (
    <input
      id="chart-color"
      type="color"
      style={{
        border: "none",
        backgroundColor: "transparent",
        outline: "none",
        height: "2rem",
      }}
      value={rawValue}
      onChange={(e) => setRawValue(e.target.value)}
    />
  );
});
