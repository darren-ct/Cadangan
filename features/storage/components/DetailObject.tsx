import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as React from "react";

import { StorageObject } from "@/api/types";
import { CloseIcon, CopyIcon, OpenExternalLinkIcon } from "@/assets/icons";
import { Button } from "@/components/Elements";
import { useCopy } from "@/hooks/useCopy";

import { fileSize } from "../utils/fileSize";
import { FileIcon } from "./FileIcon";

dayjs.extend(localizedFormat);

interface Props {
  selectedObject: StorageObject;
  setSelectedObject: (obj: StorageObject | null) => void;
}

export const DetailObject = React.memo(function DetailObject({
  selectedObject,
  setSelectedObject,
}: Props) {
  const { isCopy, handleCopy } = useCopy();

  return (
    <Collapse orientation="horizontal" in={!!selectedObject} unmountOnExit>
      <Box
        sx={(theme) => ({
          borderLeftColor: theme.palette.grey[300],
          borderLeftStyle: "solid",
          borderLeftWidth: 1,
          width: 500,
          overflow: "hidden",
          height: "100%",
        })}
      >
        <Box sx={{ px: 3, py: 2, textAlign: "right" }}>
          <IconButton onClick={() => setSelectedObject(null)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack
          gap={2}
          sx={{
            width: "100%",
            height: "calc(100vh - 310px)",
            paddingBottom: 2,
            overflow: "auto",
            "&::-webkit-scrollbar ": {
              width: 0,
              backgroundColor: "transparent",
            },
          }}
        >
          {selectedObject && (
            <>
              <Box sx={{ px: 3, textAlign: "center" }}>
                {selectedObject?.mimeType?.includes("image") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedObject.url}
                    width="100%"
                    alt={selectedObject.name}
                  />
                ) : (
                  <FileIcon
                    mimeType={selectedObject.mimeType ?? ""}
                    sx={{ fontSize: 200 }}
                  />
                )}
              </Box>
              <Box sx={{ px: 3 }}>
                <Typography>{selectedObject.name}</Typography>
                <Typography variant="body2">
                  {selectedObject?.mimeType ?? selectedObject?.type} -{" "}
                  {fileSize(selectedObject.size)}
                </Typography>
              </Box>
              <Box sx={{ px: 3 }}>
                <Typography>Added on</Typography>
                <Typography variant="body2">
                  {dayjs(selectedObject.createdAt).format("LLL")}
                </Typography>
              </Box>
              <Stack flexDirection="row" gap={2} sx={{ px: 3 }}>
                <Link
                  href={selectedObject.url}
                  download={selectedObject.name}
                  sx={{ textDecoration: "none" }}
                  target="__blank"
                >
                  <Button
                    variant="outlined"
                    startIcon={<OpenExternalLinkIcon />}
                  >
                    Open
                  </Button>
                </Link>
                <Tooltip title={isCopy ? "Copied" : ""}>
                  <Button
                    variant="outlined"
                    startIcon={<CopyIcon />}
                    onClick={() => handleCopy(selectedObject.url)}
                  >
                    Copy
                  </Button>
                </Tooltip>
              </Stack>
              {/* <Divider />
              <Box sx={{ px: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box> */}
            </>
          )}
        </Stack>
      </Box>
    </Collapse>
  );
});
