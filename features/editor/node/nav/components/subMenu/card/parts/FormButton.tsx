import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { NavLink } from "@/features/editor";

interface Props {
  navLinkData: NavLink;
  updateNavLinkProps: (name: string, body: unknown) => void;
  updateNavLinkButtonProps: (name: string, body: unknown) => void;
}

export const FormButton = React.memo(function FormButton({
  navLinkData,
  updateNavLinkProps,
  updateNavLinkButtonProps,
}: Props) {
  return (
    <React.Fragment>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
            fontWeight: 600,
          })}
        >
          Apply Button Styling ?
        </Typography>
        <Switch
          size="small"
          checked={navLinkData.isButton ?? false}
          onChange={() => updateNavLinkProps("isButton", !navLinkData.isButton)}
        />
      </Stack>

      {navLinkData.isButton && (
        <Stack direction="column" marginTop={3}>
          {/* Type */}
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: theme.typography.fontSize,
              marginBottom: "3px",
            })}
          >
            Type
          </Typography>
          <Select
            size="small"
            sx={(theme) => ({
              background: "#FAFAFA",
              fontSize: theme.typography.fontSize,
            })}
            value={navLinkData.buttonProps?.buttonType ?? "contained"}
            name="type"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateNavLinkButtonProps("buttonType", e.target.value)
            }
          >
            <MenuItem
              value="contained"
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
              })}
            >
              Contained
            </MenuItem>
            <MenuItem
              value="outlined"
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
              })}
            >
              Outlined
            </MenuItem>
          </Select>

          {/* Button Color */}
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: theme.typography.fontSize,
              marginBottom: "3px",
              marginTop: 2.4,
            })}
          >
            Color
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              sx={(theme) => ({ fontSize: theme.typography.fontSize })}
            >
              Button Color
            </Typography>
            <label htmlFor="button-color">
              <Box
                sx={{
                  border: "1px solid rgba(0,0,0,.2)",
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  backgroundColor:
                    navLinkData?.buttonProps?.buttonColor ?? "white",
                }}
              >
                <TextField
                  id="button-color"
                  type="color"
                  name="buttonColor"
                  value={navLinkData?.buttonProps?.buttonColor ?? "white"}
                  sx={{ padding: "0px", display: "none" }}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateNavLinkButtonProps("buttonColor", e.target.value)
                  }
                />
              </Box>
            </label>
          </Stack>

          {/* Border Radius */}
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: theme.typography.fontSize,
              marginBottom: "3px",
              marginTop: 2.4,
            })}
          >
            Rounding
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            paddingLeft={1}
          >
            <Slider
              size="small"
              aria-label="Rounding"
              value={navLinkData.buttonProps?.borderRadius ?? 0}
              onChange={(_e: Event, value: number | number[]) => {
                updateNavLinkButtonProps("borderRadius", value as number);
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
              value={navLinkData.buttonProps?.borderRadius ?? 0}
              name="rounding"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateNavLinkButtonProps("borderRadius", e.target.value)
              }
            />
          </Stack>

          {/* isShadow */}
          <Stack
            direction="row"
            marginTop={2.4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={(theme) => ({
                fontWeight: 600,
                fontSize: theme.typography.fontSize,
                marginBottom: "3px",
              })}
            >
              Shadow
            </Typography>
            <Switch
              size="small"
              name="isShadow"
              checked={navLinkData.buttonProps?.isShadow ?? false}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => {
                updateNavLinkButtonProps(e.target.name, checked);
              }}
            />
          </Stack>

          {/* isUppercase */}
          <Stack
            direction="row"
            marginTop={2.4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={(theme) => ({
                fontWeight: 600,
                fontSize: theme.typography.fontSize,
                marginBottom: "3px",
              })}
            >
              Uppercase
            </Typography>
            <Switch
              size="small"
              name="isUppercase"
              checked={navLinkData.buttonProps?.isUppercase ?? false}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => {
                updateNavLinkButtonProps(e.target.name, checked);
              }}
            />
          </Stack>
        </Stack>
      )}
    </React.Fragment>
  );
});
