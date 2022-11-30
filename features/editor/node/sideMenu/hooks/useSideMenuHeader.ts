import * as React from "react";

import type { Draggable, MenuLink, SideMenuProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

export const useSideMenuHeader = (item: Draggable) => {
  const { updateDraggableProps } = useEditorDraggableStore();

  const [pickedLinkId, setPickedLinkId] = React.useState<string | null>(null);

  const itemProps = React.useMemo(() => {
    if (item.props) {
      return item.props as SideMenuProps;
    }

    return null;
  }, [item]);

  const pickedLinkData = React.useMemo(() => {
    let data: MenuLink;

    if (!itemProps?.headerLinks) {
      return null;
    }

    for (let i = 0; i < itemProps.headerLinks.length; i++) {
      if (itemProps.headerLinks[i].id === pickedLinkId) {
        data = itemProps.headerLinks[i];
        break;
      }
    }

    return data ? data : null;
  }, [pickedLinkId, itemProps]);

  // Functions
  const onUpdateChildLinkHandler = React.useCallback(
    (menuLink: MenuLink) => {
      updateDraggableProps(item.id, "headerLinks", (prev) => {
        const currentLinks = ((prev as MenuLink[]) ?? []).map((link) => {
          if (link.id === menuLink.id) {
            return menuLink;
          } else {
            return link;
          }
        });

        return currentLinks;
      });
    },
    [item.id, updateDraggableProps]
  );

  return {
    itemProps,
    pickedLinkData,
    setPickedLinkId,
    onUpdateChildLinkHandler,
  };
};
