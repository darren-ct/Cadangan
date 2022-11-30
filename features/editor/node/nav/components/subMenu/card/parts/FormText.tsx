import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import {
  BoldIcon,
  ItalicIcon,
  MagicTextIcon,
  UnderLinedTextIcon,
} from "@/assets/icons";
import type { MagicTextSubLink, NavLink, TextContent } from "@/features/editor";
import { MagicContainer, MagicTextPopup } from "@/features/editor";

import { IconWrapper } from "../../../helpers";

interface Props {
  navLinkData: NavLink;
  updateNavLinkSubProps: (name: string, body: unknown) => void;
  magicActions: MagicTextSubLink[];
  onAddTextContent: (newContent: TextContent) => void;
  onClassicTextContentChange: (newText: string | number, id: string) => void;
  onDeleteTextContent: (id: string) => void;
  magicAnchorEl: HTMLElement;
  onMagicOpen: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMagicClose: () => void;
}

export const FormText = React.memo(function FormText({
  navLinkData,
  updateNavLinkSubProps,
  magicActions,
  onAddTextContent,
  onClassicTextContentChange,
  onDeleteTextContent,
  magicAnchorEl,
  onMagicOpen,
  onMagicClose,
}: Props) {
  return (
    <React.Fragment>
      <Stack direction="column" marginBottom={1.5}>
        <Typography
          sx={(theme) => ({
            fontWeight: 600,
            fontSize: theme.typography.fontSize,
            marginBottom: "3px",
          })}
        >
          Text
        </Typography>
        <Stack direction="row" bgcolor="white">
          <MagicContainer
            textContents={navLinkData?.text}
            onAddClassicTextContent={onAddTextContent}
            onClassicTextContentChange={onClassicTextContentChange}
            onDeleteTextContent={onDeleteTextContent}
          />
          <IconButton onClick={onMagicOpen}>
            <MagicTextIcon
              sx={(theme) => ({ fontSize: theme.typography.fontSize + 4 })}
            />
          </IconButton>
          <MagicTextPopup
            actions={magicActions}
            anchorEl={magicAnchorEl}
            onClose={onMagicClose}
            onCloseAll={onMagicClose}
            onSelect={onAddTextContent}
          />
        </Stack>
      </Stack>
      <Stack direction="column">
        <Stack direction="row" spacing={0.35}>
          <IconWrapper
            isActive={navLinkData.subProps?.isBold}
            onClick={() =>
              updateNavLinkSubProps("isBold", !navLinkData.subProps?.isBold)
            }
          >
            <BoldIcon
              sx={(theme) => ({
                fontSize: theme.typography.fontSize - 2,
                color: navLinkData.subProps?.isBold ? "white" : "#130F40",
              })}
            />
          </IconWrapper>
          <IconWrapper
            isActive={navLinkData.subProps?.isItalic}
            onClick={() =>
              updateNavLinkSubProps("isItalic", !navLinkData.subProps?.isItalic)
            }
          >
            <ItalicIcon
              sx={(theme) => ({
                fontSize: theme.typography.fontSize - 2,
                color: navLinkData.subProps?.isItalic ? "white" : "#130F40",
              })}
            />
          </IconWrapper>
          <IconWrapper
            isActive={navLinkData.subProps?.isUnderlined}
            onClick={() =>
              updateNavLinkSubProps(
                "isUnderlined",
                !navLinkData.subProps?.isUnderlined
              )
            }
          >
            <UnderLinedTextIcon
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
                color: navLinkData.subProps?.isUnderlined ? "white" : "#130F40",
              })}
            />
          </IconWrapper>
          <TextField
            size="small"
            type="number"
            placeholder="px"
            sx={{
              width: 50,
              border: "1px solid rgba(19, 15, 64, .25)",
              paddingX: "2px",
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateNavLinkSubProps("fontSize", e.target.value)
            }
            value={navLinkData.subProps?.fontSize ?? 14}
          />
        </Stack>
      </Stack>
    </React.Fragment>
  );
});
