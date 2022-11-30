import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { NavLink } from "@/features/editor";

interface Props {
  navLinkData: NavLink;
  updateNavLinkSubProps: (name: string, body: unknown) => void;
}

export const FormColor = React.memo(function FormColor({
  navLinkData,
  updateNavLinkSubProps,
}: Props) {
  return (
    <React.Fragment>
      <Typography
        sx={(theme) => ({
          fontWeight: 600,
          fontSize: theme.typography.fontSize,
          marginBottom: "3px",
        })}
      >
        Color
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={(theme) => ({ fontSize: theme.typography.fontSize })}>
          Icon and Text
        </Typography>
        <label htmlFor="icon-text-color">
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,.2)",
              width: "18px",
              height: "18px",
              cursor: "pointer",
              backgroundColor: navLinkData?.subProps?.color ?? "black",
            }}
          >
            <TextField
              id="icon-text-color"
              type="color"
              name="buttonColor"
              value={navLinkData?.subProps?.color ?? "black"}
              sx={{ padding: "0px", display: "none" }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateNavLinkSubProps("color", e.target.value)
              }
            />
          </Box>
        </label>
      </Stack>
    </React.Fragment>
  );
});
