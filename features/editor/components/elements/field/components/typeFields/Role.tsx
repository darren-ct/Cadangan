import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Field, FieldOptionsSelect, SelectOption } from "@/widgets/types";

interface Props {
  field: Field;
  value?: string[];
  error?: string;
  onChange?: (value: SelectOption | null) => void;
  hideLabel?: boolean;
}

export const Role = React.memo(function Role({
  field,
  value: rawValue,
  error,
  onChange,
  hideLabel,
}: Props) {
  const { name } = field;

  const options = React.useMemo(() => {
    const roleOptions: FieldOptionsSelect = {
      coloredOptions: false,
      options: [
        { id: "admin", value: "admin", color: "blue" },
        { id: "authenticated", value: "authenticated", color: "blue" },
      ],
    };

    return roleOptions.options;
  }, []);

  const value: SelectOption[] = React.useMemo(() => {
    if (!rawValue || rawValue?.length === 0) return [];

    const isRawValue = typeof rawValue[0] === "string";

    if (isRawValue) {
      const findOption = options.find((item) => item.id === rawValue[0]);

      if (!findOption) return [];

      return [findOption];
    }

    return [rawValue as unknown as SelectOption];
  }, [rawValue, options]);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "6px",
        transition: 150,
      }}
    >
      <FormControl fullWidth error={error ? true : false}>
        {!hideLabel && (
          <Typography
            fontWeight="500"
            variant="subtitle1"
            sx={(theme) => ({ mb: "2px", fontSize: theme.typography.fontSize })}
          >
            {name}
          </Typography>
        )}
        <Autocomplete
          multiple
          options={options ? options : []}
          getOptionLabel={(option) => (option as SelectOption).value}
          disableClearable
          value={value ?? []}
          onChange={(_e, data) => {
            if (data.length === 0) return onChange(null);

            onChange(data[data.length - 1] as SelectOption);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
              }}
              fullWidth
              size="small"
              variant="outlined"
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props}>
              <Chip
                style={{
                  color: "white",
                  backgroundColor: option.color || "blue",
                }}
                size="small"
                label={option.value}
                color="primary"
              />
            </MenuItem>
          )}
          renderTags={(values) =>
            values.map((option) => (
              <Chip
                key={option.value}
                label={option.value}
                style={{
                  color: "white",
                  backgroundColor: option.color || "blue",
                  maxWidth: "35%",
                }}
                color="primary"
                size="small"
              />
            ))
          }
        />
        <Typography sx={{ color: "error.main", fontSize: "10px" }}>
          {error}
        </Typography>
      </FormControl>
    </Box>
  );
});
