import * as React from "react";

import type { ButtonProps, Draggable } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose, usePopover } from "@/hooks";

export const useButtonSubMenu = (item: Draggable) => {
  const { updateDraggable } = useEditorDraggableStore();
  const { isOpen: isIconsOpen, onToggle: onIconsToggle } = useDisclose(false);

  const itemProps = React.useMemo(() => {
    if (item.props) {
      return item.props as ButtonProps;
    }

    return null;
  }, [item]);

  // Actions
  const {
    anchorEl: actionAnchorEl,
    onClosePopover: onCloseActionsPopOver,
    onOpenPopover: onOpenActionsPopOver,
  } = usePopover();

  // DEFAULT VALUE
  React.useEffect(() => {
    if (itemProps.type) {
      return;
    }

    updateDraggable(item.id, {
      ...item,
      props: {
        type: "contained",
        content: [
          {
            id: Date.now().toString(),
            type: "CLASSIC",
            subProps: {
              text: "BUTTON",
            },
          },
        ],
        icon: null,
        buttonColor: "#FFA500",
        contentColor: "#FFFFFF",
        rounding: 0,
        isShadow: false,
        isUppercase: false,
        actions: null,
      } as ButtonProps,
    });
  }, [itemProps, item.id, item.props, updateDraggable, item]);

  return {
    isIconsOpen,
    onIconsToggle,
    actionAnchorEl,
    onOpenActionsPopOver,
    onCloseActionsPopOver,
    itemProps,
  };
};
