import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

export const FormPlaceholder = React.memo(function FormPlaceholder() {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: "100%",
        padding: "24px",
        background: "white",
        height: "100%",
      }}
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        <Typography>Field 1</Typography>
        <TextField disabled size="small" fullWidth />
      </Stack>
      <Stack direction="column">
        <Typography>Field 2</Typography>
        <TextField disabled size="small" fullWidth />
      </Stack>
      <Stack direction="column">
        <Typography>Field 3</Typography>
        <TextField disabled size="small" fullWidth />
      </Stack>
      <Button variant="contained" fullWidth>
        SAVE
      </Button>
    </Stack>
  );
});
