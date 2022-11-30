import * as React from "react";

import type { ContainerProps, Draggable } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useContainerSubMenu = (item: Draggable) => {
  const { updateDraggable } = useEditorDraggableStore();
  const { isOpen: isChildrenItemsOpen, onToggle: onChildrenItemsToggle } =
    useDisclose();

  const itemProps = React.useMemo(() => {
    return item.props as ContainerProps;
  }, [item.props]);

  // Functions
  const onHideToggle = React.useCallback(
    (item: Draggable) => {
      const isHidden = item.isHidden;

      updateDraggable(item.id, { ...item, isHidden: !isHidden });
    },
    [updateDraggable]
  );

  return {
    itemProps,
    isChildrenItemsOpen,
    onChildrenItemsToggle,
    onHideToggle,
  };
};
