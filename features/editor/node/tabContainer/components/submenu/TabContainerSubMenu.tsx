import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable } from "@/features/editor";
import { SubMenuSection, useTabContainerSubMenu } from "@/features/editor";

import { TabLinks, TabStyling } from "./index";

interface Props {
  item: Draggable;
}

export const TabContainerSubMenu = React.memo(function TabContainerSubMenu({
  item,
}: Props) {
  const {
    itemProps,
    pickedLinkData,
    setPickedLinkId,
    isStylingOpen,
    onStylingToggle,
    isTabLinksOpen,
    onTabLinksToggle,
    onAddTabLink,
    onEditTabLink,
    onRemoveTabLink,
  } = useTabContainerSubMenu(item);

  return (
    <Stack direction="column" paddingY={1.5}>
      {/* Styling */}
      <SubMenuSection
        title="Styling"
        onToggle={onStylingToggle}
        isOpen={isStylingOpen}
      >
        <TabStyling />
      </SubMenuSection>
      {/* Components */}
      <SubMenuSection
        title="Tabs"
        onToggle={onTabLinksToggle}
        isOpen={isTabLinksOpen}
      >
        <TabLinks
          tabLinks={itemProps.tabLinks}
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onAddTabLink={onAddTabLink}
          onEditTabLink={onEditTabLink}
          onRemoveTabLink={onRemoveTabLink}
        />
      </SubMenuSection>
    </Stack>
  );
});
