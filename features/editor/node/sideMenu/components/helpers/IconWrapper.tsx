import Box from "@mui/material/Box";
import * as React from "react";

interface Props extends React.PropsWithChildren {
  isActive: boolean;
  onClick: () => void;
}

export const IconWrapper = React.memo(function IconWrapper({
  isActive,
  onClick,
  children,
}: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,

        border: "1px solid rgba(19, 15, 64, .25)",
        backgroundColor: isActive ? "rgb(19, 15, 64)" : "transparent",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
});
