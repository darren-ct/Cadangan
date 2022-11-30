import * as React from "react";

import type { Draggable, NavLink, NavProps } from "@/features/editor";
import { useMagicResult, useNodeAction } from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  navLink: NavLink;
  item: Draggable;
}

export const useNavLinkItem = ({ item, navLink }: Props) => {
  const { stringifiedOutput } = useMagicResult(navLink.text);
  const { handleSubmit } = useNodeAction({
    actions: navLink.actions ?? [],
    item,
  });

  const { anchorEl, onClosePopover, onOpenPopover } = usePopover();

  // Memoized Props
  const itemProps = item.props as NavProps;

  const labelPosition = React.useMemo(() => {
    return navLink.subProps?.labelPosition ?? "left-right";
  }, [navLink.subProps?.labelPosition]);

  // Functions
  const onClickHandler = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (navLink.links && navLink.links.length > 0) {
        return onOpenPopover(e);
      }

      handleSubmit();
    },
    [handleSubmit, navLink.links, onOpenPopover]
  );

  return {
    itemProps,
    labelPosition,
    stringifiedOutput,
    anchorEl,
    onClosePopover,
    onClickHandler,
  };
};
