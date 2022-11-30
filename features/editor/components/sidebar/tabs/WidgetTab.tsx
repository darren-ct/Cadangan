import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { SearchIcon } from "@/assets/icons";
import type { DraggableTypes } from "@/features/editor";
import { IconDisplay } from "@/features/editor";

interface Props {
  filteredWidgets: DraggableTypes[];
  handleActiveDraggableChange: (
    e: React.DragEvent<HTMLElement>,
    type: DraggableTypes
  ) => void;
  onWidgetSearchHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WidgetTab = React.memo(function WidgetTab({
  handleActiveDraggableChange,
  filteredWidgets,
  onWidgetSearchHandler,
}: Props) {
  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          position: "relative",
          padding: "4px 28px",
          backgroundColor: "#F4F6F8",
        }}
      >
        <SearchIcon
          sx={{
            marginRight: "12px",
            color: "#130F40",
            fontSize: 12,
          }}
        />
        <input
          placeholder="Search Widgets"
          style={{
            fontSize: "12px",
            flex: 1,
            padding: "8px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#130F40",
          }}
          onChange={onWidgetSearchHandler}
        />
      </Stack>
      <Box
        sx={{
          marginTop: "12px",
          paddingX: "24px",
          color: "rgba(0,0,0,.4)",
          fontSize: "12px",
        }}
      >
        Drag a widget and drop it on the canvas
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: "12px",
          width: "fullWidth",
          padding: "12px",
        }}
      >
        {filteredWidgets.map((widget) => (
          <div
            key={widget}
            draggable={true}
            unselectable="on"
            className="droppable-element"
            onDragStart={(e) => handleActiveDraggableChange(e, widget)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              padding: "12px 10px",
            }}
          >
            <IconDisplay name={widget} />
            <Typography
              sx={{
                color: "#687076",
                fontWeight: 500,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {widget}
            </Typography>
          </div>
        ))}
      </Box>
    </Stack>
  );
});
