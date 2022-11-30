import * as React from "react";

import type { ClassicSubProps, TabLink, TextContent } from "@/features/editor";
import { useMagicTextAction } from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  tabLinkData: TabLink;
  onEditTabLink?: (tabLink: TabLink) => void;
}

export const useTabContainerCard = ({ tabLinkData, onEditTabLink }: Props) => {
  const { actions: magicActions } = useMagicTextAction();
  const {
    anchorEl: magicAnchorEl,
    onClosePopover: onCloseMagicPopover,
    onOpenPopover: onOpenMagicPopover,
  } = usePopover();

  const {
    anchorEl: iconsAnchorEl,
    onClosePopover: onIconsClose,
    onOpenPopover: onIconsOpen,
  } = usePopover();

  const updateTabContainerLink = React.useCallback(
    (name: string, body: unknown) => {
      const newTabContainerLink = { ...tabLinkData };
      newTabContainerLink[name] = body;

      onEditTabLink(newTabContainerLink);
    },
    [onEditTabLink, tabLinkData]
  );

  //   Functions
  const onAddTextContent = React.useCallback(
    (newContent: TextContent) => {
      const currentTextContents = [...(tabLinkData.text ?? []), newContent];
      updateTabContainerLink("text", currentTextContents);
    },
    [tabLinkData.text, updateTabContainerLink]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string | number, id: string) => {
      const currentTextContents = (tabLinkData.text ?? []).map(
        (textContent) => {
          if (textContent.id === id) {
            return {
              ...textContent,
              subProps: { text: newText } as ClassicSubProps,
            };
          } else {
            return textContent;
          }
        }
      );

      updateTabContainerLink("text", currentTextContents);
    },
    [tabLinkData.text, updateTabContainerLink]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      const currentTextContents = [...(tabLinkData.text ?? [])];
      const toBeDeletedIndex = currentTextContents.findIndex(
        (textContent) => textContent.id === id
      );

      currentTextContents.splice(toBeDeletedIndex, 1);

      updateTabContainerLink("text", currentTextContents);
    },
    [tabLinkData.text, updateTabContainerLink]
  );

  return {
    magicActions,
    iconsAnchorEl,
    onIconsClose,
    onIconsOpen,
    magicAnchorEl,
    onCloseMagicPopover,
    onOpenMagicPopover,
    onAddTextContent,
    onClassicTextContentChange,
    onDeleteTextContent,
    updateTabContainerLink,
  };
};
