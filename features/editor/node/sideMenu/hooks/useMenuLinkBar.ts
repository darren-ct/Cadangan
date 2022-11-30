import * as React from "react";

import type { MenuLink, MenuLinkSubProps } from "@/features/editor";
import { useDisclose } from "@/hooks";

interface Props {
  currentLink: MenuLink;
  onUpdateParentLinkHandler: (menuLink: MenuLink) => void;
}

export const useMenuLinkBar = ({
  currentLink,
  onUpdateParentLinkHandler,
}: Props) => {
  // Hooks
  const {
    isOpen: isSubLinksOpen,
    onOpen: onSubLinksOpen,
    onClose: onSubLinksClose,
  } = useDisclose();

  //  Memo & States
  const currentSubLinks = React.useMemo(() => {
    return currentLink.links ?? [];
  }, [currentLink.links]);

  const [pickedSubLinkId, setPickedSubLinkId] = React.useState<string>("");
  const pickedSubLinkData = React.useMemo(() => {
    return currentSubLinks.find((subLink) => subLink.id === pickedSubLinkId);
  }, [currentSubLinks, pickedSubLinkId]);

  // Passed Down
  const onUpdateLinkHandler = React.useCallback(
    (navLink: MenuLink) => {
      const newSubLinks = currentSubLinks.map((subLink) => {
        if (subLink.id === navLink.id) {
          return navLink;
        } else {
          return subLink;
        }
      });

      // Check & Update
      if (
        currentLink.links &&
        currentLink.links.length > 0 &&
        !currentLink.iconName
      ) {
        const newLink: MenuLink = {
          ...currentLink,
          links: newSubLinks,
          iconName: "down-arrow",
          subProps: {
            ...currentLink.subProps,
            labelPosition: "right-left",
          } as MenuLinkSubProps,
        };

        onUpdateParentLinkHandler(newLink);
      } else {
        const newLink: MenuLink = {
          ...currentLink,
          links: newSubLinks,
        };

        onUpdateParentLinkHandler(newLink);
      }
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler]
  );

  const onAddSubLinkHandler = React.useCallback(
    (navLink: MenuLink) => {
      const newSubLinks = [...currentSubLinks, navLink];
      const newLink: MenuLink = { ...currentLink, links: newSubLinks };
      onUpdateParentLinkHandler(newLink);
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler]
  );

  const onEditSubLinkHandler = React.useCallback(
    (navLink: MenuLink) => {
      const newSubLinks = currentSubLinks.map((subLink) => {
        if (subLink.id === pickedSubLinkId) {
          return navLink;
        } else {
          return subLink;
        }
      });
      const newLink: MenuLink = { ...currentLink, links: newSubLinks };
      onUpdateParentLinkHandler(newLink);
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler, pickedSubLinkId]
  );

  const onRemoveSubLinkHandler = React.useCallback(
    (id: string) => {
      const newSubLinks = currentSubLinks.filter(
        (subLink) => subLink.id !== id
      );
      const newLink: MenuLink = { ...currentLink, links: newSubLinks };
      onUpdateParentLinkHandler(newLink);
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler]
  );

  return {
    isSubLinksOpen,
    onSubLinksOpen,
    onSubLinksClose,
    pickedSubLinkData,
    setPickedSubLinkId,
    onUpdateLinkHandler,
    onAddSubLinkHandler,
    onEditSubLinkHandler,
    onRemoveSubLinkHandler,
  };
};
