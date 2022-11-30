import Box from "@mui/material/Box";
import * as React from "react";

interface Props {
  isFirstChild: boolean;
}

export const TabLinkMemberTrail = React.memo(function TabLinkMemberTrail({
  isFirstChild,
}: Props) {
  return (
    <React.Fragment>
      <Box
        position="absolute"
        right="calc(100% + 20px)"
        top={isFirstChild ? "-16px" : "-36px"}
        sx={{
          width: "1px",
          height: isFirstChild ? "calc(100% - 10px)" : "calc(100% + 12px)",
          background: "rgba(0,0,0,.15)",
        }}
      ></Box>
      <Box
        position="absolute"
        right="100%"
        top="24px"
        sx={{
          width: "20px",
          height: "1px",
          transform: "translateY(50%)",
          background: "rgba(0,0,0,.15)",
        }}
      ></Box>
    </React.Fragment>
  );
});
