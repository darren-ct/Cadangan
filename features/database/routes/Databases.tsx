import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { ExplorerSidebar } from "@/features/explorer";

export const Databases = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
      }}
    >
      <ExplorerSidebar />
      <main style={{ flexGrow: 1, overflow: "auto" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography> No Database found</Typography>
        </Box>
      </main>
    </Box>
  );
};
