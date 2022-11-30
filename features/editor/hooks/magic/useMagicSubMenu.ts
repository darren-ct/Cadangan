import * as React from "react";

import type {
  ButtonProps,
  Draggable,
  TextContent,
  TextProps,
} from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { usePopover } from "@/hooks";

interface Props {
  item: Draggable;
}

export const useMagicSubMenu = ({ item }: Props) => {
  const { updateDraggableProps } = useEditorDraggableStore();
  const {
    anchorEl: magicAnchorEl,
    onClosePopover: onCloseMagicTextPopOver,
    onOpenPopover: onOpenMagicTextPopOver,
  } = usePopover();

  //   Memos and Ref
  const itemProps = React.useMemo(() => {
    if (item.props) {
      return item.props as ButtonProps | TextProps;
    }

    return null;
  }, [item]);

  //   Functions
  const onAddTextContent = React.useCallback(
    (newTextContent: TextContent | Record<string, unknown>) => {
      updateDraggableProps(
        item.id,
        "content",
        (itemProps?.content
          ? [...itemProps.content, newTextContent]
          : [newTextContent]) as TextContent[]
      );
    },

    [item.id, itemProps?.content, updateDraggableProps]
  );

  const onClassicTextContentChange = React.useCallback(
    (newText: string | number, id: string) => {
      updateDraggableProps(
        item.id,
        "content",
        itemProps.content.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              subProps: {
                text: newText,
              },
            };
          } else {
            return item;
          }
        })
      );
    },
    [item.id, itemProps?.content, updateDraggableProps]
  );

  const onDeleteTextContent = React.useCallback(
    (id: string) => {
      updateDraggableProps(
        item.id,
        "content",
        itemProps.content.filter((item) => item.id !== id)
      );
    },
    [item.id, itemProps?.content, updateDraggableProps]
  );

  return {
    magicAnchorEl,
    onCloseMagicTextPopOver,
    onOpenMagicTextPopOver,
    onAddTextContent,
    onClassicTextContentChange,
    onDeleteTextContent,
  };
};
