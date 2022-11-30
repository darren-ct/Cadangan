import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { EyeOffIcon, EyeOnIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

import { TabLinkMemberTrail } from "./TabLinkMemberTrail";

interface Props {
  draggable: Draggable;
  isFirstChild: boolean;
}

export const TabLinkMember = React.memo(function TabLinkMember({
  draggable,
  isFirstChild,
}: Props) {
  const { setActiveId, updateDraggable } = useEditorDraggableStore();

  const onHideToggle = React.useCallback(
    (item: Draggable) => {
      const isHidden = item.isHidden;

      updateDraggable(item.id, { ...item, isHidden: !isHidden });
    },
    [updateDraggable]
  );

  return (
    <Stack
      position="relative"
      direction="row"
      key={draggable.id}
      sx={{
        cursor: "pointer",
        borderRadius: 1,
        paddingY: "8px",
        paddingX: "10px",
        backgroundColor: "rgba(0,0,0,.05)",
        "&:hover": {
          backgroundColor: "rgba(0,0,0,.1)",
        },
      }}
      onClick={() => {
        setActiveId(draggable.id);
      }}
    >
      <TabLinkMemberTrail isFirstChild={isFirstChild} />
      <Stack flex={1} direction="column">
        <Typography sx={{ color: "rgba(0,0,0,.6)", fontSize: "11px" }}>
          {draggable.type}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
          {draggable.name}
        </Typography>
      </Stack>

      <IconButton
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onHideToggle(draggable);
        }}
      >
        {!draggable.isHidden ? (
          <EyeOnIcon sx={{ color: "rgba(0,0,0,.75)", fontSize: "18px" }} />
        ) : (
          <EyeOffIcon sx={{ color: "rgba(0,0,0,.75)", fontSize: "18px" }} />
        )}
      </IconButton>
    </Stack>
  );
});
