import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable, NavLink } from "@/features/editor";

import { NavLinkItem } from "./NavLinkItem";

interface Props {
  links: NavLink[];
  item: Draggable;
  isDisabled: boolean;
}

export const NavLinkDropdown = React.memo(function NavLinkDropdown({
  item,
  links,
  isDisabled,
}: Props) {
  return (
    <Stack direction="column" marginLeft={1}>
      {links.map((link) => (
        <NavLinkItem navLink={link} item={item} isDisabled={isDisabled} />
      ))}
    </Stack>
  );
});
