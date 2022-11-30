import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import * as React from "react";

import type { Draggable, NavLink } from "@/features/editor";
import { IconDisplay, useNavLinkItem } from "@/features/editor";

import { NavLinkMenu } from "./NavLinkMenu";

interface Props {
  navLink: NavLink;
  item: Draggable;
  isDisabled: boolean;
  isLogo?: boolean;
  isDropLink?: boolean;
  isMainDropdown?: boolean;
}

export const NavLinkItem = React.memo(function NavLinkItem({
  navLink,
  item,
  isDisabled,
  isLogo,
  isMainDropdown,
  isDropLink,
}: Props) {
  const {
    itemProps,
    labelPosition,
    stringifiedOutput,
    anchorEl,
    onClosePopover,
    onClickHandler,
  } = useNavLinkItem({
    navLink,
    item,
  });

  // Memos
  const buttonColor = React.useMemo(() => {
    if (navLink.buttonProps?.buttonType !== "contained") {
      return "transparent";
    }

    return navLink.buttonProps?.buttonColor ?? "white";
  }, [navLink.buttonProps?.buttonColor, navLink.buttonProps?.buttonType]);

  const borderColor = React.useMemo(() => {
    if (navLink.buttonProps?.buttonType === "contained") {
      return "transparent";
    }

    return navLink.subProps?.color ?? "black";
  }, [navLink.buttonProps?.buttonType, navLink.subProps?.color]);

  return (
    <Stack
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        !isDisabled && onClickHandler(e);
      }}
      direction={
        labelPosition === "top-bottom"
          ? "column"
          : labelPosition === "right-left"
          ? "row-reverse"
          : "row"
      }
      spacing={itemProps.linkIconSpacing ? itemProps.linkIconSpacing / 2 : 0.5}
      alignItems="center"
      sx={{
        borderLeft: isDropLink && "1px solid rgba(0,0,0,.1)",
        borderRight: isDropLink && "1px solid rgba(0,0,0,.1)",
        borderBottom: isDropLink && "1px solid rgba(0,0,0,.1)",
        cursor: !isDisabled && "pointer",
        marginLeft:
          isDropLink || isLogo
            ? "0px"
            : itemProps.linkSpacing
            ? `${itemProps.linkSpacing}px`
            : "16px",
        transition: "150ms linear",
        paddingX: isDropLink ? "12px" : "0px",
        paddingY: isDropLink ? "12px" : "0px",
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: isDropLink ? "#F4F4F4" : "transparent",
        },
      }}
    >
      {/* Button */}
      {navLink.isButton && (
        <Button
          size="small"
          variant={navLink.buttonProps?.buttonType ?? "contained"}
          sx={{
            boxShadow: navLink.buttonProps?.isShadow
              ? "1px 1px 10px rgba(0,0,0,.2)"
              : null,
            borderRadius: navLink.buttonProps?.borderRadius ?? 0,
            backgroundColor: buttonColor,
            color: navLink.subProps?.color ?? itemProps.linkColor ?? "black",
            border: `1px solid ${borderColor}`,
            textTransform: !navLink.buttonProps?.isUppercase
              ? "none"
              : "uppercase",
            "&:hover": {
              backgroundColor: navLink.buttonProps?.buttonColor ?? "white",
              color: navLink.subProps?.color ?? "black",
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          {stringifiedOutput}
        </Button>
      )}

      {/* Non-Button */}
      {!navLink.isButton && (
        <React.Fragment>
          {/* Image */}
          {navLink.isImage && (
            <Box
              sx={{
                borderRadius: !isLogo && "100vh",
                overflow: "hidden",
                border: !isLogo && "1px solid rgba(0,0,0,.1)",
                width: navLink.subProps?.iconSize
                  ? navLink.subProps?.iconSize
                  : 20,
                height: navLink.subProps?.iconSize
                  ? navLink.subProps?.iconSize
                  : 20,
              }}
            >
              <Image
                src={navLink.imageSrc}
                alt="image"
                width={navLink.subProps?.iconSize ?? 16}
                height={navLink.subProps?.iconSize ?? 16}
                objectFit={isLogo ? "contain" : "cover"}
              />
            </Box>
          )}

          {/* Icon */}
          {!navLink.isImage && (
            <IconDisplay
              name={navLink.iconName}
              color={navLink.subProps?.color ?? "black"}
              fontSize={navLink.subProps?.iconSize ?? 16}
            />
          )}

          {/* Text */}
          <Typography
            sx={{
              fontSize: navLink.subProps?.fontSize ?? 14,
              fontWeight: navLink.subProps?.isBold ? 600 : 400,
              fontStyle: navLink.subProps?.isItalic ? "italic" : "normal",
              textDecoration: navLink.subProps?.isUnderlined
                ? "underline"
                : "none",
              color: navLink.subProps?.color ?? itemProps.linkColor ?? "black",
            }}
          >
            {stringifiedOutput}
          </Typography>
        </React.Fragment>
      )}

      {/* For Top Nav */}
      {anchorEl && !isDisabled && (
        <NavLinkMenu
          item={item}
          anchorEl={anchorEl}
          onClose={onClosePopover}
          links={navLink?.links}
          isDisabled={isDisabled}
          isMainDropdown={isMainDropdown}
        />
      )}
    </Stack>
  );
});
