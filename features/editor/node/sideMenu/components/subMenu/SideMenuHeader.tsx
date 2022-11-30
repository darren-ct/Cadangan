import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Draggable } from "@/features/editor";
import { NavLinkItem, useSideMenuHeader } from "@/features/editor";

import { MenuLinkBar } from "../helpers";

interface Props {
  item: Draggable;
}

export const SideMenuHeader = React.memo(function SideMenuHeader({
  item,
}: Props) {
  const {
    itemProps,
    setPickedLinkId,
    pickedLinkData,
    onUpdateChildLinkHandler,
  } = useSideMenuHeader(item);

  const isHeaderLinksExist = React.useMemo(() => {
    return itemProps.headerLinks && itemProps.headerLinks.length > 0
      ? true
      : false;
  }, [itemProps.headerLinks]);

  return (
    <Stack direction="column" alignItems="center" spacing={3}>
      {isHeaderLinksExist && (
        <NavLinkItem
          item={item}
          navLink={itemProps.headerLinks[0]}
          isDisabled={true}
          isLogo={true}
        />
      )}

      {!isHeaderLinksExist && (
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
          })}
        >
          Add your header link
        </Typography>
      )}

      {isHeaderLinksExist && (
        <MenuLinkBar
          isDirectLink={true}
          isFirstChild={true}
          itemProps={itemProps}
          link={itemProps.headerLinks[0]}
          pickedLinkData={pickedLinkData}
          setPickedLinkId={setPickedLinkId}
          onEditLinkHandler={onUpdateChildLinkHandler}
          onUpdateParentLinkHandler={onUpdateChildLinkHandler}
        />
      )}
    </Stack>
  );
});
