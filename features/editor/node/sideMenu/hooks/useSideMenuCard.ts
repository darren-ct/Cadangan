import * as React from "react";

import type {
  Action,
  ClassicSubProps,
  MenuLink,
  SideMenuProps,
  TextContent,
} from "@/features/editor";
import {
  dummyMenuLink,
  useMagicTextAction,
  useSubMenuAction,
} from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  onClose: () => void;
  onSubmit: (value: MenuLink) => void;
  onEditData?: MenuLink;
  itemProps: SideMenuProps;
}

export const useSideMenuCard = ({
  onClose,
  onSubmit,
  onEditData,
  itemProps,
}: Props) => {
  // Main Datas
  const menuLinkData = React.useMemo(() => {
    return (
      onEditData ??
      ({
        ...dummyMenuLink,
        subProps: { color: itemProps.linkColor ?? "black" },
        buttonProps: { buttonType: "contained" },
        id: Date.now().toString(),
      } as MenuLink)
    );
  }, [itemProps.linkColor, onEditData]);

  const topRef = React.useRef(null);
  const bottomRef = React.useRef(null);

  //   Hooks
  const { actions: magicActions } = useMagicTextAction(menuLinkData);
  const { actions } = useSubMenuAction(menuLinkData);

  const {
    anchorEl: iconsAnchorEl,
    onOpenPopover: onIconsOpen,
    onClosePopover: onIconsClose,
  } = usePopover();

  const {
    anchorEl: actionsAnchorEl,
    onOpenPopover: onActionsOpen,
    onClosePopover: onActionsClose,
  } = usePopover();

  const {
    anchorEl: magicAnchorEl,
    onOpenPopover: onMagicOpen,
    onClosePopover: onMagicClose,
  } = usePopover();

  //   Base Functions
  const onSubmitHandler = React.useCallback(
    (menuLink: MenuLink) => {
      onSubmit(menuLink);
    },
    [onSubmit]
  );

  const updateMenuLinkProps = React.useCallback(
    (name: string, body: unknown) => {
      const newMenuLink = { ...menuLinkData };

      newMenuLink[name] = body;
      onSubmitHandler(newMenuLink);
    },
    [menuLinkData, onSubmitHandler]
  );

  const updateMenuLinkSubProps = React.useCallback(
    (name: string, body: unknown) => {
      const newMenuLink = { ...menuLinkData };

      if (!newMenuLink.subProps) {
        newMenuLink.subProps = {};
      }

      newMenuLink.subProps[name] = body;
      onSubmitHandler(newMenuLink);
    },
    [menuLinkData, onSubmitHandler]
  );

  const updateMenuLinkButtonProps = React.useCallback(
    (name: string, body: unknown) => {
      const newMenuLink = { ...menuLinkData };

      newMenuLink.buttonProps[name] = body;
      onSubmitHandler(newMenuLink);
    },
    [menuLinkData, onSubmitHandler]
  );

  //   Magic-Text Functions
  const onAddTextContent = React.useCallback(
    (newContent: TextContent) => {
      updateMenuLinkProps("text", [...menuLinkData.text, newContent]);
    },
    [menuLinkData.text, updateMenuLinkProps]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string | number, id: string) => {
      updateMenuLinkProps(
        "text",
        menuLinkData.text.map((content) => {
          if (content.id === id) {
            return {
              ...content,
              subProps: {
                text: newText,
              } as ClassicSubProps,
            };
          } else {
            return content;
          }
        })
      );
    },
    [menuLinkData.text, updateMenuLinkProps]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      const currentContents = menuLinkData.text;

      const toBeEditedId = currentContents.findIndex(
        (content) => content.id === id
      );
      currentContents.splice(toBeEditedId, 1);

      updateMenuLinkProps("text", currentContents);
    },
    [menuLinkData.text, updateMenuLinkProps]
  );

  // Action Functions
  const onActionsSelect = React.useCallback(
    (action: Action) => {
      updateMenuLinkProps("actions", [...(menuLinkData.actions ?? []), action]);
    },
    [menuLinkData.actions, updateMenuLinkProps]
  );

  // useEffect
  React.useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return {
    bottomRef,
    topRef,
    menuLinkData,
    updateMenuLinkProps,
    updateMenuLinkSubProps,
    updateMenuLinkButtonProps,
    magicActions,
    onAddTextContent,
    onClassicTextContentChange,
    onDeleteTextContent,
    magicAnchorEl,
    onMagicOpen,
    onMagicClose,
    iconsAnchorEl,
    onIconsOpen,
    onIconsClose,
    actions,
    actionsAnchorEl,
    onActionsOpen,
    onActionsClose,
    onActionsSelect,
    onSubmitHandler,
    onClose,
  };
};
