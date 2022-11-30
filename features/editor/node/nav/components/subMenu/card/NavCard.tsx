import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";

import type { NavLink, NavProps } from "@/features/editor";

import { useNavCard } from "../../../hooks/useNavCard";
import { GroupingBorder } from "../../helpers";
import {
  FormActions,
  FormButton,
  FormColor,
  FormIcon,
  FormPosition,
  FormText,
} from "./parts";

interface Prop {
  itemProps: NavProps;
  onEditData: NavLink;
  onClose: () => void;
  onSubmit: (value: NavLink) => void;
}

export const NavCard = React.memo(function NavCard({
  itemProps,
  onEditData,
  onClose,
  onSubmit,
}: Prop) {
  const {
    bottomRef,
    topRef,
    navLinkData,
    updateNavLinkProps,
    updateNavLinkSubProps,
    updateNavLinkButtonProps,
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
  } = useNavCard({
    onClose,
    onSubmit,
    onEditData,
    itemProps,
  });

  return (
    <Stack padding="8px 12px" sx={{ width: "100%" }}>
      <Box ref={topRef} sx={{ transform: "translateY(-80px)" }}></Box>

      {/* Color */}
      <FormColor
        navLinkData={navLinkData}
        updateNavLinkSubProps={updateNavLinkSubProps}
      />
      <GroupingBorder />

      {/* Text */}
      <FormText
        navLinkData={navLinkData}
        updateNavLinkSubProps={updateNavLinkSubProps}
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
      <FormIcon
        navLinkData={navLinkData}
        updateNavLinkProps={updateNavLinkProps}
        updateNavLinkSubProps={updateNavLinkSubProps}
        iconsAnchorEl={iconsAnchorEl}
        onIconsOpen={onIconsOpen}
        onIconsClose={onIconsClose}
      />
      <GroupingBorder />

      {/* Label Position */}
      <FormPosition
        navLinkData={navLinkData}
        updateNavLinkSubProps={updateNavLinkSubProps}
      />
      <GroupingBorder />

      {/* Button Styling */}
      <FormButton
        navLinkData={navLinkData}
        updateNavLinkProps={updateNavLinkProps}
        updateNavLinkButtonProps={updateNavLinkButtonProps}
      />
      <GroupingBorder />

      {/* Actions */}
      <FormActions
        navLinkData={navLinkData}
        updateNavLinkProps={updateNavLinkProps}
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
          marginTop: 4,
        })}
        onClick={onClose}
      >
        DONE
      </Button>
      <Box ref={bottomRef}></Box>
    </Stack>
  );
});
