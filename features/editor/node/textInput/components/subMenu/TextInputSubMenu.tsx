import { SelectChangeEvent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { MagicTextIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";
import {
  MagicContainer,
  MagicTextPopup,
  useMagicTextAction,
  useTextInput,
} from "@/features/editor";

interface Props {
  item: Draggable;
}

export const TextInputSubMenu = React.memo(function TextInputSubMenu({
  item,
}: Props) {
  const {
    updateDraggableProps,
    itemProps,
    anchorEl,
    onClosePopover,
    onOpenPopover,
    onDeleteTextContent,
    onAddTextContent,
    onClassicTextContentChange,
  } = useTextInput({ item });

  const { actions } = useMagicTextAction();

  return (
    <Stack padding="16px 12px" borderTop="1px solid #F2F2F2">
      {/* Type */}
      <Typography
        sx={(theme) => ({
          marginBottom: "4px",
          marginLeft: "8px",
          color: "#828282",
          fontSize: theme.typography.fontSize,
          fontWeight: 500,
        })}
      >
        Type
      </Typography>
      <Select
        size="small"
        sx={(theme) => ({
          marginBottom: 3,
          fontSize: theme.typography.fontSize,
        })}
        value={itemProps?.type ?? "NORMAL"}
        onChange={(e: SelectChangeEvent<string>) => {
          updateDraggableProps(item.id, "type", e.target.value);
        }}
      >
        <MenuItem
          value="NORMAL"
          sx={(theme) => ({ fontSize: theme.typography.fontSize })}
        >
          Normal
        </MenuItem>
        <MenuItem
          value="LOWERCASE"
          sx={(theme) => ({ fontSize: theme.typography.fontSize })}
        >
          Lowercase
        </MenuItem>
        <MenuItem
          value="PASSWORD"
          sx={(theme) => ({ fontSize: theme.typography.fontSize })}
        >
          Password
        </MenuItem>
        <MenuItem
          value="EMAIL"
          sx={(theme) => ({ fontSize: theme.typography.fontSize })}
        >
          Email
        </MenuItem>
        <MenuItem
          value="NUMBER"
          sx={(theme) => ({ fontSize: theme.typography.fontSize })}
        >
          Number
        </MenuItem>
      </Select>

      {/* Placeholder */}
      <Typography
        sx={(theme) => ({
          marginLeft: "8px",
          marginBottom: "4px",
          color: "#828282",
          fontSize: theme.typography.fontSize,
          fontWeight: 500,
        })}
      >
        Placeholder
      </Typography>
      <TextField
        sx={{ marginBottom: 3 }}
        size="small"
        inputProps={{ style: { fontSize: 12 } }}
        placeholder="Enter your placeholder"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          updateDraggableProps(item.id, "placeholder", e.target.value);
        }}
        value={itemProps?.placeholder ?? ""}
      />

      {/* Default Value */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={(theme) => ({
            color: "#828282",
            fontSize: theme.typography.fontSize,
            fontWeight: 500,
            marginLeft: "8px",
          })}
        >
          Default Value
        </Typography>
        <IconButton
          onClick={onOpenPopover}
          sx={{ color: anchorEl ? "#11181C" : "rgba(0,0,0,.6)" }}
        >
          <MagicTextIcon sx={{ fontSize: "16px" }} />
        </IconButton>
      </Stack>

      <Stack
        sx={{
          border: "1px solid rgba(0,0,0,.25)",
          borderRadius: 1,
          overFlow: "hidden",
          paddingY: 0.5,
          paddingX: 1,
          marginTop: "-4px",
        }}
      >
        <MagicContainer
          textContents={itemProps?.defaultValue ?? []}
          onDeleteTextContent={onDeleteTextContent}
          onAddClassicTextContent={onAddTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
        />
      </Stack>

      <MagicTextPopup
        actions={actions}
        anchorEl={anchorEl}
        onClose={onClosePopover}
        onCloseAll={onClosePopover}
        onSelect={onAddTextContent}
      />
    </Stack>
  );
});
