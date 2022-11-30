import Box from "@mui/material/Box";
import * as React from "react";

import type { Draggable } from "@/features/editor";

interface Props extends React.PropsWithChildren {
  item: Draggable;
}

export const FixedLayoutWrapper = React.memo(function FixedLayoutWrapper({
  item,
  children,
}: Props) {
  const navRef = React.useRef(null);

  // useEffect
  React.useEffect(() => {
    navRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Box
      ref={item.type === "nav" ? navRef : null}
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: item.type === "nav" ? "100%" : "200px",
        height: item.type === "sideMenu" ? "640px" : "min-content",
        zIndex: 40,
        overflowY: item.type === "nav" ? "hidden" : "scroll",
        scrollbarWidth: "none",
      }}
    >
      {children}
    </Box>
  );
});
