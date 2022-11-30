import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable } from "@/features/editor";
import { SubMenuSection, useSideMenuSubMenu } from "@/features/editor";

import { SideMenuHeader, SideMenuLinks, SideMenuStyling } from "./index";

interface Props {
  item: Draggable;
}

export const SideMenuSubMenu = React.memo(function SideMenuSubMenu({
  item,
}: Props) {
  const {
    itemProps,
    setPickedLinkId,
    pickedLinkData,
    isHeaderOpen,
    onHeaderToggle,
    isStylingOpen,
    onStylingToggle,
    isLinksOpen,
    onLinksToggle,
    onUpdateChildLinkHandler,
    onAddLinkHandler,
    onEditLinkHandler,
    onRemoveLinkHandler,
  } = useSideMenuSubMenu(item);

  return (
    <Stack direction="column">
      {/* Header Settings */}
      <SubMenuSection
        title="Menu Header"
        isOpen={isHeaderOpen}
        onToggle={onHeaderToggle}
      >
        <SideMenuHeader item={item} />
      </SubMenuSection>
      {/* Global Styling Settings */}
      <SubMenuSection
        title="Global Styling"
        isOpen={isStylingOpen}
        onToggle={onStylingToggle}
      >
        <SideMenuStyling item={item} itemProps={itemProps} />
      </SubMenuSection>
      {/* Navigation Links */}
      <SubMenuSection
        title="Menu Links"
        isOpen={isLinksOpen}
        onToggle={onLinksToggle}
      >
        <SideMenuLinks
          itemProps={itemProps}
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onUpdateChildLinkHandler={onUpdateChildLinkHandler}
          onAddLinkHandler={onAddLinkHandler}
          onEditLinkHandler={onEditLinkHandler}
          onRemoveLinkHandler={onRemoveLinkHandler}
        />
      </SubMenuSection>
    </Stack>
  );
});
