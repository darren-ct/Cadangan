import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";

import type { Field, FieldOptionsDate } from "@/widgets/types";

interface Props {
  name: string;
  error?: string;
  onChange?: (value: string) => void;
  field: Field;
  value?: Date;
  hideLabel?: boolean;
}

export const DateInput = React.memo(function DateInput({
  name,
  error,
  field,
  onChange,
  value,
  hideLabel,
}: Props) {
  const options = React.useMemo(
    () => field.options as FieldOptionsDate,
    [field.options]
  );

  const includeTime = React.useMemo(
    () => options?.includeTimeField,
    [options?.includeTimeField]
  );

  const handleChange = React.useCallback(
    (value: Dayjs | Date) => {
      if (!value) return;

      let newValue = value.toISOString();
      if (!includeTime) {
        newValue = dayjs(value).format("YYYY-MM-DD");
      }

      onChange(newValue);
    },
    [onChange, includeTime]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        {!includeTime ? (
          <DesktopDatePicker
            inputFormat="MM/DD/YYYY"
            value={value ? value : ""}
            onChange={handleChange}
            renderInput={(params) => {
              return (
                <TextField
                  {...{ ...params, error: error ? true : false }}
                  sx={{ width: "100%" }}
                  size="small"
                />
              );
            }}
          />
        ) : (
          <DateTimePicker
            ampm={options.timeFormat === 24 ? false : true}
            value={value ? value : ""}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...{ ...params, error: error ? true : false }}
                sx={{ width: "100%" }}
                size="small"
              />
            )}
          />
        )}

        <Typography
          sx={{
            color: "error.main",
            fontSize: "10px",
            marginLeft: 1.5,
            marginTop: 0.5,
          }}
        >
          {error}
        </Typography>
      </Box>
    </LocalizationProvider>
  );
});
