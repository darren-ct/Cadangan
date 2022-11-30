import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { VisibilityIcon, VisibilityOffIcon } from "@/assets/icons";
import type { UseControllerProps } from "@/types";

import { FormConfiguration } from "../types";

interface Props extends UseControllerProps<FormConfiguration> {
  w?: string;
  hideText?: boolean;
  placeholder?: string;
}

export const InputString = React.memo(function InputString({
  w,
  hideText,
  placeholder,
  ...rest
}: Props) {
  const { control } = useFormContext<FormConfiguration>();
  const {
    field: { value, onChange, onBlur },
  } = useController({ control, ...rest });

  const [showPassword, setShowPassword] = React.useState(!hideText);

  const handleTogglePress = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const string = value as string | undefined;

  return (
    <OutlinedInput
      sx={{
        width: w,
      }}
      type={showPassword ? "text" : "password"}
      size="small"
      placeholder={placeholder}
      value={string ? string : ""}
      endAdornment={
        hideText ? (
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleTogglePress}
            edge="end"
          >
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        ) : undefined
      }
      onBlur={onBlur}
      onChange={onChange}
    />
  );
});
