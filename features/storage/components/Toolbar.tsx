import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import MUIToolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

import {
  AddFolderIcon,
  ReloadIcon,
  // SortIcon,
  UploadIcon,
} from "@/assets/icons";
import { Button } from "@/components/Elements";
// import { SearchInput } from "@/components/SearchInput";

interface Props {
  onCreateFolder: () => void;
  onReload: () => void;
  onUpload: () => void;
}

const ButtonToolbar = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  flex: 1,
  whiteSpace: "nowrap",
}));

export const Toolbar = React.memo(function Toolbar({
  onCreateFolder,
  onReload,
  onUpload,
}: Props) {
  return (
    <MUIToolbar
      sx={(theme) => ({
        borderBottomColor: theme.palette.grey[300],
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      <Typography variant="h6">My Bucket</Typography>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Box>
          <ButtonToolbar startIcon={<ReloadIcon />} onClick={onReload}>
            Reload
          </ButtonToolbar>
        </Box>
        {/* <Box>
          <ButtonToolbar startIcon={<SortIcon />}>Sort</ButtonToolbar>
        </Box> */}
        <Box>
          <ButtonToolbar startIcon={<UploadIcon />} onClick={onUpload}>
            Upload File
          </ButtonToolbar>
        </Box>
        <Box>
          <ButtonToolbar startIcon={<AddFolderIcon />} onClick={onCreateFolder}>
            Create Folder
          </ButtonToolbar>
        </Box>
        {/* <SearchInput /> */}
      </Stack>
    </MUIToolbar>
  );
});
