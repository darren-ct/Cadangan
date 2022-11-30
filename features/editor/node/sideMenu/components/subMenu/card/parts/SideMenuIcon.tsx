import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import * as React from "react";

import { ChevronDownIcon, CloseIcon } from "@/assets/icons";
import type { MenuLink } from "@/features/editor";
import { IconDisplay, IconDropdown } from "@/features/editor";

interface Props {
  menuLinkData: MenuLink;
  updateMenuLinkProps: (name: string, body: unknown) => void;
  updateMenuLinkSubProps: (name: string, body: unknown) => void;
  iconsAnchorEl: HTMLElement;
  onIconsOpen: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onIconsClose: () => void;
}

export const SideMenuIcon = React.memo(function SideMenuIcon({
  menuLinkData,
  updateMenuLinkProps,
  updateMenuLinkSubProps,
  iconsAnchorEl,
  onIconsOpen,
  onIconsClose,
}: Props) {
  const uploadImageHandler: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const file = e.target.files[0];
        const image = URL.createObjectURL(file);
        updateMenuLinkProps("imageSrc", image);
      },
      [updateMenuLinkProps]
    );

  return (
    <Stack direction="column">
      <Typography
        sx={(theme) => ({
          fontWeight: 600,
          fontSize: theme.typography.fontSize,
          marginBottom: menuLinkData.isImage ? "8px" : "3px",
        })}
      >
        {menuLinkData.isImage ? "Image" : "Icon"}
      </Typography>

      {!menuLinkData.isImage && (
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <Stack
            onClick={onIconsOpen}
            position="relative"
            direction="row"
            alignItems="center"
            bgcolor="white"
            paddingX={0.8}
            paddingY={0.3}
            sx={{
              width: "100%",
              cursor: "pointer",
              borderRadius: 2,
              "&:hover": {
                background: "rgba(0,0,0,0.1)",
              },
              transition: "150ms linear",
            }}
          >
            {menuLinkData.iconName && (
              <IconDisplay name={menuLinkData.iconName} />
            )}

            {menuLinkData.iconName ? (
              <Typography
                sx={(theme) => ({
                  marginLeft: 2,
                  flex: 1,
                  fontSize: theme.typography.fontSize,
                })}
              >
                {menuLinkData.iconName}
              </Typography>
            ) : (
              <Typography
                sx={(theme) => ({
                  flex: 1,
                  fontSize: theme.typography.fontSize,
                })}
              >
                No icons selected
              </Typography>
            )}

            <IconButton
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                updateMenuLinkProps("iconName", "");
              }}
            >
              <CloseIcon sx={{ fontSize: "14px" }} />
            </IconButton>
            <ChevronDownIcon sx={{ cursor: "pointer" }} />

            <IconDropdown
              onPickIcon={(_prop, newValue) =>
                updateMenuLinkProps("iconName", newValue)
              }
              onDropdownClose={(e) => {
                e.stopPropagation();
                onIconsClose();
              }}
              anchorEl={iconsAnchorEl}
            />
          </Stack>
        </Stack>
      )}

      {menuLinkData.isImage && (
        <Stack direction="row" alignItems="flex-start">
          <Button
            size="small"
            variant="contained"
            component="label"
            sx={{ marginRight: 2, fontSize: "11px" }}
          >
            Upload Logo
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={uploadImageHandler}
            />
          </Button>

          <Image
            src={menuLinkData.imageSrc ?? "/dummy"}
            alt="logo"
            width={32}
            height={32}
            objectFit="contain"
          />
        </Stack>
      )}

      {/* Icon Size */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        paddingLeft={1}
        marginTop={1.5}
      >
        <Slider
          size="small"
          aria-label="iconSize"
          value={menuLinkData.subProps?.iconSize ?? 16}
          onChange={(_e: Event, value: number | number[]) => {
            updateMenuLinkSubProps("iconSize", value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          size="small"
          type="number"
          inputProps={{ style: { fontSize: 12 } }}
          sx={{
            width: "100px",
            backgroundColor: "#FAFAFA",
            border: "none",
          }}
          placeholder="px"
          value={menuLinkData.subProps?.iconSize ?? 16}
          name="rounding"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateMenuLinkSubProps("iconSize", e.target.value)
          }
        />
      </Stack>
      {/* Image  */}
      <Stack
        marginTop={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography sx={(theme) => ({ fontSize: theme.typography.fontSize })}>
          Upload image instead ?
        </Typography>
        <Switch
          size="small"
          checked={menuLinkData.isImage ?? false}
          onChange={() => updateMenuLinkProps("isImage", !menuLinkData.isImage)}
        />
      </Stack>
    </Stack>
  );
});
