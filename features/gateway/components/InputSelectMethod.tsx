import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

import type { Method } from "@/types";

import { useMethodTypes } from "../hooks/useMethodTypes";

interface Props {
  isInternal: boolean;
  selectedMehod: Method;
  onChange: (method: Method) => void;
}

export const InputSelectMethod = React.memo(function InputSelectMethod({
  isInternal,
  selectedMehod,
  onChange,
}: Props) {
  const { customMethods, methods } = useMethodTypes();

  const data = React.useMemo(() => {
    return isInternal ? methods.slice(0) : customMethods.slice(0);
  }, [customMethods, isInternal, methods]);

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      const method = data.find((item) => item.id === event.target.value);
      onChange(method);
    },
    [data, onChange]
  );

  return (
    <FormControl variant="outlined" sx={{ m: 1 }} size="small" fullWidth>
      <InputLabel id="select-method-label">Method</InputLabel>
      <Select
        labelId="select-method-label"
        id="select-method"
        label="Method"
        value={selectedMehod?.id ?? ""}
        onChange={handleChange}
      >
        {data.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Chip
              size="small"
              label={item.label}
              sx={{
                backgroundColor: item.bgColor,
                color: item.color,
                marginRight: 1,
                borderRadius: 1,
              }}
            />
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
