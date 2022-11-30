import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import {
  ChevronDownIcon,
  CloseIcon,
  FailedIcon,
  SuccessIcon,
} from "@/assets/icons";

import { ProgressInfo } from "../types";
import { FileIcon } from "./FileIcon";

interface Props {
  isOpen: boolean;
  progressInfo: ProgressInfo[];
  clearFilesUpload: () => void;
}

const Wrapper = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  right: 25,
  width: 362,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  transition: "ease .3s",
}));

export const UploadProgress = React.memo(function UploadProgress({
  isOpen,
  progressInfo,
  clearFilesUpload,
}: Props) {
  const [isListOpen, setListOpen] = React.useState<boolean>(isOpen);

  React.useEffect(() => {
    setListOpen(isOpen);
  }, [isOpen]);

  const toggleListOpen = () => setListOpen((prev) => !prev);

  const totalFilesError = React.useMemo(() => {
    return progressInfo.filter((item) => !!item.error).length;
  }, [progressInfo]);

  const totalFilesUploaded = React.useMemo(() => {
    return progressInfo.filter((item) => item.isFinished).length;
  }, [progressInfo]);

  const totalFilesUploading = React.useMemo(() => {
    return progressInfo.filter(
      (item) => item.percentage < 100 || (!item.isFinished && !item.error)
    ).length;
  }, [progressInfo]);

  return (
    <Wrapper sx={{ height: isOpen ? "auto" : 0 }}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        sx={(theme) => ({
          padding: 2,
          backgroundColor: theme.palette.grey[900],
          borderRadius: "4px 4px 0 0",
          color: "white",
        })}
      >
        <Typography color="white" fontWeight={500}>
          {totalFilesUploading > 0
            ? `Uploading ${totalFilesUploading} item`
            : totalFilesUploaded
            ? `${totalFilesUploaded} uploads complete ${
                totalFilesError ? "&" : ""
              }`
            : ""}
          {totalFilesError ? `${totalFilesError} uploads failed` : ""}
        </Typography>
        <Stack flexDirection="row">
          <IconButton sx={{ padding: 0, px: 1 }} onClick={toggleListOpen}>
            <ChevronDownIcon
              color="inherit"
              sx={{
                fill: "white",
                transition: "ease .3s",
                transform: isListOpen ? "none" : "rotate(180deg)",
              }}
            />
          </IconButton>
          <IconButton sx={{ padding: 0, px: 1 }} onClick={clearFilesUpload}>
            <CloseIcon
              color="inherit"
              sx={{
                fill: "white",
                transition: "ease",
                transform: isListOpen ? "none" : "rotate(180deg)",
              }}
            />
          </IconButton>
        </Stack>
      </Stack>
      <Collapse in={isListOpen}>
        <List>
          {progressInfo.map((info, index) => (
            <ListItem key={`${info.fileName}-${index}`}>
              <ListItemIcon sx={{ minWidth: "unset", mr: 1 }}>
                <FileIcon mimeType={info.mimeType} />
              </ListItemIcon>
              <Tooltip title={info.error ?? info.fileName} placement="bottom">
                <ListItemText
                  primary={info.fileName}
                  primaryTypographyProps={{ noWrap: true }}
                  secondary={info.error ?? ""}
                  secondaryTypographyProps={{ noWrap: true, color: "red" }}
                />
              </Tooltip>
              <Box sx={{ paddingLeft: 1, paddingTop: 0.5, marginBottom: -0.5 }}>
                {info.error ? (
                  <FailedIcon color="error" />
                ) : info.percentage === 100 && info.isFinished ? (
                  <SuccessIcon color="success" />
                ) : (
                  <CircularProgress
                    size={24}
                    variant="determinate"
                    value={info.percentage}
                  />
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Wrapper>
  );
});
