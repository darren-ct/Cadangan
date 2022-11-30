import * as React from "react";

import type { Draggable, TextContent, TextInputProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  item: Draggable;
}

export const useTextInput = ({ item }: Props) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const { anchorEl, onClosePopover, onOpenPopover } = usePopover();

  const itemProps = React.useMemo(() => {
    return item.props as TextInputProps;
  }, [item.props]);

  // MagicText Related
  const onAddTextContent = React.useCallback(
    (newTextContent: TextContent) => {
      updateDraggableProps(
        item.id,
        "defaultValue",
        itemProps?.defaultValue
          ? [...itemProps.defaultValue, newTextContent as TextContent]
          : [newTextContent as TextContent]
      );
    },
    [updateDraggableProps, item.id, itemProps?.defaultValue]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string, id: string) => {
      const oldDefaultValue = itemProps?.defaultValue ?? [];
      const newDefaultValue = oldDefaultValue.map((item) => {
        if (item.id === id) {
          return { ...item, subProps: { text: newText } };
        } else {
          return item;
        }
      });

      updateDraggableProps(item.id, "defaultValue", newDefaultValue);
    },
    [item.id, itemProps?.defaultValue, updateDraggableProps]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      const oldDefaultValue = itemProps?.defaultValue ?? [];
      const newDefaultValue = oldDefaultValue.filter((item) => item.id !== id);

      updateDraggableProps(item.id, "defaultValue", newDefaultValue);
    },
    [item.id, itemProps?.defaultValue, updateDraggableProps]
  );

  return {
    itemProps,
    anchorEl,
    onClosePopover,
    onOpenPopover,
    onAddTextContent,
    onClassicTextContentChange,
    onDeleteTextContent,
    updateDraggableProps,
  };
};
