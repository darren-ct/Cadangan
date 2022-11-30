import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { IconDisplay } from "./IconDisplay";

const icons = [
  "account",
  "logout",
  "add-circle",
  "add",
  "flag",
  "reload",
  "remove",
  "star",
  "keret",
];

interface Props {
  onPickIcon?: (prop: string, newValue: string | number) => void;
  onAddIcon?: (name: string) => void;
  onEditIcon?: (name: string) => void;
  anchorEl: HTMLElement;
  onDropdownClose: (e: React.MouseEvent<HTMLElement>) => void;
}

export const IconDropdown = ({
  onAddIcon,
  onPickIcon,
  onEditIcon,
  anchorEl,
  onDropdownClose,
}: Props) => {
  const [filteredIcons, setFilteredIcons] = React.useState<string[]>(icons);
  const [search, setSearch] = React.useState<string>("");

  // Listener
  const onIconClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>, icon: string) => {
      if (onPickIcon) {
        onPickIcon("icon", icon);
        return onDropdownClose(e);
      }

      if (onEditIcon) {
        onEditIcon(icon);
        return onDropdownClose(e);
      }

      onAddIcon(icon);
      onDropdownClose(e);
    },
    [onAddIcon, onPickIcon, onEditIcon, onDropdownClose]
  );

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback((e) => {
      setSearch(e.target.value);
    }, []);

  // useEffect
  React.useEffect(() => {
    setFilteredIcons(
      icons.filter((icon) =>
        icon.toLowerCase().trim().startsWith(search.toLowerCase().trim())
      )
    );
  }, [search]);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onDropdownClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Stack
        padding={2}
        sx={{
          width: "100%",
          background: "white",
          boxShadow: "1px 1px 10px rgba(0,0,0,.2)",
          borderRadius: 1,
        }}
      >
        <TextField
          variant="standard"
          size="medium"
          placeholder="Search..."
          sx={{ marginBottom: "16px" }}
          inputProps={{ style: { fontSize: 12 } }}
          onChange={onSearchChange}
          value={search}
        />
        <Grid container spacing={2}>
          <Grid
            item
            xs={2}
            key={"none"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              onClick={(e) => onIconClick(e, "none")}
              sx={(theme) => ({
                cursor: "pointer",
                fontSize: theme.typography.fontSize,
                color: "#828282",
              })}
            >
              None
            </Typography>
          </Grid>

          {filteredIcons.length !== 0 ? (
            filteredIcons.map((icon) => (
              <Grid item xs={2} key={icon}>
                <IconButton onClick={(e) => onIconClick(e, icon)}>
                  <IconDisplay name={icon} />
                </IconButton>
              </Grid>
            ))
          ) : (
            <Typography
              sx={{
                marginLeft: 2,
                marginTop: 2,
                fontSize: 12,
                color: "rgba(0,0,0,.5)",
              }}
            >
              No Icons Found..
            </Typography>
          )}
        </Grid>
      </Stack>
    </Popover>
  );
};

export default IconDropdown;
