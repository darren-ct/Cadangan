import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { EditIcon } from "@/assets/icons";

import { PreviewItem } from "../../elements";
import { usePreview } from "../../hooks";

export const Preview = React.memo(function Preview() {
  const {
    defaultLayouts,
    draggables: items,
    navigateToEditor,
    // loggedUser,
    actionLoading,
  } = usePreview();

  if (actionLoading) return <>Loading...</>;

  return (
    <Box sx={{ marginX: "auto", width: "100%", maxWidth: "115.625rem" }}>
      {/* {JSON.stringify(loggedUser)} */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(24, 1fr)",
          gridTemplateRows: "repeat(200 , 10px)",
          gap: 2,
          py: 2,
        }}
      >
        {defaultLayouts?.sm.map((layout) => (
          <Box
            key={layout.i}
            sx={{
              gridColumn: `${layout.x + 1} / span ${layout.w}`,
              gridRow: `${layout.y + 1} / span ${layout.h}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <PreviewItem items={items} id={layout.i} />
          </Box>
        ))}
      </Box>

      {/* Navigate to Edit Button */}
      <Box
        onClick={navigateToEditor}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "100vh",
          backgroundColor: "#11181C",
          position: "fixed",
          right: "12px",
          bottom: "12px",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.1)",
          },
          transition: "200ms ease",
        }}
      >
        <EditIcon sx={{ color: "white" }} />
      </Box>

      {/* Mark */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,.4)",
          position: "fixed",
          bottom: "12px",
          left: "12px",
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography sx={{ color: "white", fontSize: 12 }}>
          Right now, you are on preview mode
        </Typography>
      </Box>
    </Box>
  );
});
