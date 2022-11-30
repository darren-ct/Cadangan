import Box from "@mui/material/Box";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable, NavLink } from "@/features/editor";

import { NavLinkItem } from "./NavLinkItem";

interface Props {
  item: Draggable;
  links: NavLink[];
  anchorEl: HTMLElement;
  onClose: () => void;
  isDisabled: boolean;
  isMainDropdown: boolean;
}

export const NavLinkMenu = React.memo(function NavLinkMenu({
  item,
  anchorEl,
  onClose,
  links,
  isDisabled,
  isMainDropdown,
}: Props) {
  // Position
  const anchorOrigin = React.useMemo(() => {
    if (isMainDropdown) {
      return { vertical: "bottom", horizontal: "center" };
    }

    return { vertical: "bottom", horizontal: "left" };
  }, [isMainDropdown]);

  const transformOrigin = React.useMemo(() => {
    if (isMainDropdown) {
      return { horizontal: "center", vertical: 0 };
    }

    return { vertical: "top", horizontal: "right" };
  }, [isMainDropdown]);

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={(e: React.ChangeEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClose();
      }}
      anchorOrigin={anchorOrigin as PopoverOrigin}
      transformOrigin={transformOrigin as PopoverOrigin}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      {isMainDropdown && (
        <Box
          sx={{
            zIndex: 2,
            position: "relative",
            mt: "10px",
            "&::before": {
              backgroundColor: "rgba(0,0,0,.1)",
              content: '""',
              display: "block",
              position: "absolute",
              width: 12,
              height: 12,
              top: -6,
              left: "calc(50% - 6px)",
              borderBottom: "1px solid white",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            },
          }}
        />
      )}
      <Stack
        position="relative"
        direction="column"
        sx={{
          borderTop: "1px solid rgba(0,0,0,.1)",
          borderRadius: 1,
          minWidth: "100px",
          background: "transparent",
          marginTop: isMainDropdown && "14px",
        }}
      >
        {links.map((link) => (
          <NavLinkItem
            item={item}
            navLink={link}
            isDisabled={isDisabled}
            isDropLink={true}
            isMainDropdown={false}
          />
        ))}
      </Stack>
    </Popover>
  );
});
