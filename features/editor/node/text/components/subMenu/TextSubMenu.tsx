import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";
import { useMagicSubMenu } from "@/features/editor";

import { useTextSubMenu } from "../../hooks";
import { TextSettings } from "./TextSettings";
import { TextStyles } from "./TextStyles";

interface Props {
  item: Draggable;
}

export const TextSubMenu = React.memo(function TextSubMenu({ item }: Props) {
  const {
    isPaletteOpen,
    onPaletteToggle,
    onActionsToggle,
    onStylesToggle,
    isStylesOpen,
    activeDropdown,
    onDropdownToggle,
    itemProps,
  } = useTextSubMenu(item);

  const {
    magicAnchorEl,
    onClassicTextContentChange,
    onAddTextContent,
    onDeleteTextContent,
    onOpenMagicTextPopOver,
    onCloseMagicTextPopOver,
  } = useMagicSubMenu({ item });

  return (
    <Stack direction="column" padding="16px 12px" borderTop="1px solid #F2F2F2">
      {/* Main Settings */}
      <TextSettings
        itemId={item.id}
        itemProps={itemProps}
        anchorEl={magicAnchorEl}
        isPaletteOpen={isPaletteOpen}
        onPaletteToggle={onPaletteToggle}
        activeDropdown={activeDropdown}
        onDropdownToggle={onDropdownToggle}
        onOpenMagicTextPopOver={onOpenMagicTextPopOver}
        onCloseMagicTextPopOver={onCloseMagicTextPopOver}
        onAddTextContent={onAddTextContent}
        onClassicTextContentChange={onClassicTextContentChange}
        onDeleteTextContent={onDeleteTextContent}
      />

      {/* Actions */}
      <Stack alignItems="flex-start" position="relative">
        <Typography
          sx={(theme) => ({
            paddingLeft: "8px",
            marginBottom: "8px",
            fontSize: theme.typography.fontSize,
            fontWeight: 500,
            color: "#828282",
          })}
        >
          Click Actions
        </Typography>
        <Button
          variant="text"
          size="small"
          startIcon={<AddIcon />}
          sx={{ fontSize: "11px", color: "#130F40" }}
          onClick={onActionsToggle}
        >
          ADD ACTION
        </Button>
      </Stack>

      {/* Other Styles */}
      <Button
        onClick={onStylesToggle}
        variant="outlined"
        size="small"
        sx={{
          width: "160px",
          margin: "40px auto 20px auto",
          borderRadius: "16px",
          color: "#130F40",
          borderColor: "#130F40",
          "&:hover": {
            borderColor: "#130f40",
          },
          fontSize: "11px",
        }}
      >
        EDIT STYLES
      </Button>

      {isStylesOpen && <TextStyles />}
    </Stack>
  );
});
