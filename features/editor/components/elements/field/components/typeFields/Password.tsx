import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { EyeOffIcon, EyeOnIcon } from "@/assets/icons";
import type { Field, FieldOptionsSingleText } from "@/widgets/types";

interface PropsSingleLineText {
  name: string;
  error?: string;
  onChange?: (value: string) => void;
  field: Field;
  value?: string;
  hideLabel?: boolean;
}

export const Password = React.memo(function FieldPassword({
  name,
  field,
  error,
  onChange,
  value,
  hideLabel,
}: PropsSingleLineText) {
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (field.defaultValue) {
      onChange(field.defaultValue as string);
    }
  }, [field.defaultValue, onChange]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
  );

  const maxStatement = React.useMemo(() => {
    const max = (field.options as FieldOptionsSingleText)?.maxChar;
    if (max) {
      return `Maximal ${max} characters`;
    } else {
      return `No Maximal characters`;
    }
  }, [field]);

  const minStatement = React.useMemo(() => {
    const min = (field.options as FieldOptionsSingleText)?.minChar;
    if (min) {
      return `Minimal ${min} characters`;
    } else {
      return `No Minimal characters`;
    }
  }, [field]);

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleMouseDownPassword = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "6px",
        transition: 150,
      }}
    >
      {!hideLabel && (
        <Typography
          fontWeight="500"
          variant="subtitle1"
          sx={(theme) => ({ mb: "2px", fontSize: theme.typography.fontSize })}
        >
          {name}
        </Typography>
      )}
      <TextField
        variant="standard"
        placeholder={`${maxStatement}, ${minStatement}`}
        fullWidth
        autoComplete="off"
        value={
          value === undefined && field.defaultValue
            ? field.defaultValue
            : value === undefined
            ? ""
            : value
        }
        onChange={handleChange}
        error={error ? true : false}
        id="outlined-error-helper-text"
        helperText={error}
        size="small"
        type={!showPassword ? "password" : "text"}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {!showPassword ? (
                  <EyeOffIcon sx={{ fontSize: 18 }} />
                ) : (
                  <EyeOnIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{ style: { fontSize: 12 } }}
        sx={{ background: "white", paddingY: "2px", paddingX: "8px" }}
      />
    </Box>
  );
});
