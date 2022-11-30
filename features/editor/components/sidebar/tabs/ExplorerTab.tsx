import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";

import { ExplorerItem } from "../helpers";
import { SidebarSection } from "../Section";

interface Props {
  isWidgetsOpen: boolean;
  toggleWidget: () => void;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  draggables: Draggable[];
}

export const ExplorerTab = React.memo(function ExplorerTab({
  isWidgetsOpen,
  toggleWidget,
  setTab,
  draggables,
}: Props) {
  return (
    <Stack width="100%">
      <SidebarSection
        isOpen={isWidgetsOpen}
        onToggleExpand={toggleWidget}
        title="Widgets"
        onAdd={() => setTab("widgets")}
      >
        <Stack
          sx={{
            height: !isWidgetsOpen ? "0px" : "fit-content",
            overflowY: "hidden",
            transition: "150ms ease",
          }}
        >
          {draggables
            .filter((draggable) => !draggable.containerId)
            .map((item) => {
              return <ExplorerItem item={item} key={item.id} />;
            })}

          <Stack
            onClick={() => setTab("widgets")}
            direction="row"
            alignItems="center"
            padding="12px 24px"
            sx={{
              cursor: "pointer",
              "&:hover": {
                background: "rgba(0,0,0,.05)",
              },
              transition: "150ms linear",
            }}
          >
            <AddIcon sx={{ color: "#687076", marginRight: "8px" }} />
            <Typography sx={{ flex: 1, color: "#687076", fontSize: "12px" }}>
              ADD WIDGET
            </Typography>
          </Stack>
        </Stack>
      </SidebarSection>
    </Stack>
  );
});
