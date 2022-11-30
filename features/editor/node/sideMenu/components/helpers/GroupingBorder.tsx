import Box from "@mui/material/Box";
import * as React from "react";

export const GroupingBorder = React.memo(function GroupingBorder() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "1px",
        backgroundColor: "rgba(0,0,0,.1)",
        marginY: 2.7,
      }}
    ></Box>
  );
});
