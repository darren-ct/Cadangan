import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { MenuLink, SideMenuProps } from "@/features/editor";
import { dummyMenuLink } from "@/features/editor";

import { MenuLinkBar } from "../helpers";

interface Props {
  itemProps: SideMenuProps;
  pickedLinkData: MenuLink;
  setPickedLinkId: React.Dispatch<React.SetStateAction<string>>;
  onUpdateChildLinkHandler: (navLink: MenuLink) => void;
  onAddLinkHandler: (menuLink: MenuLink) => void;
  onEditLinkHandler: (menuLink: MenuLink) => void;
  onRemoveLinkHandler: (menuLinkId: string) => void;
}

export const SideMenuLinks = React.memo(function SideMenuLinks({
  itemProps,
  pickedLinkData,
  setPickedLinkId,
  onUpdateChildLinkHandler,
  onAddLinkHandler,
  onEditLinkHandler,
  onRemoveLinkHandler,
}: Props) {
  const onClickHandler = React.useCallback(() => {
    const id = String(Date.now());

    const newMenuLink: MenuLink = {
      ...dummyMenuLink,
      id,
      subProps: { color: itemProps.linkColor ?? "black" },
      buttonProps: { buttonType: "contained" },
    };

    onAddLinkHandler(newMenuLink);
    setPickedLinkId(id);
  }, [itemProps.linkColor, onAddLinkHandler, setPickedLinkId]);

  return (
    <Stack direction="column">
      {/* List */}
      {!itemProps?.links || itemProps.links?.length < 1 ? (
        <Box
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
            width: "100%",
            textAlign: "center",
            border: "1px dotted rgba(0,0,0,.4)",
            color: "rgba(0,0,0,.4)",
            borderRadius: 4,
            padding: "6px 24px",
          })}
        >
          No Links
        </Box>
      ) : (
        <Stack>
          {itemProps.links?.map((link, index) => (
            <MenuLinkBar
              key={link.id}
              isDirectLink={true}
              isFirstChild={index === 0}
              itemProps={itemProps}
              link={link}
              pickedLinkData={pickedLinkData}
              setPickedLinkId={setPickedLinkId}
              onUpdateParentLinkHandler={onUpdateChildLinkHandler}
              onEditLinkHandler={onEditLinkHandler}
              onRemoveLinkHandler={onRemoveLinkHandler}
            />
          ))}
        </Stack>
      )}

      {/* Add Button */}
      <Stack
        onClick={onClickHandler}
        spacing={0.005}
        direction="row"
        alignItems="center"
        sx={{
          cursor: "pointer",
          paddingLeft: 1,
          marginTop: 0.5,
        }}
      >
        <AddIcon
          sx={(theme) => ({
            color: "#130F40",
            fontSize: theme.typography.fontSize,
          })}
        />
        <Typography
          sx={(theme) => ({
            cursor: "pointer",
            marginTop: 1,
            paddingLeft: "16px",
            color: "#130F40",
            fontSize: theme.typography.fontSize - 1,
          })}
        >
          ADD SUBLINK
        </Typography>
      </Stack>
    </Stack>
  );
});
