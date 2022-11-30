import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon, CloseIcon } from "@/assets/icons";
import type { ButtonProps } from "@/features/editor";
import {
  IconDisplay,
  IconDropdown,
  useEditorDraggableStore,
} from "@/features/editor";

interface Props {
  itemProps: ButtonProps;
  itemId: string;
}

export const ButtonIcons = React.memo(function ButtonIcons({
  itemProps,
  itemId,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const onDropdownClose = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setAnchorEl(null);
    },
    [setAnchorEl]
  );

  const onDropdownOpen: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback((e) => {
      setAnchorEl(e.currentTarget);
    }, []);

  return (
    <Stack marginBottom={2}>
      <Typography
        sx={{
          marginBottom: 0.5,
          fontWeight: 500,
          color: " #828282",
          marginLeft: 1,
          fontSize: "12px",
        }}
      >
        Icon
      </Typography>

      <Stack
        onClick={onDropdownOpen}
        position="relative"
        direction="row"
        alignItems="center"
        bgcolor="#FAFAFA"
        paddingX={0.8}
        paddingY={0.3}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          "&:hover": {
            background: "rgba(0,0,0,0.1)",
          },
          transition: "150ms linear",
        }}
      >
        {itemProps?.icon ? <IconDisplay name={itemProps.icon} /> : ""}

        {itemProps?.icon ? (
          <Typography sx={{ marginLeft: 2, flex: 1, fontSize: "12px" }}>
            {itemProps.icon}
          </Typography>
        ) : (
          <Typography sx={{ flex: 1, fontSize: "12px" }}>
            No icons selected
          </Typography>
        )}

        <IconButton
          onClick={() => {
            updateDraggableProps(itemId, "icon", "");
          }}
        >
          <CloseIcon sx={{ fontSize: "14px" }} />
        </IconButton>
        <ChevronDownIcon sx={{ cursor: "pointer" }} />

        <IconDropdown
          onPickIcon={(prop, newValue) => {
            updateDraggableProps(itemId, prop, newValue);
          }}
          onDropdownClose={onDropdownClose}
          anchorEl={anchorEl}
        />
      </Stack>
    </Stack>
  );
});
