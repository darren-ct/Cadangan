import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import type {
  FieldOptionsCurrency,
  FieldOptionsNumber,
  FieldOptionsPercent,
  UseControllerProps,
} from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string | number;
  options?: FieldOptionsNumber & FieldOptionsCurrency & FieldOptionsPercent;
  placeholder?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

export const InputNumber = React.memo(function InputNumber({
  w,
  options,
  placeholder,
  leftIcon,
  rightIcon,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value, onChange, onBlur },
  } = useController({ control, ...rest });

  const allowNegative =
    options?.negative ?? options?.allowNegativeNumber ?? false;
  const isDecimal = options?.format === "decimal";
  const precision = options?.precision ?? 1;
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
      InputProps={{
        sx: {
          fontSize: "0.875em",
        },
        startAdornment: Boolean(leftIcon) && (
          <InputAdornment position="start">{leftIcon}</InputAdornment>
        ),
        endAdornment: Boolean(rightIcon) && (
          <InputAdornment position="end">{rightIcon}</InputAdornment>
        ),
      }}
    />
  );
});
