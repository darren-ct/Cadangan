import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import * as React from "react";

import { SearchIcon } from "@/assets/icons/Search";
import type { Draggable, NavProps } from "@/features/editor";
import { NavLinkItem } from "@/features/editor";

export const SearchNav = React.memo(function SearchNav({
  item,
  itemProps,
  isDisabled = true,
}: {
  item: Draggable;
  itemProps: NavProps;
  isDisabled?: boolean;
}) {
  return (
    <Stack
      alignItems="center"
      direction="row"
      flex={1}
      justifyContent="flex-end"
    >
      <TextField
        sx={{ flex: 1, marginRight: 4, marginLeft: 4, maxWidth: "240px" }}
        size="small"
        placeholder="Search here..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Stack alignItems="center" direction="row">
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
    </Stack>
  );
});
