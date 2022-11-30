import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

export const TextStyles = React.memo(function TextStyles() {
  return (
    <Stack
      direction="row"
      width="100%"
      padding={2}
      bgcolor="rgba(0,0,0,.1)"
      borderRadius={2}
    >
      <Stack direction="column" sx={{ flex: 2 }} spacing={3.7}>
        <Typography>Fixed</Typography>
        <Typography>Size</Typography>
        <Typography>Max Length</Typography>
        <Typography>Multi-line</Typography>
        <Typography>Copyable</Typography>
        <Typography>Opacity</Typography>
        <Typography>Auto-width</Typography>
      </Stack>
      <Stack direction="column" spacing={1} sx={{ flex: 3 }}>
        <Stack direction="row" spacing={2}>
          <Box>Top</Box>
          <Box>Bottom</Box>
          <Box>None</Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Stack direction="column">
            <TextField
              size="small"
              variant="standard"
              placeholder="Width"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                marginBottom: "4px",
                backgroundColor: "white",
                borderRadius: 1,
                padding: 1,
              }}
            />
            <Typography sx={{ fontSize: "12px" }}>Width</Typography>
          </Stack>
          <Stack direction="column">
            <TextField
              size="small"
              variant="standard"
              placeholder="Height"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                marginBottom: "4px",
                backgroundColor: "white",
                borderRadius: 1,
                padding: 1,
              }}
            />
            <Typography sx={{ fontSize: "12px" }}>Height</Typography>
          </Stack>
        </Stack>

        <TextField
          size="small"
          variant="standard"
          placeholder="Max Length"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ backgroundColor: "white", borderRadius: 1, padding: 1 }}
        />

        <Checkbox />

        <Checkbox />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Slider />
          <TextField
            size="small"
            variant="standard"
            placeholder="Opacity"
            InputProps={{
              disableUnderline: true,
            }}
            sx={{ backgroundColor: "white", borderRadius: 1, padding: 1 }}
          />
        </Stack>

        <Checkbox />
      </Stack>
    </Stack>
  );
});
