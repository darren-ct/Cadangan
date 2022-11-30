import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";
import { IconDisplay, useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";

interface Props {
  item: Draggable;
}

export const ExplorerItem = React.memo(function ExplorerItem({ item }: Props) {
  const { draggables, activeId, setActiveId } = useEditorDraggableStore();
  const { isOpen: isExplorerItemOpen, onToggle: onExplorerItemToggle } =
    useDisclose();

  const childrenDraggables = React.useMemo(() => {
    return (
      draggables?.filter((draggable) => draggable.containerId === item.id) ?? []
    );
  }, [draggables, item.id]);

  const onClickHandler = React.useCallback(() => {
    setActiveId(item.id);
    onExplorerItemToggle();
  }, [item.id, onExplorerItemToggle, setActiveId]);

  return (
    <React.Fragment>
      <Stack
        onClick={onClickHandler}
        direction="row"
        alignItems="center"
        key={item.id}
        padding="12px 24px"
        sx={{
          cursor: "pointer",
          backgroundColor:
            item?.id === activeId ? "rgba(0,0,0,.05)" : "transparent",
          "&:hover": {
            background: "rgba(0,0,0,.05)",
          },
          transition: "150ms linear",
        }}
      >
        {childrenDraggables.length > 0 && (
          <ChevronDownIcon
            sx={{
              color: "#687076",
              marginRight: 1,
              transform: `rotate(${isExplorerItemOpen ? 0 : 270}deg)`,
            }}
          />
        )}
        <IconDisplay name={item.name.split(" ")[0]} />
        <Typography
          sx={{
            marginLeft: 1,
            flex: 1,
            color: "#687076",
            fontSize: "12px",
          }}
        >
          {item.name}
        </Typography>
      </Stack>
      {isExplorerItemOpen && (
        <Stack direction="column" marginLeft={3}>
          {childrenDraggables.map((draggable) => (
            <ExplorerItem item={draggable} />
          ))}
        </Stack>
      )}
    </React.Fragment>
  );
});
