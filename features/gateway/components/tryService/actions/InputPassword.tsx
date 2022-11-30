import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { VisibilityIcon, VisibilityOffIcon } from "@/assets/icons";
import type { UseControllerProps } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  placeholder?: string;
}

export const InputPassword = React.memo(function InputPassword({
  placeholder,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value, onChange, onBlur },
  } = useController({ control, ...rest });
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePress = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const password = value as string | undefined;

  return (
    <OutlinedInput
      sx={{
        fontSize: "0.875em",
      }}
      type={showPassword ? "text" : "password"}
      size="small"
      placeholder={placeholder}
      value={password ? password : ""}
      endAdornment={
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleTogglePress}
          edge="end"
        >
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      }
      onBlur={onBlur}
      onChange={onChange}
    />
  );
});
