import * as React from "react";

import type { NavLink, NavLinkSubProps } from "@/features/editor";
import { useDisclose } from "@/hooks";

interface Props {
  currentLink: NavLink;
  onUpdateParentLinkHandler: (navLink: NavLink) => void;
}

export const useNavLinkBar = ({
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
    (navLink: NavLink) => {
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
        const newLink: NavLink = {
          ...currentLink,
          links: newSubLinks,
          iconName: "down-arrow",
          subProps: {
            ...currentLink.subProps,
            labelPosition: "right-left",
          } as NavLinkSubProps,
        };

        onUpdateParentLinkHandler(newLink);
      } else {
        const newLink: NavLink = {
          ...currentLink,
          links: newSubLinks,
        };

        onUpdateParentLinkHandler(newLink);
      }
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler]
  );

  const onAddSubLinkHandler = React.useCallback(
    (navLink: NavLink) => {
      const newSubLinks = [...currentSubLinks, navLink];
      const newLink: NavLink = { ...currentLink, links: newSubLinks };
      onUpdateParentLinkHandler(newLink);
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler]
  );

  const onEditSubLinkHandler = React.useCallback(
    (navLink: NavLink) => {
      const newSubLinks = currentSubLinks.map((subLink) => {
        if (subLink.id === pickedSubLinkId) {
          return navLink;
        } else {
          return subLink;
        }
      });
      const newLink: NavLink = { ...currentLink, links: newSubLinks };
      onUpdateParentLinkHandler(newLink);
    },
    [currentLink, currentSubLinks, onUpdateParentLinkHandler, pickedSubLinkId]
  );

  const onRemoveSubLinkHandler = React.useCallback(
    (id: string) => {
      const newSubLinks = currentSubLinks.filter(
        (subLink) => subLink.id !== id
      );
      const newLink: NavLink = { ...currentLink, links: newSubLinks };
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
