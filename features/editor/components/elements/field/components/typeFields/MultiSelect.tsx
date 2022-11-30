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
  value?: SelectOption[];
  error?: string;
  onChange?: (value: SelectOption[]) => void;
  hideLabel?: boolean;
}

export const MultiSelect = React.memo(function MultiSelect({
  field,
  value,
  error,
  onChange,
  hideLabel,
}: Props) {
  const { name } = field;

  const options = React.useMemo(() => {
    return (field.options as FieldOptionsSelect)?.options;
  }, [field.options]);

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
          options={options}
          getOptionLabel={(option) => (option as SelectOption).value}
          disableClearable
          value={value ?? []}
          onChange={(_e, data) => {
            let changeValue: string | SelectOption[] = "";

            changeValue = (data?.length > 0 ? data : []) as SelectOption[];

            onChange(changeValue);
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
          renderTags={(values, getTagProps) =>
            values.map((option, valuesIndex) => (
              <Chip
                {...getTagProps({ index: valuesIndex })}
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
