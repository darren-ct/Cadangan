import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";

import type { MenuLink, SideMenuProps } from "@/features/editor";

import { useSideMenuCard } from "../../../hooks";
import { GroupingBorder } from "../../helpers";
import {
  SideMenuActions,
  SideMenuButton,
  SideMenuColor,
  SideMenuIcon,
  SideMenuPosition,
  SideMenuText,
} from "./parts";

interface Prop {
  itemProps: SideMenuProps;
  onEditData?: MenuLink;
  onClose: () => void;
  onSubmit: (value: MenuLink) => void;
}

export const SideMenuCard = React.memo(function SideMenuCard({
  itemProps,
  onEditData,
  onClose,
  onSubmit,
}: Prop) {
  const {
    bottomRef,
    topRef,
    menuLinkData,
    updateMenuLinkProps,
    updateMenuLinkSubProps,
    updateMenuLinkButtonProps,
    magicActions,
    onAddTextContent,
    onClassicTextContentChange,
    onDeleteTextContent,
    magicAnchorEl,
    onMagicOpen,
    onMagicClose,
    iconsAnchorEl,
    onIconsOpen,
    onIconsClose,
    actions,
    actionsAnchorEl,
    onActionsOpen,
    onActionsClose,
    onActionsSelect,
  } = useSideMenuCard({
    onClose,
    onSubmit,
    onEditData,
    itemProps,
  });

  return (
    <Stack padding="8px 12px" sx={{ width: "100%" }}>
      <Box ref={topRef} sx={{ transform: "translateY(-80px)" }}></Box>

      {/* Color */}
      <SideMenuColor
        menuLinkData={menuLinkData}
        updateMenuLinkSubProps={updateMenuLinkSubProps}
      />
      <GroupingBorder />

      {/* Text */}
      <SideMenuText
        menuLinkData={menuLinkData}
        updateMenuLinkSubProps={updateMenuLinkSubProps}
        magicActions={magicActions}
        onAddTextContent={onAddTextContent}
        onClassicTextContentChange={onClassicTextContentChange}
        onDeleteTextContent={onDeleteTextContent}
        magicAnchorEl={magicAnchorEl}
        onMagicOpen={onMagicOpen}
        onMagicClose={onMagicClose}
      />
      <GroupingBorder />

      {/* Icon */}
      <SideMenuIcon
        menuLinkData={menuLinkData}
        updateMenuLinkProps={updateMenuLinkProps}
        updateMenuLinkSubProps={updateMenuLinkSubProps}
        iconsAnchorEl={iconsAnchorEl}
        onIconsOpen={onIconsOpen}
        onIconsClose={onIconsClose}
      />
      <GroupingBorder />

      {/* Label Position */}
      <SideMenuPosition
        menuLinkData={menuLinkData}
        updateMenuLinkSubProps={updateMenuLinkSubProps}
      />
      <GroupingBorder />

      {/* Button Styling */}
      <SideMenuButton
        menuLinkData={menuLinkData}
        updateMenuLinkProps={updateMenuLinkProps}
        updateMenuLinkButtonProps={updateMenuLinkButtonProps}
      />
      <GroupingBorder />

      {/* Actions */}
      <SideMenuActions
        menuLinkData={menuLinkData}
        updateMenuLinkProps={updateMenuLinkProps}
        actions={actions}
        actionsAnchorEl={actionsAnchorEl}
        onActionsOpen={onActionsOpen}
        onActionsClose={onActionsClose}
        onActionsSelect={onActionsSelect}
      />

      <Button
        variant="contained"
        sx={(theme) => ({
          fontSize: theme.typography.fontSize - 1,
          marginTop: 6,
        })}
        onClick={onClose}
      >
        DONE
      </Button>

      <Box ref={bottomRef}></Box>
    </Stack>
  );
});
