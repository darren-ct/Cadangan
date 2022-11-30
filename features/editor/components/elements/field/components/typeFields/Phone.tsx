import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Field } from "@/widgets/types";

interface PropsSingleLineText {
  name: string;
  error?: string;
  onChange?: (value: string) => void;
  field: Field;
  value?: string;
  hideLabel?: boolean;
}

export const Phone = React.memo(function Phone({
  name,
  error,
  onChange,
  value,
  hideLabel,
}: PropsSingleLineText) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
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
        placeholder="Enter numbers only"
        fullWidth
        autoComplete="off"
        value={value ? value : ""}
        onChange={handleChange}
        error={error ? true : false}
        id="outlined-error-helper-text"
        size="small"
        variant="standard"
        helperText={error}
        inputProps={{ style: { fontSize: 12 } }}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{ backgroundColor: "white", paddingX: "8px", paddingY: "4px" }}
      />
    </Box>
  );
});
