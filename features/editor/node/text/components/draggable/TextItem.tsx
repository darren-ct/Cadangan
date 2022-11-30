import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Draggable, TextContent, TextProps } from "@/features/editor";
import {
  MagicContainer,
  useEditorDraggableStore,
  useMagicResult,
  useMagicSubMenu,
} from "@/features/editor";

export const TextItem = React.memo(function TextItem({
  item,
}: {
  item: Draggable;
}) {
  const textProps = React.useMemo(() => {
    if (item.props) {
      return item.props as TextProps;
    }

    return null;
  }, [item]);

  const { activeId, updateDraggableProps } = useEditorDraggableStore();
  const { stringifiedOutput } = useMagicResult(textProps?.content);
  const { onDeleteTextContent, onAddTextContent, onClassicTextContentChange } =
    useMagicSubMenu({ item });

  // Memos
  const isActive = React.useMemo(() => {
    return activeId === item.id;
  }, [activeId, item.id]);

  const fontWeight = React.useMemo(() => {
    if (!textProps) {
      return 500;
    }

    if (!textProps.fontWeight && textProps?.type === "Title") {
      return 700;
    }

    if (!textProps.fontWeight && textProps?.type === "Subtitle") {
      return 600;
    }

    if (!textProps.fontWeight && textProps?.type === "Body") {
      return 500;
    }

    switch (textProps.fontWeight) {
      case "Light":
        return 300;

      case "Normal":
        return 400;

      case "Medium":
        return 500;

      case "Semi Bold":
        return 600;

      case "Bold":
        return 700;

      case "Extra Bold":
        return 800;

      case "Extra Black":
        return 900;
    }
  }, [textProps]);

  const fontSize = React.useMemo(() => {
    if (!textProps || !textProps.fontSize) {
      return 16;
    }

    if (!textProps.fontSize && textProps?.type === "Title") {
      return 32;
    }

    if (!textProps.fontSize && textProps?.type === "Subtitle") {
      return 24;
    }

    if (!textProps.fontSize && textProps?.type === "Body") {
      return 16;
    }

    return Number(textProps.fontSize);
  }, [textProps]);

  const textAlign = React.useMemo(() => {
    if (!textProps || !textProps.textAlign) {
      return "flex-start";
    }

    switch (textProps.textAlign) {
      case "Left":
        return "flex-start";

      case "Center":
        return "center";

      case "Right":
        return "flex-end";
    }
  }, [textProps]);

  React.useEffect(() => {
    if (!textProps.content) {
      const newContent: TextContent = {
        id: String(Date.now()),
        type: "CLASSIC",
        subProps: {
          text: "My Text",
        },
      };
      updateDraggableProps(item.id, "content", [newContent]);
    }
  }, [item.id, textProps.content, updateDraggableProps]);

  return (
    <Stack
      alignItems="center"
      justifyContent={textAlign}
      sx={{ width: "100%", fontWeight, fontSize }}
    >
      {!isActive && (
        <Typography
          sx={{
            width: "100%",
            textAlign,
            fontWeight,
            fontSize,
            color: textProps?.color ?? "black",
          }}
        >
          {stringifiedOutput}
        </Typography>
      )}
      {isActive && (
        <MagicContainer
          textContents={textProps?.content}
          onDeleteTextContent={onDeleteTextContent}
          onAddClassicTextContent={onAddTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
        />
      )}
    </Stack>
  );
});
