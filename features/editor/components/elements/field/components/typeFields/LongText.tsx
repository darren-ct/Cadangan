import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { MagicTextIcon } from "@/assets/icons";
import type { Draggable, TextContent } from "@/features/editor";
import {
  MagicContainer,
  MagicTextPopup,
  useMagicFields,
  useMagicTextAction,
} from "@/features/editor";
import type { Field } from "@/widgets/types";

interface PropsLongText {
  item: Draggable;
  field: Field;
  name: string;
  value?: TextContent[];
  onChange?: (value: TextContent[]) => void;
}

export const LongText = React.memo(function FieldLongText({
  onChange,
  value,
  item,
  name,
  field,
}: PropsLongText) {
  const {
    memoizedValue,
    anchorEl,
    onOpenPopOver: onOpen,
    onClosePopOver: onClose,
    onAddTextContent,
    onDeleteTextContent,
    onClassicTextContentChange,
  } = useMagicFields({ value, onChange, field });

  const { actions } = useMagicTextAction(item);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "6px",
        transition: 150,
      }}
    >
      {/* Name */}
      <Typography
        fontWeight="500"
        variant="subtitle1"
        sx={(theme) => ({ mb: "2px", fontSize: theme.typography.fontSize })}
      >
        {name}
      </Typography>

      {/* Field */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ width: "100%", backgroundColor: "white" }}
      >
        <MagicContainer
          textContents={memoizedValue}
          onDeleteTextContent={onDeleteTextContent}
          onAddClassicTextContent={onAddTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
        />
        <Tooltip title="Add Magic Text">
          <IconButton
            size="small"
            sx={{ color: anchorEl ? "#11181C" : "rgba(0,0,0,.6)" }}
            onClick={onOpen}
          >
            <MagicTextIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Popover */}
      <MagicTextPopup
        actions={actions}
        anchorEl={anchorEl}
        onClose={onClose}
        onCloseAll={onClose}
        onSelect={onAddTextContent}
      />
    </Box>
  );
});
