import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { MenuLink } from "@/features/editor";

interface Props {
  menuLinkData: MenuLink;
  updateMenuLinkSubProps: (name: string, body: unknown) => void;
}

export const SideMenuPosition = React.memo(function SideMenuPosition({
  menuLinkData,
  updateMenuLinkSubProps,
}: Props) {
  return (
    <Stack direction="column">
      <Typography
        sx={(theme) => ({
          fontWeight: 600,
          fontSize: theme.typography.fontSize,
        })}
      >
        {"Label Position ( icon - text )"}
      </Typography>

      <FormControl>
        <RadioGroup
          aria-labelledby="position-label"
          name="position"
          onChange={(
            _event: React.ChangeEvent<HTMLInputElement>,
            value: string
          ) => {
            updateMenuLinkSubProps("labelPosition", value);
          }}
          value={menuLinkData.subProps?.labelPosition ?? "left-right"}
        >
          <FormControlLabel
            value="left-right"
            control={<Radio size="small" />}
            label={
              <Typography
                sx={(theme) => ({ fontSize: theme.typography.fontSize })}
              >
                Left-Right
              </Typography>
            }
            sx={{ fontSize: "12px" }}
          />
          <FormControlLabel
            value="right-left"
            control={<Radio size="small" />}
            label={
              <Typography
                sx={(theme) => ({ fontSize: theme.typography.fontSize })}
              >
                Right-Left
              </Typography>
            }
          />
          <FormControlLabel
            value="top-bottom"
            control={<Radio size="small" />}
            label={
              <Typography
                sx={(theme) => ({ fontSize: theme.typography.fontSize })}
              >
                Top-Bottom
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
});
