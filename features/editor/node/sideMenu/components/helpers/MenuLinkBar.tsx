import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { MenuLink, SideMenuProps } from "@/features/editor";
import {
  dummyMenuLink,
  ExpandableCard,
  useMagicResult,
} from "@/features/editor";

import { useMenuLinkBar } from "../../hooks";
import { SideMenuCard } from "../subMenu/card";
import { MenuLinkBarTrail } from "./index";

interface Props {
  isDirectLink?: boolean;
  isFirstChild?: boolean;
  itemProps: SideMenuProps;
  link: MenuLink;
  pickedLinkData: MenuLink;
  setPickedLinkId: React.Dispatch<React.SetStateAction<string>>;
  onUpdateParentLinkHandler: (menuLink: MenuLink) => void;
  onEditLinkHandler: (menuLink: MenuLink) => void;
  onRemoveLinkHandler?: (id: string) => void;
}

export const MenuLinkBar = React.memo(function MenuLinkBar({
  isDirectLink = false,
  isFirstChild = false,
  itemProps,
  link,
  pickedLinkData,
  setPickedLinkId,
  onUpdateParentLinkHandler,
  onEditLinkHandler,
  onRemoveLinkHandler,
}: Props) {
  const {
    isSubLinksOpen,
    onSubLinksOpen,
    onSubLinksClose,
    pickedSubLinkData,
    setPickedSubLinkId,
    onUpdateLinkHandler,
    onAddSubLinkHandler,
    onEditSubLinkHandler,
    onRemoveSubLinkHandler,
  } = useMenuLinkBar({
    currentLink: link,
    onUpdateParentLinkHandler,
  });

  const { stringifiedOutput } = useMagicResult(link.text);

  // Handler
  const onToggleCardHandler = React.useCallback(() => {
    if (pickedLinkData?.id === link.id) {
      setPickedLinkId("");
      return onSubLinksClose();
    }

    setPickedLinkId(link.id);
    onSubLinksOpen();
  }, [
    link.id,
    onSubLinksClose,
    onSubLinksOpen,
    pickedLinkData?.id,
    setPickedLinkId,
  ]);

  const onClickHandler = React.useCallback(() => {
    const id = String(Date.now());

    const newMenuLink: MenuLink = {
      ...dummyMenuLink,
      id,
      subProps: { color: itemProps.linkColor ?? "black" },
      buttonProps: { buttonType: "contained" },
    };

    onAddSubLinkHandler(newMenuLink);
    setPickedSubLinkId(id);
    onSubLinksOpen();
  }, [
    itemProps.linkColor,
    onAddSubLinkHandler,
    onSubLinksOpen,
    setPickedSubLinkId,
  ]);

  return (
    <Stack position="relative" sx={{ width: "100%" }}>
      {/* Trail */}
      {!isDirectLink && <MenuLinkBarTrail isFirstChild={isFirstChild} />}

      {/* Body */}
      <ExpandableCard
        active={pickedLinkData?.id === link.id}
        title={stringifiedOutput}
        onClick={onToggleCardHandler}
        onRemove={() => onRemoveLinkHandler(link.id)}
      >
        <SideMenuCard
          itemProps={itemProps}
          onEditData={pickedLinkData}
          onClose={() => setPickedLinkId("")}
          onSubmit={onEditLinkHandler}
        />
      </ExpandableCard>

      {/* Children */}
      {isSubLinksOpen && (
        <Stack sx={{ marginBottom: 1 }}>
          {/* Children Links */}
          <Stack direction="column" spacing={0.5} sx={{ paddingLeft: "32px" }}>
            {link.links?.map((subLink, index) => (
              <MenuLinkBar
                isDirectLink={false}
                isFirstChild={index === 0}
                key={subLink.id}
                itemProps={itemProps}
                link={subLink}
                setPickedLinkId={setPickedSubLinkId}
                pickedLinkData={pickedSubLinkData}
                onUpdateParentLinkHandler={onUpdateLinkHandler}
                onEditLinkHandler={onEditSubLinkHandler}
                onRemoveLinkHandler={onRemoveSubLinkHandler}
              />
            ))}
          </Stack>

          {/* Add Button */}
          <Box
            sx={{
              marginTop: 1,
              marginBottom: 2,
              paddingLeft: "32px",
              position: "relative",
            }}
          >
            <Box
              position="absolute"
              sx={{
                width: "1px",
                height: link.links?.length > 0 ? "46px" : "24px",
                left: "11px",
                top: link.links?.length > 0 ? "-38px" : "-16px",
                backgroundColor: "rgba(0,0,0,.15)",
              }}
            ></Box>
            <Box
              position="absolute"
              sx={{
                width: "20px",
                height: "1px",
                left: "12px",
                top: "7px",
                backgroundColor: "rgba(0,0,0,.15)",
              }}
            ></Box>
            <Stack
              onClick={onClickHandler}
              spacing={0.005}
              direction="row"
              alignItems="center"
              sx={{
                cursor: "pointer",
                paddingLeft: 1,
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
          </Box>
        </Stack>
      )}
    </Stack>
  );
});
