import TextField from "@mui/material/TextField";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import type { UseControllerProps } from "@/types";

import { FormConfiguration } from "../types";

interface Props extends UseControllerProps<FormConfiguration> {
  w?: string | number;
  placeholder?: string;
}

export const InputNumber = React.memo(function InputNumber({
  w,
  placeholder,
  ...rest
}: Props) {
  const { control } = useFormContext<FormConfiguration>();
  const {
    field: { value, onChange, onBlur },
  } = useController({ control, ...rest });

  const allowNegative = false;
  const isDecimal = false;
  const precision = 1;
  const data = value as string | number | undefined;

  const handleBlur = React.useCallback(() => {
    let text;

    if (typeof data === "string" && data) {
      const val = isDecimal
        ? Number(Number(data).toFixed(precision))
        : Number(data);

      if (!isNaN(val)) {
        text = val;
      }
    }

    onChange(typeof data === "number" ? data : text);
    onBlur();
  }, [data, onChange, onBlur, isDecimal, precision]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let specialCharIdx = -1;
      let hasDecimalPoint = false;
      const text = e.target.value;

      for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i);

        if (i === 0 && char === "-" && allowNegative) {
          continue;
        }

        if (char === "." && isDecimal && !hasDecimalPoint) {
          hasDecimalPoint = true;
          continue;
        }

        if (isNaN(Number(char))) {
          specialCharIdx = i;
          break;
        }
      }

      onChange(
        specialCharIdx !== -1 ? text.substring(0, specialCharIdx) : text
      );
    },
    [allowNegative, isDecimal, onChange]
  );

  return (
    <TextField
      sx={{
        width: w,
      }}
      placeholder={placeholder}
      value={data !== undefined ? String(data) : ""}
      size="small"
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
});
