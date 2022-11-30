import { SxProps, Theme } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon } from "@/assets/icons";

interface Props extends React.PropsWithChildren {
  title: string;
  onToggle?: () => void;
  isOpen: boolean;
  sx?: SxProps<Theme>;
}

export const SubMenuSection = React.memo(function SubMenuSection({
  title,
  onToggle,
  isOpen,
  children,
  sx = {},
}: Props) {
  return (
    <React.Fragment>
      <Stack
        direction="row"
        paddingX="12px"
        paddingY="16px"
        sx={{
          cursor: "pointer",
          transition: "150ms ease",
          borderTop: "1px solid #F2F2F2",
          "&:hover": {
            background: "rgba(0,0,0,.05)",
          },
        }}
        onClick={onToggle}
      >
        <Typography
          sx={{ flex: 1, color: "#130F40", fontWeight: 500, fontSize: 12 }}
        >
          {title}
        </Typography>
        <ChevronDownIcon
          sx={{
            marginRight: "12px",
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            color: "#130F40",
            fontSize: "16px",
          }}
        />
      </Stack>
      <Stack
        direction="column"
        sx={{
          display: !isOpen ? "none" : undefined,
          px: "12px",
          py: "16px",
          ...sx,
        }}
      >
        {children}
      </Stack>
    </React.Fragment>
  );
});
