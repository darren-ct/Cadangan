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
import type { NavLink } from "@/features/editor";
import { IconDisplay, IconDropdown } from "@/features/editor";

interface Props {
  navLinkData: NavLink;
  updateNavLinkProps: (name: string, body: unknown) => void;
  updateNavLinkSubProps: (name: string, body: unknown) => void;
  iconsAnchorEl: HTMLElement;
  onIconsOpen: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onIconsClose: () => void;
}

export const FormIcon = React.memo(function FormIcon({
  navLinkData,
  updateNavLinkProps,
  updateNavLinkSubProps,
  iconsAnchorEl,
  onIconsOpen,
  onIconsClose,
}: Props) {
  const uploadImageHandler: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (e) => {
        const file = e.target.files[0];
        const image = URL.createObjectURL(file);
        updateNavLinkProps("imageSrc", image);
      },
      [updateNavLinkProps]
    );

  return (
    <Stack direction="column">
      <Typography
        sx={(theme) => ({
          fontWeight: 600,
          fontSize: theme.typography.fontSize,
          marginBottom: navLinkData.isImage ? "8px" : "3px",
        })}
      >
        {navLinkData.isImage ? "Image" : "Icon"}
      </Typography>

      {!navLinkData.isImage && (
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
            {navLinkData.iconName && (
              <IconDisplay name={navLinkData.iconName} />
            )}

            {navLinkData.iconName ? (
              <Typography
                sx={(theme) => ({
                  marginLeft: 2,
                  flex: 1,
                  fontSize: theme.typography.fontSize,
                })}
              >
                {navLinkData.iconName}
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
                updateNavLinkProps("iconName", "");
              }}
            >
              <CloseIcon sx={{ fontSize: "14px" }} />
            </IconButton>
            <ChevronDownIcon sx={{ cursor: "pointer" }} />

            <IconDropdown
              onPickIcon={(_prop, newValue) =>
                updateNavLinkProps("iconName", newValue)
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

      {navLinkData.isImage && (
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
            src={navLinkData.imageSrc ?? "/dummy"}
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
          value={navLinkData.subProps?.iconSize ?? 16}
          onChange={(_e: Event, value: number | number[]) => {
            updateNavLinkSubProps("iconSize", value as number);
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
          value={navLinkData.subProps?.iconSize ?? 16}
          name="rounding"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateNavLinkSubProps("iconSize", e.target.value)
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
          checked={navLinkData.isImage ?? false}
          onChange={() => updateNavLinkProps("isImage", !navLinkData.isImage)}
        />
      </Stack>
    </Stack>
  );
});
