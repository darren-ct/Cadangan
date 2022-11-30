import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon, ChevronDownFilled } from "@/assets/icons";

interface Props extends React.PropsWithChildren {
  isOpen: boolean;
  onToggleExpand: () => void;
  onAdd?: () => void;
  title?: string;
}

export const SidebarSection = React.memo(function SidebarSection({
  isOpen,
  onToggleExpand,
  onAdd,
  title,
  children,
}: Props) {
  return (
    <>
      <Stack
        onClick={onToggleExpand}
        direction="row"
        alignItems="center"
        sx={{
          width: "100%",
          paddingY: "10px",
          paddingX: "12px",
          borderBottom: isOpen ? "1px solid #F2F2F2" : "transparent",
          cursor: "pointer",
          "&:hover": {
            background: "rgba(0,0,0,.05)",
          },
          transition: "150ms ease",
        }}
      >
        <ChevronDownFilled
          sx={{
            color: "#130F40",
            transform: !isOpen ? "rotate(270deg)" : "rotate(0deg)",
            marginRight: "4px",
            fontSize: "12px",
          }}
        />
        <Typography
          sx={{
            color: "#130F40",
            flex: 1,
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        {onAdd && (
          <IconButton
            sx={{ color: "#130F40" }}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
          >
            <AddIcon sx={{ fontSize: "14px" }} />
          </IconButton>
        )}
      </Stack>
      <Stack
        direction="column"
        sx={{ display: !isOpen ? "none" : undefined, width: "100%", py: 1 }}
      >
        {children}
      </Stack>
    </>
  );
});
