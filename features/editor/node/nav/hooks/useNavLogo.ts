import * as React from "react";

import type { Draggable, NavLink, NavProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

export const useNavLogo = (item: Draggable) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const [pickedLinkId, setPickedLinkId] = React.useState<string>("");

  const pickedLinkData = React.useMemo(() => {
    return pickedLinkId === (item.props as NavProps).navLogo?.id
      ? (item.props as NavProps).navLogo
      : null;
  }, [item.props, pickedLinkId]);

  // Functions
  const onUpdateChildLinkHandler = React.useCallback(
    (navLogo: NavLink) => {
      updateDraggableProps(item.id, "navLogo", navLogo);
    },
    [item.id, updateDraggableProps]
  );

  return {
    setPickedLinkId,
    pickedLinkData,
    onUpdateChildLinkHandler,
  };
};
