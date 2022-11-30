import TextField from "@mui/material/TextField";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import type { FieldOptionsDuration, UseControllerProps } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string;
  fieldOptions: FieldOptionsDuration;
}

export const InputDuration = React.memo(function InputDuration({
  w,
  fieldOptions,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value, onChange },
  } = useController({ control, ...rest });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!/[0-9:.]/.test(e.key)) {
        e.preventDefault();
      }
    },
    []
  );

  const handleBlur: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback(
    (e) => {
      const inputValue = e.target.value;
      const sets = inputValue.split(":");

      if (sets.length > 3) {
        return;
      }

      for (let i = 0; i < sets.length; i++) {
        if (isNaN(Number(sets[i]))) {
          return;
        }
      }

      const hours = sets[0] ? Number(sets[0]) : 0;
      const minutes = sets[1] ? Number(sets[1]) : 0;
      const seconds = sets[2] ? Number(sets[2]) : 0;

      const totalSeconds = 3600 * hours + 60 * minutes + seconds;

      let newHours: number | string = Math.floor(totalSeconds / 3600);
      let newMinutes: number | string = Math.floor((totalSeconds % 3600) / 60);
      let newSeconds: number | string = (totalSeconds % 3600) % 60;

      switch (fieldOptions.format) {
        case "h:mm":
          if (newSeconds !== 0 && newSeconds > 30) {
            newMinutes++;
            if (newMinutes >= 60) {
              newHours++;
              newMinutes = 0;
            }
          }

          newHours = newHours < 10 ? `0${newHours}` : newHours;
          newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;

          onChange(`${newHours}:${newMinutes}`);

          break;

        case "h:mm:ss":
          newSeconds = Number(newSeconds.toFixed(0));
          if (newSeconds >= 60) {
            newMinutes++;
            if (newMinutes >= 60) {
              newHours++;
            }
          }

          newHours = newHours < 10 ? `0${newHours}` : newHours;
          newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;
          newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds;

          onChange(`${newHours}:${newMinutes}:${newSeconds}`);

          break;

        case "h:mm:ss.s":
          newSeconds = Number(newSeconds.toFixed(1));
          if (newSeconds >= 60) {
            newMinutes++;
            if (newMinutes >= 60) {
              newHours++;
            }
          }

          newHours = newHours < 10 ? `0${newHours}` : newHours;
          newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;
          newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds;

          onChange(`${newHours}:${newMinutes}:${newSeconds}`);
          break;

        case "h:mm:ss.ss":
          newSeconds = Number(newSeconds.toFixed(2));

          if (newSeconds >= 60) {
            newMinutes++;
            if (newMinutes >= 60) {
              newHours++;
            }
          }

          newHours = newHours < 10 ? `0${newHours}` : newHours;
          newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;
          newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds;

          onChange(`${newHours}:${newMinutes}:${newSeconds}`);

          break;

        case "h:mm:ss.sss":
          newSeconds = Number(newSeconds.toFixed(3));

          if (newSeconds >= 60) {
            newMinutes++;
            if (newMinutes >= 60) {
              newHours++;
            }
          }

          newHours = newHours < 10 ? `0${newHours}` : newHours;
          newMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;
          newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds;

          onChange(`${newHours}:${newMinutes}:${newSeconds}`);
          break;
      }
    },
    [fieldOptions.format, onChange]
  );

  return (
    <TextField
      sx={{ width: w }}
      InputProps={{
        sx: {
          fontSize: "0.875em",
        },
      }}
      placeholder={`Format: ${fieldOptions.format}`}
      variant="outlined"
      size="small"
      autoComplete="off"
      value={value === undefined ? "" : value}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
});
