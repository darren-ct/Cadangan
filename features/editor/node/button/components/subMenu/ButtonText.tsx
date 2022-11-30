import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { MagicTextIcon, PaletteIcon } from "@/assets/icons";
import {
  ButtonProps,
  MagicContainer,
  MagicTextPopup,
  TextContent,
  useMagicTextAction,
} from "@/features/editor";

interface Props {
  itemProps: ButtonProps;
  onAddTextContent: (
    newTextContent: TextContent | Record<string, unknown>
  ) => void;
  onClassicTextContentChange: (newText: string, id: string) => void;
  onDeleteTextContent: (id: string) => void;
  onOpenMagicTextPopOver: React.MouseEventHandler<HTMLButtonElement>;
  onCloseMagicTextPopOver: () => unknown;
  anchorEl: HTMLElement;
}

export const ButtonText = React.memo(function ButtonText({
  itemProps,
  onDeleteTextContent,
  onAddTextContent,
  onClassicTextContentChange,
  onOpenMagicTextPopOver,
  onCloseMagicTextPopOver,
  anchorEl,
}: Props) {
  const { actions } = useMagicTextAction();

  return (
    <Stack marginBottom={2}>
      <Typography
        sx={{
          marginBottom: 0.5,
          marginLeft: "6px",
          fontSize: "13px",
          color: " #828282",
          fontWeight: 500,
        }}
      >
        Text
      </Typography>

      <Stack
        direction="column"
        sx={{
          width: "100%",
          border: "1px solid rgba(0,0,0,.25)",
          borderRadius: 1,
        }}
      >
        <MagicContainer
          textContents={itemProps?.content}
          onAddClassicTextContent={onAddTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
          onDeleteTextContent={onDeleteTextContent}
        />
        {/* Options */}
        <Stack direction="row" paddingY="2px" paddingX="2px">
          <Tooltip title="Add Magic Text">
            <IconButton
              sx={{
                color: anchorEl ? "#11181C" : "rgba(0,0,0,.6)",
              }}
              onClick={onOpenMagicTextPopOver}
            >
              <MagicTextIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Tooltip>
          <MagicTextPopup
            actions={actions}
            anchorEl={anchorEl}
            onClose={onCloseMagicTextPopOver}
            onCloseAll={onCloseMagicTextPopOver}
            onSelect={onAddTextContent}
          />
          <Tooltip title="Formatting">
            <IconButton sx={{ color: "#11181C" }}>
              <PaletteIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
});
