import * as React from "react";

import type { Draggable, MenuLink, SideMenuProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useSideMenuSubMenu = (item: Draggable) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const [pickedLinkId, setPickedLinkId] = React.useState<string | null>(null);

  const { isOpen: isHeaderOpen, onToggle: onHeaderToggle } = useDisclose(false);
  const { isOpen: isStylingOpen, onToggle: onStylingToggle } =
    useDisclose(false);
  const { isOpen: isLinksOpen, onToggle: onLinksToggle } = useDisclose(false);

  const itemProps = React.useMemo(() => {
    if (item.props) {
      return item.props as SideMenuProps;
    }

    return null;
  }, [item]);

  const pickedLinkData = React.useMemo(() => {
    let data: MenuLink;

    if (!itemProps?.links) {
      return null;
    }

    for (let i = 0; i < itemProps.links.length; i++) {
      if (itemProps.links[i].id === pickedLinkId) {
        data = itemProps.links[i];
        break;
      }
    }

    return data ? data : null;
  }, [pickedLinkId, itemProps]);

  // Base Functions
  const updateMenuSubProps = React.useCallback(
    (field: string, body: unknown) => {
      updateDraggableProps(item.id, field, body);
    },
    [item.id, updateDraggableProps]
  );

  const onUpdateChildLinkHandler = React.useCallback(
    (menuLink: MenuLink) => {
      updateDraggableProps(item.id, "links", (prev) => {
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

  const onRemoveLinkHandler = React.useCallback(
    (linkId: string) => {
      const currentLinks = itemProps.links ?? [];
      const toBeRemovedId = currentLinks.findIndex(
        (link) => link.id === linkId
      );
      currentLinks.splice(toBeRemovedId, 1);
      updateMenuSubProps("links", currentLinks);
    },
    [itemProps.links, updateMenuSubProps]
  );

  const onAddLinkHandler = React.useCallback(
    (menuLink: MenuLink) => {
      const id = menuLink.id;

      updateDraggableProps(item.id, "links", (prev) => {
        const prevLinks = (prev as MenuLink[]) ?? [];
        const matchedIndex = prevLinks.findIndex((link) => link.id === id);

        // If not yet there
        if (matchedIndex === -1) {
          return [...prevLinks, menuLink];
        }

        // If already there
        return prevLinks.map((link, index) => {
          if (matchedIndex === index) {
            return menuLink;
          }

          return link;
        });
      });
    },
    [item.id, updateDraggableProps]
  );

  const onEditLinkHandler = React.useCallback(
    (menuLink: MenuLink) => {
      updateDraggableProps(item.id, "links", (prev) => {
        const currentLinks = ((prev as MenuLink[]) ?? []).map((link) => {
          if (link.id === pickedLinkId) {
            return menuLink;
          } else {
            return link;
          }
        });

        return currentLinks;
      });
    },
    [item.id, pickedLinkId, updateDraggableProps]
  );

  return {
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
  };
};
