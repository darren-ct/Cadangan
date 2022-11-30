import Chip from "@mui/material/Chip";
import { lightBlue } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { DeleteIcon } from "@/assets/icons/Delete";
import { getFileExtension } from "@/utils/string";

import type { AttachmentResponse } from "../../../types";

interface Props {
  file: AttachmentResponse;
  onRemove: (fileName: string) => void;
}

export const ListAttachmentsItem = React.memo(function ListAttachmentsItem({
  file,
  onRemove,
}: Props) {
  const handlePress = React.useCallback(() => {
    onRemove(file.fileName);
  }, [file, onRemove]);

  return (
    <Stack
      sx={{
        mb: 2,
      }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Stack direction="row" alignItems="center">
        <Chip
          size="small"
          label={getFileExtension(file.fileName).toUpperCase()}
          sx={{
            backgroundColor: lightBlue[200],
            color: "black",
            height: "36px",
            marginRight: 1,
            borderRadius: 1,
            fontWeight: 600,
          }}
        />
        <Typography fontSize="0.875em">{file.fileName}</Typography>
      </Stack>
      <IconButton onClick={handlePress}>
        <DeleteIcon
          sx={(theme) => ({
            color: theme.palette.error.main,
            fontSize: "18px",
          })}
        />
      </IconButton>
    </Stack>
  );
});
