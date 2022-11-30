import * as React from "react";

import type { Draggable, MenuLink, SideMenuProps } from "@/features/editor";
import { useMagicResult, useNodeAction } from "@/features/editor";
import { useDisclose } from "@/hooks";

interface Props {
  menuLink: MenuLink;
  item: Draggable;
}

export const useSideMenuItem = ({ item, menuLink }: Props) => {
  const { stringifiedOutput } = useMagicResult(menuLink.text);
  const { handleSubmit } = useNodeAction({
    actions: menuLink.actions ?? [],
    item,
  });

  const { isOpen: isDropdownOpen, onToggle: onDropdownToggle } = useDisclose();

  // Memoized Props
  const itemProps = item.props as SideMenuProps;

  const labelPosition = React.useMemo(() => {
    return menuLink.subProps?.labelPosition ?? "left-right";
  }, [menuLink.subProps?.labelPosition]);

  // Functions
  const onClickHandler = React.useCallback(() => {
    if (menuLink.links && menuLink.links.length > 0) {
      return onDropdownToggle();
    }

    handleSubmit();
  }, [handleSubmit, menuLink.links, onDropdownToggle]);

  return {
    itemProps,
    labelPosition,
    stringifiedOutput,
    isDropdownOpen,
    onClickHandler,
  };
};
