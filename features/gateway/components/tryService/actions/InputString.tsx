import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import type { UseControllerProps } from "@/types";

import type {
  FormTryServiceAdvanced,
  FormTryServiceSimple,
} from "../../../types";

interface Props
  extends UseControllerProps<FormTryServiceSimple | FormTryServiceAdvanced> {
  w?: string;
  placeholder?: string;
  multiline?: boolean;
  rightIcon?: JSX.Element;
}

export const InputString = React.memo(function InputString({
  w,
  placeholder,
  multiline,
  rightIcon,
  ...rest
}: Props) {
  const { control } = useFormContext<
    FormTryServiceSimple | FormTryServiceAdvanced
  >();
  const {
    field: { value, onChange, onBlur },
  } = useController({ control, ...rest });

  const string = value as string | undefined;

  return (
    <TextField
      sx={{
        width: w,
      }}
      placeholder={placeholder}
      value={string ? string : ""}
      multiline={multiline}
      variant="outlined"
      size="small"
      InputProps={{
        endAdornment: Boolean(rightIcon) && (
          <InputAdornment position="end">{rightIcon}</InputAdornment>
        ),
        sx: {
          fontSize: "0.875em",
        },
      }}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
});
