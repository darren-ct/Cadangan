import * as React from "react";

import type { Draggable, TabContainerProps, TabLink } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useTabContainerSubMenu = (item: Draggable) => {
  const { updateDraggable, updateDraggableProps } = useEditorDraggableStore();
  const { isOpen: isStylingOpen, onToggle: onStylingToggle } = useDisclose();
  const { isOpen: isTabLinksOpen, onToggle: onTabLinksToggle } = useDisclose();

  const [pickedLinkId, setPickedLinkId] = React.useState<string>("");

  const itemProps = React.useMemo(() => {
    return item.props as TabContainerProps;
  }, [item.props]);

  const pickedLinkData = React.useMemo(() => {
    return itemProps?.tabLinks?.find((tabLink) => tabLink.id === pickedLinkId);
  }, [itemProps?.tabLinks, pickedLinkId]);

  // Functions
  const onAddTabLink = React.useCallback(
    (tabLink: TabLink) => {
      const currentTabLinks = [...(itemProps.tabLinks ?? []), tabLink];

      updateDraggableProps(item.id, "tabLinks", currentTabLinks);
    },
    [item.id, itemProps.tabLinks, updateDraggableProps]
  );

  const onEditTabLink = React.useCallback(
    (newTabLink: TabLink) => {
      const currentTabLinks = [...(itemProps.tabLinks ?? [])].map((tabLink) => {
        if (tabLink.id === pickedLinkId) {
          return newTabLink;
        } else {
          return tabLink;
        }
      });

      updateDraggableProps(item.id, "tabLinks", currentTabLinks);
    },
    [item.id, itemProps.tabLinks, pickedLinkId, updateDraggableProps]
  );

  const onRemoveTabLink = React.useCallback(
    (id: string) => {
      const currentTabLinks = (itemProps.tabLinks ?? []).filter(
        (tabLink) => tabLink.id !== id
      );

      updateDraggableProps(item.id, "tabLinks", currentTabLinks);
    },
    [item.id, itemProps.tabLinks, updateDraggableProps]
  );

  const onHideToggle = React.useCallback(
    (item: Draggable) => {
      const isHidden = item.isHidden;

      updateDraggable(item.id, { ...item, isHidden: !isHidden });
    },
    [updateDraggable]
  );

  return {
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
    onHideToggle,
  };
};
