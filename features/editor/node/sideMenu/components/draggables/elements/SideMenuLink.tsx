import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import * as React from "react";

import { ChevronDownIcon } from "@/assets/icons";
import type { Draggable, MenuLink } from "@/features/editor";
import { IconDisplay, useSideMenuItem } from "@/features/editor";

import { SideMenuLinkDropdown } from "./SideMenuLinkDropdown";

interface Props {
  menuLink: MenuLink;
  item: Draggable;
  isDisabled: boolean;
  isHeader: boolean;
}

export const SideMenuLink = React.memo(function SideMenuLink({
  menuLink,
  item,
  isDisabled,
  isHeader,
}: Props) {
  const {
    itemProps,
    labelPosition,
    stringifiedOutput,
    onClickHandler,
    isDropdownOpen,
  } = useSideMenuItem({
    menuLink,
    item,
  });

  // Memos
  const buttonColor = React.useMemo(() => {
    if (menuLink.buttonProps?.buttonType !== "contained") {
      return "transparent";
    }

    return menuLink.buttonProps?.buttonColor ?? "white";
  }, [menuLink.buttonProps?.buttonColor, menuLink.buttonProps?.buttonType]);

  const borderColor = React.useMemo(() => {
    if (menuLink.buttonProps?.buttonType === "contained") {
      return "transparent";
    }

    return menuLink.subProps?.color ?? "black";
  }, [menuLink.buttonProps?.buttonType, menuLink.subProps?.color]);

  return (
    <React.Fragment>
      <Stack
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          !isDisabled && onClickHandler();
        }}
        direction={
          labelPosition === "top-bottom"
            ? "column"
            : labelPosition === "right-left"
            ? "row-reverse"
            : "row"
        }
        spacing={
          itemProps.linkIconSpacing ? itemProps.linkIconSpacing / 2 : 0.1
        }
        alignItems="center"
        justifyContent={isHeader ? "center" : "flex-start"}
        sx={{
          cursor: !isDisabled && "pointer",
          transition: "150ms linear",
          paddingX: itemProps.linkPaddingX ?? "12px",
          paddingY: itemProps.linkPaddingY ?? "12px",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: !isHeader ? "#F4F4F4" : "transparent",
          },
          width: "100%",
        }}
      >
        {/* Arrow */}
        {menuLink.links && menuLink.links.length > 0 && isDropdownOpen && (
          <ChevronDownIcon sx={{ marginRight: "6px" }} />
        )}

        {menuLink.links && menuLink.links.length > 0 && !isDropdownOpen && (
          <ChevronDownIcon
            sx={{ transform: "rotate(-90deg)", marginRight: "6px" }}
          />
        )}

        {/* Button */}
        {menuLink.isButton && (
          <Button
            size="small"
            variant={menuLink.buttonProps?.buttonType ?? "contained"}
            sx={{
              boxShadow: menuLink.buttonProps?.isShadow
                ? "1px 1px 10px rgba(0,0,0,.2)"
                : null,
              borderRadius: menuLink.buttonProps?.borderRadius ?? 0,
              backgroundColor: buttonColor,
              color: menuLink.subProps?.color ?? itemProps.linkColor ?? "black",
              border: `1px solid ${borderColor}`,
              textTransform: !menuLink.buttonProps?.isUppercase
                ? "none"
                : "uppercase",
              "&:hover": {
                backgroundColor: menuLink.buttonProps?.buttonColor ?? "white",
                color: menuLink.subProps?.color ?? "black",
                border: `1px solid ${borderColor}`,
              },
            }}
          >
            {stringifiedOutput}
          </Button>
        )}

        {/* Non-Button */}
        {!menuLink.isButton && (
          <React.Fragment>
            {/* Image */}
            {menuLink.isImage && (
              <Box
                sx={{
                  borderRadius: "100vh",
                  overflow: "hidden",
                  width: menuLink.subProps?.iconSize
                    ? menuLink.subProps?.iconSize
                    : 20,
                  height: menuLink.subProps?.iconSize
                    ? menuLink.subProps?.iconSize
                    : 20,
                }}
              >
                <Image
                  src={menuLink.imageSrc}
                  alt="image"
                  width={menuLink.subProps?.iconSize ?? 16}
                  height={menuLink.subProps?.iconSize ?? 16}
                  objectFit="contain"
                />
              </Box>
            )}

            {/* Icon */}
            {!menuLink.isImage && (
              <IconDisplay
                name={menuLink.iconName}
                color={menuLink.subProps?.color ?? "black"}
                fontSize={menuLink.subProps?.iconSize ?? 16}
              />
            )}

            {/* Text */}
            <Typography
              sx={{
                fontSize: menuLink.subProps?.fontSize ?? 14,
                fontWeight: menuLink.subProps?.isBold ? 600 : 400,
                fontStyle: menuLink.subProps?.isItalic ? "italic" : "normal",
                textDecoration: menuLink.subProps?.isUnderlined
                  ? "underline"
                  : "none",
                color:
                  menuLink.subProps?.color ?? itemProps.linkColor ?? "black",
              }}
            >
              {stringifiedOutput}
            </Typography>
          </React.Fragment>
        )}
      </Stack>
      {/*  For Side Nav */}
      {isDropdownOpen && !isDisabled && (
        <SideMenuLinkDropdown
          item={item}
          links={menuLink.links}
          isDisabled={isDisabled}
          isHeader={isHeader}
        />
      )}
    </React.Fragment>
  );
});
