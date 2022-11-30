import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable, SideMenuProps } from "@/features/editor";
import { dummyMenuProps, useEditorDraggableStore } from "@/features/editor";

import { SideMenuLink } from "./elements";

export const SideMenuItem = React.memo(function SideMenuItem({
  item,
  isDisabled = true,
}: {
  item: Draggable;
  isDisabled: boolean;
}) {
  // Hooks
  const { updateDraggable } = useEditorDraggableStore();

  // Memos
  const itemProps = React.useMemo(() => {
    return item.props as SideMenuProps;
  }, [item.props]);

  const memoizedPaddingY = React.useMemo(() => {
    if (!itemProps.paddingY) {
      return "24px";
    }

    return `${itemProps.paddingY}px`;
  }, [itemProps.paddingY]);

  // useEffect
  React.useEffect(() => {
    if (!(item.props as SideMenuProps).backgroundColor) {
      updateDraggable(item.id, { ...item, props: { ...dummyMenuProps } });
    }
  }, [item, updateDraggable]);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      spacing={4}
      width="100%"
      minHeight="100%"
      paddingY={memoizedPaddingY}
      sx={{
        backgroundColor: itemProps.backgroundColor ?? "white",
        scrollbarWidth: "none",
      }}
    >
      {itemProps.headerLinks && itemProps.headerLinks?.length > 0 && (
        <SideMenuLink
          menuLink={itemProps.headerLinks[0]}
          item={item}
          isDisabled={isDisabled}
          isHeader={true}
        />
      )}

      <Stack direction="column" justifyContent="flex-start">
        {itemProps.links?.map((link) => (
          <SideMenuLink
            item={item}
            menuLink={link}
            isDisabled={isDisabled}
            isHeader={false}
          />
        ))}
      </Stack>
    </Stack>
  );
});
