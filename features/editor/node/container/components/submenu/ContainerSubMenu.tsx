import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { EyeOffIcon, EyeOnIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";
import {
  SubMenuSection,
  useContainerSubMenu,
  useEditorDraggableStore,
} from "@/features/editor";

interface Props {
  item: Draggable;
}

export const ContainerSubMenu = React.memo(function ContainerSubMenu({
  item,
}: Props) {
  const { draggables, setActiveId } = useEditorDraggableStore();

  const { isChildrenItemsOpen, onChildrenItemsToggle, onHideToggle } =
    useContainerSubMenu(item);

  return (
    <Stack direction="column" paddingY={1.5}>
      {/* Components */}
      <SubMenuSection
        title="Components"
        onToggle={onChildrenItemsToggle}
        isOpen={isChildrenItemsOpen}
      >
        <Stack direction="column" spacing={1}>
          {!draggables ||
            (draggables.filter((draggable) => draggable.containerId === item.id)
              ?.length === 0 && (
              <Typography
                sx={{
                  marginY: 2,
                  textAlign: "center",
                  color: "#828282",
                  fontSize: 12,
                }}
              >
                No item yet...
              </Typography>
            ))}
          {draggables
            .filter((draggable) => draggable.containerId === item.id)
            .map((draggable) => (
              <Stack
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
                <Stack flex={1} direction="column">
                  <Typography
                    sx={{ color: "rgba(0,0,0,.6)", fontSize: "11px" }}
                  >
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
                    <EyeOnIcon
                      sx={{ color: "rgba(0,0,0,.75)", fontSize: "18px" }}
                    />
                  ) : (
                    <EyeOffIcon
                      sx={{ color: "rgba(0,0,0,.75)", fontSize: "18px" }}
                    />
                  )}
                </IconButton>
              </Stack>
            ))}
        </Stack>
      </SubMenuSection>
    </Stack>
  );
});
