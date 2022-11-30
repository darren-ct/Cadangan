import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable, NavProps } from "@/features/editor";
import { NavLinkItem } from "@/features/editor";

export const ClassicNav = React.memo(function ClassicNav({
  item,
  itemProps,
  isDisabled = true,
}: {
  item: Draggable;
  itemProps: NavProps;
  isDisabled?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center">
      {itemProps?.links?.map((link) => (
        <NavLinkItem
          key={link.id}
          navLink={link}
          item={item}
          isDisabled={isDisabled}
          isMainDropdown={true}
          isDropLink={false}
        />
      ))}
    </Stack>
  );
});
