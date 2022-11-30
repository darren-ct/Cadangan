import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable, MenuLink } from "@/features/editor";

import { SideMenuLink } from "./SideMenuLink";

interface Props {
  links: MenuLink[];
  item: Draggable;
  isDisabled: boolean;
  isHeader: boolean;
}

export const SideMenuLinkDropdown = React.memo(function SideMenuLinkDropdown({
  item,
  links,
  isDisabled,
  isHeader,
}: Props) {
  return (
    <Stack direction="column" marginLeft={2.4}>
      {links.map((link) => (
        <SideMenuLink
          menuLink={link}
          item={item}
          isDisabled={isDisabled}
          isHeader={isHeader}
        />
      ))}
    </Stack>
  );
});
