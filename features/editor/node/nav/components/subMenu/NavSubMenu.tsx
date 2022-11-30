import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable } from "@/features/editor";
import { SubMenuSection } from "@/features/editor";

import { useNavSubMenu } from "../../hooks";
import { NavLinks } from "./NavLinks";
import { NavLogo } from "./NavLogo";
import { NavStyling } from "./NavStyling";
import { NavTypes } from "./NavTypes";

interface Props {
  item: Draggable;
}

export const NavSubMenu = React.memo(function NavSubMenu({ item }: Props) {
  const {
    itemProps,
    setPickedLinkId,
    pickedLinkData,
    isTypesOpen,
    onTypesToggle,
    isLogoOpen,
    onLogoToggle,
    isStylingOpen,
    onStylingToggle,
    isLinksOpen,
    onLinksToggle,
    onUpdateChildLinkHandler,
    onAddLinkHandler,
    onEditLinkHandler,
    onRemoveLinkHandler,
  } = useNavSubMenu(item);

  return (
    <Stack direction="column" position="relative">
      {/* Type Settings */}
      <SubMenuSection
        title="Types"
        isOpen={isTypesOpen}
        onToggle={onTypesToggle}
      >
        <NavTypes item={item} itemProps={itemProps} />
      </SubMenuSection>
      {/* Logo Settings */}
      <SubMenuSection title="Logo" isOpen={isLogoOpen} onToggle={onLogoToggle}>
        <NavLogo item={item} itemProps={itemProps} />
      </SubMenuSection>
      {/* Global Styling Settings */}
      <SubMenuSection
        title="Global Styling"
        isOpen={isStylingOpen}
        onToggle={onStylingToggle}
      >
        <NavStyling item={item} itemProps={itemProps} />
      </SubMenuSection>
      {/* Navigation Links */}
      <SubMenuSection
        title="Navigation Links"
        isOpen={isLinksOpen}
        onToggle={onLinksToggle}
      >
        <NavLinks
          itemProps={itemProps}
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onAddLinkHandler={onAddLinkHandler}
          onEditLinkHandler={onEditLinkHandler}
          onUpdateChildLinkHandler={onUpdateChildLinkHandler}
          onRemoveLinkHandler={onRemoveLinkHandler}
        />
      </SubMenuSection>
    </Stack>
  );
});
