import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { ChevronDownIcon } from "@/assets/icons";
import { useEditorDraggableStore } from "@/features/editor";

import { Sidebar } from "../sidebar";
import { Main } from "./Main";
import { PropsBar } from "./PropsBar";

export const Editor = React.memo(function Editor() {
  const { activeId, setActiveId } = useEditorDraggableStore();

  return (
    <Stack direction="row" height="100vh">
      <Sidebar />
      <Main />
      <PropsBar />

      {/* Open/Close Button */}
      <Box
        onClick={() => {
          setActiveId(null);
        }}
        sx={{
          cursor: "pointer",
          position: "fixed",
          zIndex: 102,
          bottom: "50%",
          right: "250px",
          transform: `translateX(${activeId ? -8 : 280}px)`,
          backgroundColor: "#130F40",
          width: "24px",
          height: "24px",
          borderRadius: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "200ms linear",
        }}
      >
        <ChevronDownIcon sx={{ transform: "rotate(270deg)", color: "white" }} />
      </Box>
    </Stack>
  );
});
