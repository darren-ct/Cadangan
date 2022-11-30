import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { FormTodoAction } from "@/features/editor";

interface Props {
  actions: FormTodoAction[];
  onSelect?: (value: FormTodoAction) => void;
  value?: FormTodoAction;
}

export const SelectFormTodo = React.memo(function SelectFormTodo({
  actions,
  onSelect,
  value,
}: Props) {
  return (
    <Stack sx={{ marginBottom: 1 }}>
      <Typography
        sx={(theme) => ({
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
          color: "#828282",
          marginBottom: "4px",
        })}
      >
        What do you want the form to do?
      </Typography>
      <Autocomplete
        size="small"
        id="combo-box-demo"
        options={actions}
        getOptionLabel={(option: FormTodoAction) => option.label}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} placeholder="Select table" />
        )}
        onChange={(_e, value) => onSelect(value as FormTodoAction)}
        disableClearable
        value={value ?? undefined}
      />
    </Stack>
  );
});
