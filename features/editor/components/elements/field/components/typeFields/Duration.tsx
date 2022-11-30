import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import * as React from "react";

import type { Field, FieldOptionsDuration } from "@/widgets/types";

dayjs.extend(duration);

interface Props {
  field: Field;
  name: string;
  value?: string | number;
  onChange?: (value: number) => void;
  error?: string;
  hideLabel?: boolean;
}

export const Duration = React.memo(function Duration({
  field,
  name,
  value: rawValue,
  onChange,
  error,
  hideLabel,
}: Props) {
  const options = React.useMemo(
    () => field.options as FieldOptionsDuration,
    [field.options]
  );

  const [isEdit, setIsEdit] = React.useState(false);

  const formattedValue = React.useMemo(() => {
    if (isNaN(+rawValue)) return "";

    switch (options.format) {
      case "h:mm":
        return dayjs.duration(+rawValue * 1000).format("H:mm");

      case "h:mm:ss":
        return dayjs.duration(+rawValue * 1000).format("H:mm:ss");

      case "h:mm:ss.s":
        return dayjs.duration(+rawValue).format("H:mm:ss.SSS");

      case "h:mm:ss.ss":
        return dayjs.duration(+rawValue).format("H:mm:ss.SSS");

      case "h:mm:ss.sss":
        return dayjs.duration(+rawValue).format("H:mm:ss.SSS");
    }
  }, [rawValue, options.format]);

  const value = React.useMemo(() => {
    if (isEdit && !rawValue) return undefined;
    if (isEdit && typeof rawValue === "number") return rawValue;
    if (!isEdit && !rawValue) return "";
    if (!isEdit && rawValue) return formattedValue;
  }, [isEdit, formattedValue, rawValue]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(+e.target.value);
      }
    },
    [onChange]
  );

  const handleBlur: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(() => {
    setIsEdit(false);
  }, []);

  const handleFocus: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(() => {
    setIsEdit(true);
  }, []);

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
        type={isEdit ? "number" : "text"}
        placeholder={`Format: ${options.format}`}
        fullWidth
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        error={error ? true : false}
        id="outlined-error-helper-text"
        size="small"
        helperText={error}
      />
    </Box>
  );
});
