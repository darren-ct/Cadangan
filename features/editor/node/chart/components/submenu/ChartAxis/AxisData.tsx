import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { DeleteIcon } from "@/assets/icons";
import type { ChartAxis, ChartAxisContents } from "@/features/editor";
import { Field } from "@/widgets/types";

import { ColorPicker } from "./ColorPicker";

interface Props extends ChartAxis {
  fields: Field[];
  onChange: (id: string, key: string, value: Field | string) => unknown;
  onDelete?: (id: string) => unknown;
  label?: string;
  content?: ChartAxisContents[];
}

const barTypes: { label: string; value: string }[] = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
];

export const AxisData = React.memo(function AxisData({
  id,
  field,
  fields,
  onChange,
  onDelete,
  label,
  colors,
  content = [],
  type,
}: Props) {
  const isShowField = React.useMemo(() => content.includes("field"), [content]);
  const isShowDisplayAs = React.useMemo(
    () => content.includes("displayAs"),
    [content]
  );
  const isShowColor = React.useMemo(() => content.includes("color"), [content]);

  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
        paddingX: 1,
        paddingY: 0.5,
        backgroundColor: "white",
        borderRadius: 1,
      }}
      gap={1}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        {label && (
          <Typography
            fontWeight="500"
            variant="subtitle2"
            sx={{ justifySelf: "start" }}
          >
            {label}
          </Typography>
        )}
        {onDelete && (
          <IconButton
            onClick={() => onDelete(id)}
            size="small"
            sx={{ justifySelf: "end" }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
      {isShowField && (
        <Autocomplete
          id="combo-box-demo"
          options={fields}
          getOptionLabel={(option: Field) => option.name}
          fullWidth
          renderInput={(params) => (
            <TextField {...params} placeholder="Select field" />
          )}
          onChange={(_e, value) => onChange(id, "field", value as Field)}
          disableClearable
          value={!field ? null : field}
          size="small"
        />
      )}

      {isShowDisplayAs && (
        <>
          <Typography
            fontWeight="500"
            variant="subtitle2"
            sx={{ justifySelf: "start" }}
          >
            Data display as
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={(e) => onChange(id, "type", e.target.value)}
            size="small"
          >
            {barTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      {isShowColor && (
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              fontWeight="500"
              variant="subtitle2"
              sx={{ justifySelf: "start" }}
            >
              Chart color
            </Typography>
            <Tooltip title="Multicolor?" placement="top" arrow>
              <Checkbox size="small" />
            </Tooltip>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
            }}
          >
            {colors.map((color, idx) =>
              isShowDisplayAs && idx > 0 ? null : (
                <ColorPicker
                  key={color + idx}
                  onChange={(value) =>
                    onChange(id, "colors", value + "-" + idx)
                  }
                  value={color as string}
                />
              )
            )}
          </Box>
        </Box>
      )}
    </Stack>
  );
});
