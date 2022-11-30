import Box from "@mui/material/Box";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import * as React from "react";

import type { Field } from "@/widgets/types";

interface Props {
  anchorEl: HTMLElement | null;
  fields: Field[];
  value: Field;
  onChange: (field: Field) => void;
  onClose: () => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export const StackingFieldsMenu = React.memo(function StackingFieldsMenu({
  anchorEl,
  fields,
  value,
  onClose,
  onChange,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "left",
  },
}: Props) {
  // States
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [hoveredFieldId, setHoveredFieldId] = React.useState<string>(value?.id);

  // Memo
  const filteredFields = React.useMemo(() => {
    return fields.filter(
      (field) =>
        field.name.toLowerCase().startsWith(searchValue.toLowerCase()) &&
        field.type === "singleSelect"
    );
  }, [fields, searchValue]);

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Box
        sx={{
          width: 300,
        }}
      >
        <Box
          sx={{
            maxHeight: "70vh",
          }}
        >
          <TextField
            variant="standard"
            fullWidth
            size="small"
            placeholder="Find an option"
            InputProps={{
              disableUnderline: true,
            }}
            sx={{ paddingX: 2, paddingY: 1.6 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {filteredFields.map((field) => (
            <Box
              onMouseEnter={() => setHoveredFieldId(field.id)}
              sx={{
                cursor: "pointer",
                padding: 1.4,
                background:
                  field.id === hoveredFieldId ? "rgba(0,0,0,.05)" : "white",
              }}
              onClick={() => {
                onChange(field);
                onClose();
              }}
            >
              {field.name}
            </Box>
          ))}
        </Box>
      </Box>
    </Popover>
  );
});
