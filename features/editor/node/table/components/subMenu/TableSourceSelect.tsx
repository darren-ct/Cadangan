import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Table } from "@/widgets/types";

interface Props {
  tables: Table[];
  onSelect: (value: Table) => void;
  value?: Table | undefined;
}

export const TableSourceSelect = React.memo(function TableSourceSelect({
  tables,
  onSelect,
  value,
}: Props) {
  return (
    <Stack direction="row" alignItems="center" sx={{ marginBottom: 1 }}>
      <Typography
        sx={(theme) => ({
          marginBottom: 1,
          flex: 1,
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
          width: "165px",
        })}
      >
        Source
      </Typography>
      <Autocomplete
        size="small"
        id="combo-box-demo"
        options={tables}
        getOptionLabel={(option: Table) => option.name}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select table"
            InputProps={{
              ...params.InputProps,
              style: { fontSize: 12, width: "100%" },
            }}
          />
        )}
        onChange={(_e, value) => onSelect(value as Table)}
        disableClearable
        value={value ?? undefined}
        sx={(theme) => ({
          flex: 2,
          fontSize: theme.typography.fontSize,
        })}
      />
    </Stack>
  );
});
