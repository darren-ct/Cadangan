import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import * as React from "react";

import type {
  ClassicSubProps,
  Draggable,
  NavProps,
  UserSubProps,
} from "@/features/editor";
import { dummyNavProps, useEditorDraggableStore } from "@/features/editor";

import { NavLinkItem } from "./elements";
import { ClassicNav, SearchNav } from "./types";

export const NavItem = React.memo(function NavItem({
  item,
  isDisabled = true,
}: {
  item: Draggable;
  isDisabled: boolean;
}) {
  // Hooks
  const { updateDraggable } = useEditorDraggableStore();

  // Memoized Props
  const itemProps = React.useMemo(() => {
    return item.props as NavProps;
  }, [item.props]);

  const memoizedType = React.useMemo(() => {
    if (!itemProps.type) {
      return "classic";
    }

    return itemProps.type;
  }, [itemProps.type]);

  const memoizedPaddingX = React.useMemo(() => {
    if (!itemProps.paddingX) {
      return "24px";
    }

    return `${itemProps.paddingX}px`;
  }, [itemProps.paddingX]);

  const memoizedPaddingY = React.useMemo(() => {
    if (!itemProps.paddingY) {
      return "16px";
    }

    return `${itemProps.paddingY}px`;
  }, [itemProps.paddingY]);

  // useEffect
  React.useEffect(() => {
    if (!(item.props as NavProps).type) {
      updateDraggable(item.id, {
        ...item,
        props: {
          ...dummyNavProps,
          navLogo: { ...dummyNavProps.navLogo, id: String(Date.now()) },
          links: [
            {
              id: String(Date.now()),
              iconName: "down-arrow",
              text: [
                {
                  id: String(Date.now()),
                  type: "CLASSIC",
                  subProps: {
                    text: "Link 1",
                  } as ClassicSubProps,
                },
              ],
              subProps: {
                color: "black",
                labelPosition: "right-left",
              },
            },
            {
              id: String(Date.now() + 1),
              iconName: "account",
              text: [
                {
                  id: String(Date.now()),
                  type: "USER",
                  subProps: {
                    subType: "FIRST_NAME",
                  } as UserSubProps,
                },
              ],
              links: [
                {
                  id: String(Date.now()),
                  iconName: "logout",
                  text: [
                    {
                      id: String(Date.now()),
                      type: "CLASSIC",
                      subProps: {
                        text: "Logout",
                      } as ClassicSubProps,
                    },
                  ],
                  actions: [
                    {
                      id: String(Date.now()),
                      title: "Logout",
                      type: "AUTH",
                      subType: "AUTH_LOGOUT",
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
    }
  }, [item, updateDraggable]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      height="100%"
      paddingY={memoizedPaddingY}
      paddingX={memoizedPaddingX}
      sx={{
        backgroundColor: itemProps.backgroundColor ?? "white",
        boxShadow: "1px 1px 1px rgba(0,0,0,.1)",
      }}
    >
      {itemProps.navLogo?.id && (
        <NavLinkItem
          navLink={itemProps.navLogo}
          item={item}
          isDisabled={isDisabled}
          isLogo={true}
        />
      )}

      {!itemProps.navLogo?.id && <Typography>Logo</Typography>}

      {memoizedType === "search" && (
        <SearchNav itemProps={itemProps} item={item} isDisabled={isDisabled} />
      )}

      {memoizedType === "classic" && (
        <ClassicNav itemProps={itemProps} item={item} isDisabled={isDisabled} />
      )}
    </Stack>
  );
});
