import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon, CloseIcon, MagicTextIcon } from "@/assets/icons";
import type { TabLink } from "@/features/editor";
import {
  IconDisplay,
  IconDropdown,
  MagicContainer,
  MagicTextPopup,
  useTabContainerCard,
} from "@/features/editor";

interface Props {
  pickedLinkData?: TabLink;
  setPickedLinkId?: React.Dispatch<React.SetStateAction<string>>;
  onEditTabLink?: (tabLink: TabLink) => void;
}

export const TabContainerCard = React.memo(function TabContainerCard({
  pickedLinkData,
  setPickedLinkId,
  onEditTabLink,
}: Props) {
  const tabLinkData = React.useMemo(() => {
    return pickedLinkData ?? ({ id: String(Date.now()) } as TabLink);
  }, [pickedLinkData]);

  const {
    magicActions,
    iconsAnchorEl,
    onIconsClose,
    onIconsOpen,
    magicAnchorEl,
    onCloseMagicPopover,
    onOpenMagicPopover,
    onAddTextContent,
    onClassicTextContentChange,
    onDeleteTextContent,
    updateTabContainerLink,
  } = useTabContainerCard({
    tabLinkData,
    onEditTabLink,
  });

  return (
    <Stack padding="8px 12px" sx={{ margin: "0px auto" }}>
      {/* Text */}
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
          textContents={tabLinkData?.text}
          onAddClassicTextContent={onAddTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
          onDeleteTextContent={onDeleteTextContent}
        />
        <IconButton onClick={onOpenMagicPopover}>
          <MagicTextIcon
            sx={(theme) => ({ fontSize: theme.typography.fontSize + 4 })}
          />
        </IconButton>
        <MagicTextPopup
          actions={magicActions}
          anchorEl={magicAnchorEl}
          onClose={onCloseMagicPopover}
          onCloseAll={onCloseMagicPopover}
          onSelect={onAddTextContent}
        />
      </Stack>

      {/* Icon */}
      <Typography
        sx={(theme) => ({
          fontWeight: 600,
          fontSize: theme.typography.fontSize,
          marginBottom: "3px",
          marginTop: 2,
        })}
      >
        Icon
      </Typography>
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <Stack
          onClick={onIconsOpen}
          position="relative"
          direction="row"
          alignItems="center"
          bgcolor="#FAFAFA"
          paddingX={0.8}
          paddingY={0.3}
          sx={{
            width: "100%",
            cursor: "pointer",
            borderRadius: 2,
            "&:hover": {
              background: "rgba(0,0,0,0.1)",
            },
            transition: "150ms linear",
          }}
        >
          {tabLinkData.iconName && <IconDisplay name={tabLinkData.iconName} />}

          {tabLinkData.iconName ? (
            <Typography
              sx={(theme) => ({
                marginLeft: 2,
                flex: 1,
                fontSize: theme.typography.fontSize,
              })}
            >
              {tabLinkData.iconName}
            </Typography>
          ) : (
            <Typography
              sx={(theme) => ({
                flex: 1,
                fontSize: theme.typography.fontSize,
              })}
            >
              No icons selected
            </Typography>
          )}

          <IconButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              updateTabContainerLink("iconName", "");
            }}
          >
            <CloseIcon sx={{ fontSize: "14px" }} />
          </IconButton>
          <ChevronDownIcon sx={{ cursor: "pointer" }} />

          <IconDropdown
            onPickIcon={(_prop, newValue) =>
              updateTabContainerLink("iconName", newValue)
            }
            onDropdownClose={(e) => {
              e.stopPropagation();
              onIconsClose();
            }}
            anchorEl={iconsAnchorEl}
          />
        </Stack>
      </Stack>

      <Button
        sx={{ marginTop: 3 }}
        variant="contained"
        onClick={() => setPickedLinkId("")}
      >
        Done
      </Button>
    </Stack>
  );
});
