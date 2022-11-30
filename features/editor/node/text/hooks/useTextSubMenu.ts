import * as React from "react";

import type { ClassicSubProps, Draggable, TextProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";

export const useTextSubMenu = (item: Draggable) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const itemProps = React.useMemo(() => {
    if (item.props) {
      return item.props as TextProps;
    }

    return null;
  }, [item]);

  // States
  const { isOpen: isPaletteOpen, onToggle: onPaletteToggle } =
    useDisclose(false);
  const { isOpen: isActionsOpen, onToggle: onActionsToggle } =
    useDisclose(false);
  const { isOpen: isStylesOpen, onToggle: onStylesToggle } = useDisclose(false);

  const [activeDropdown, setActiveDropDown] = React.useState<string | null>(
    null
  );

  // Others
  const onDropdownToggle = React.useCallback(
    (id: string) => {
      if (activeDropdown === id) {
        setActiveDropDown(null);
      } else {
        setActiveDropDown(id);
      }
    },
    [setActiveDropDown, activeDropdown]
  );

  // useEffect
  React.useEffect(() => {
    if (item.props) {
      return;
    }

    updateDraggableProps(item.id, "content", [
      {
        id: Date.now().toString(),
        type: "CLASSIC",
        subProps: {
          text: "MY TEXT",
        } as ClassicSubProps,
      },
    ]);
  }, [updateDraggableProps, item.props, item.id]);

  return {
    onActionsToggle,
    isActionsOpen,
    isStylesOpen,
    onStylesToggle,
    activeDropdown,
    onDropdownToggle,
    isPaletteOpen,
    onPaletteToggle,
    itemProps,
  };
};
