import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { RemoveIcon } from "@/assets/icons";
import { FieldIcon } from "@/components/FieldIcon";
import type { Field } from "@/types";

import type { SortCondition } from "../../../../types";

interface Props {
  condition?: SortCondition;
  conditions: SortCondition[];
  field?: Field;
  fields: Field[];
  index: number;
  onOpen: (index: number) => void;
  onRemove: (index: number) => void;
  onSelectCondition: (condition: SortCondition) => void;
  onSelectField: (field: Field) => void;
}

export const ListSortsEntry = React.memo(function ListSortsEntry({
  condition,
  conditions,
  field,
  fields,
  index,
  onOpen,
  onRemove,
  onSelectCondition,
  onSelectField,
}: Props) {
  const handlePressOpen = React.useCallback(() => {
    onOpen(index);
  }, [index, onOpen]);

  const handlePressRemove = React.useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  const handleSelect = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedField = fields.find(
        (item) => item.id === event.target.value
      );

      onSelectField(selectedField);
    },
    [fields, onSelectField]
  );

  const handleSelectCondition = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedCondition = conditions.find(
        (item) => item.id === event.target.value
      );

      onSelectCondition(selectedCondition);
    },
    [conditions, onSelectCondition]
  );

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <FormControl sx={{ flex: 1 }} size="small">
        <Select
          onOpen={handlePressOpen}
          value={field?.id ?? ""}
          placeholder="Select field"
          onChange={handleSelect}
        >
          {fields.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FieldIcon sx={{ color: "black" }} type={item.type} />
                <Typography fontSize="0.875em">{item.name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ flex: 1 }} size="small">
        <Select
          onOpen={handlePressOpen}
          value={condition?.id ?? ""}
          placeholder="Select field"
          onChange={handleSelectCondition}
        >
          {conditions.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontSize="0.875em">{item.name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton onClick={handlePressRemove}>
        <RemoveIcon
          sx={(theme) => ({
            color: theme.palette.grey[600],
            fontSize: "18px",
          })}
        />
      </IconButton>
    </Stack>
  );
});
