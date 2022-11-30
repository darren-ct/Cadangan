import * as React from "react";

import type {
  Action,
  ClassicSubProps,
  NavLink,
  NavProps,
  TextContent,
} from "@/features/editor";
import {
  dummyNavLink,
  useMagicTextAction,
  useSubMenuAction,
} from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  onClose: () => void;
  onSubmit: (value: NavLink) => void;
  onEditData?: NavLink;
  itemProps: NavProps;
}

export const useNavCard = ({
  onClose,
  onSubmit,
  onEditData,
  itemProps,
}: Props) => {
  // Main Data
  const navLinkData = React.useMemo(() => {
    return (
      onEditData ??
      ({
        ...dummyNavLink,
        subProps: { color: itemProps.linkColor ?? "black" },
        buttonProps: { buttonType: "contained" },
        id: Date.now().toString(),
      } as NavLink)
    );
  }, [itemProps.linkColor, onEditData]);

  const topRef = React.useRef(null);
  const bottomRef = React.useRef(null);

  //   Hooks
  const { actions: magicActions } = useMagicTextAction(navLinkData);
  const { actions } = useSubMenuAction(navLinkData);

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
    (navLink: NavLink) => {
      if (navLink.links && navLink.links.length > 0 && !navLink.iconName) {
        onSubmit({
          ...navLink,
          iconName: "down-arrow",
          subProps: { ...navLink?.subProps, labelPosition: "right-left" },
        });
      } else {
        onSubmit(navLink);
      }
    },
    [onSubmit]
  );

  const updateNavLinkProps = React.useCallback(
    (name: string, body: unknown) => {
      const newNavLink = { ...navLinkData };

      newNavLink[name] = body;
      onSubmitHandler(newNavLink);
    },
    [navLinkData, onSubmitHandler]
  );

  const updateNavLinkSubProps = React.useCallback(
    (name: string, body: unknown) => {
      const newNavLink = { ...navLinkData };

      newNavLink.subProps[name] = body;

      onSubmitHandler(newNavLink);
    },
    [navLinkData, onSubmitHandler]
  );

  const updateNavLinkButtonProps = React.useCallback(
    (name: string, body: unknown) => {
      const newNavLink = { ...navLinkData };

      newNavLink.buttonProps[name] = body;

      onSubmitHandler(newNavLink);
    },
    [navLinkData, onSubmitHandler]
  );

  const updateNavLinkAnimationProps = React.useCallback(
    (name: string, body: unknown) => {
      const newNavLink = { ...navLinkData };

      newNavLink.animationProps[name] = body;

      onSubmitHandler(newNavLink);
    },
    [navLinkData, onSubmitHandler]
  );

  //   Magic-Text Functions
  const onAddTextContent = React.useCallback(
    (newContent: TextContent) => {
      updateNavLinkProps("text", [...navLinkData.text, newContent]);
    },
    [navLinkData.text, updateNavLinkProps]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string | number, id: string) => {
      updateNavLinkProps(
        "text",
        navLinkData.text.map((content) => {
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
    [navLinkData.text, updateNavLinkProps]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      const currentContents = navLinkData.text;

      const toBeEditedId = currentContents.findIndex(
        (content) => content.id === id
      );
      currentContents.splice(toBeEditedId, 1);

      updateNavLinkProps("text", currentContents);
    },
    [navLinkData.text, updateNavLinkProps]
  );

  // Action Functions
  const onActionsSelect = React.useCallback(
    (action: Action) => {
      updateNavLinkProps("actions", [...(navLinkData.actions ?? []), action]);
    },
    [navLinkData.actions, updateNavLinkProps]
  );

  // useEffect
  React.useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return {
    bottomRef,
    topRef,
    navLinkData,
    updateNavLinkProps,
    updateNavLinkSubProps,
    updateNavLinkButtonProps,
    updateNavLinkAnimationProps,
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
