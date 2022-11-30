import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Draggable, NavProps } from "@/features/editor";
import { NavLinkItem, useNavLogo } from "@/features/editor";

import { NavLinkBar } from "../helpers";

interface Props {
  item: Draggable;
  itemProps: NavProps;
}

export const NavLogo = React.memo(function NavLogo({ item, itemProps }: Props) {
  const { pickedLinkData, setPickedLinkId, onUpdateChildLinkHandler } =
    useNavLogo(item);

  const isLogoExist = React.useMemo(() => {
    return itemProps.navLogo?.id ? true : false;
  }, [itemProps.navLogo?.id]);

  return (
    <Stack direction="column" alignItems="center" spacing={3}>
      {isLogoExist && (
        <NavLinkItem
          item={item}
          navLink={itemProps.navLogo}
          isDisabled={true}
        />
      )}

      {!isLogoExist && (
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
          })}
        >
          Add your logo
        </Typography>
      )}

      {isLogoExist && (
        <NavLinkBar
          isDirectLink={true}
          isFirstChild={true}
          itemProps={itemProps}
          link={itemProps.navLogo}
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onEditLinkHandler={onUpdateChildLinkHandler}
          onUpdateParentLinkHandler={onUpdateChildLinkHandler}
        />
      )}
    </Stack>
  );
});
