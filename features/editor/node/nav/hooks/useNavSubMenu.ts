import * as React from "react";

import type { Draggable, NavLink, NavProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useNavSubMenu = (item: Draggable) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const [pickedLinkId, setPickedLinkId] = React.useState<string | null>(null);

  const { isOpen: isTypesOpen, onToggle: onTypesToggle } = useDisclose(
    (item.props as NavProps)?.type ? false : true
  );
  const { isOpen: isLogoOpen, onToggle: onLogoToggle } = useDisclose(false);
  const { isOpen: isStylingOpen, onToggle: onStylingToggle } =
    useDisclose(false);
  const { isOpen: isLinksOpen, onToggle: onLinksToggle } = useDisclose(false);

  const itemProps = React.useMemo(() => {
    if (item.props) {
      return item.props as NavProps;
    }

    return null;
  }, [item]);

  const pickedLinkData = React.useMemo(() => {
    let data: NavLink;

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
  const updateNavProps = React.useCallback(
    (field: string, body: unknown) => {
      updateDraggableProps(item.id, field, body);
    },
    [item.id, updateDraggableProps]
  );

  const onUpdateChildLinkHandler = React.useCallback(
    (navLink: NavLink) => {
      updateDraggableProps(item.id, "links", (prev) => {
        const currentLinks = ((prev as NavLink[]) ?? []).map((link) => {
          if (link.id === navLink.id) {
            return navLink;
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
      const currentLinks = itemProps?.links ?? [];
      const toBeRemovedId = currentLinks.findIndex(
        (link) => link.id === linkId
      );
      currentLinks.splice(toBeRemovedId, 1);
      updateNavProps("links", currentLinks);
    },
    [itemProps?.links, updateNavProps]
  );

  const onAddLinkHandler = React.useCallback(
    (navLink: NavLink) => {
      const id = navLink.id;

      updateDraggableProps(item.id, "links", (prev) => {
        const prevLinks = (prev as NavLink[]) ?? [];
        const matchedIndex = prevLinks.findIndex((link) => link.id === id);

        // If not yet there
        if (matchedIndex === -1) {
          return [...prevLinks, navLink];
        }

        // If already there
        return prevLinks.map((link, index) => {
          if (matchedIndex === index) {
            return navLink;
          }

          return link;
        });
      });
    },
    [item.id, updateDraggableProps]
  );

  const onEditLinkHandler = React.useCallback(
    (navLink: NavLink) => {
      updateDraggableProps(item.id, "links", (prev) => {
        const currentLinks = ((prev as NavLink[]) ?? []).map((link) => {
          if (link.id === pickedLinkId) {
            return navLink;
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
  };
};
