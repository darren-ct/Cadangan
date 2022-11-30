import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as React from "react";

import { Input } from "@/components/Elements";

import { Breadcrumbs } from "../components/Breadcrumbs";
import { DetailObject } from "../components/DetailObject";
import { FileIcon } from "../components/FileIcon";
import { Toolbar } from "../components/Toolbar";
import { UploadProgress } from "../components/UploadProgress";
import { useStorage } from "../hooks/useStorage";
import { fileSize } from "../utils/fileSize";

dayjs.extend(localizedFormat);

const Main = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export const Storage = React.memo(function Storage() {
  const {
    isLoading,
    progressInfos,
    selectedFolder,
    selectedObject,
    storageObjects,
    clearFilesUpload,
    handleNavigateFolder,
    handleNewFolder,
    handleObjectClick,
    handleSaveFolder,
    handleUploadFiles,
    refetchGetStorages,
    setSelectedObject,
  } = useStorage();

  const uploadRef = React.useRef<HTMLInputElement | null>(null);

  const handleTriggerUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  return (
    <Stack
      sx={(theme) => ({
        backgroundColor: theme.palette.grey[200],
        flexGrow: 1,
        overflow: "hidden",
      })}
    >
      <Box sx={{ display: "flex", flexGrow: 1, padding: 3 }}>
        <Input
          ref={uploadRef}
          type="file"
          multiple
          sx={{ display: "none" }}
          onChange={(e) => handleUploadFiles(e.target.files)}
        />
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            borderRadius: 2,
          }}
        >
          <Toolbar
            onCreateFolder={handleNewFolder}
            onReload={refetchGetStorages}
            onUpload={handleTriggerUpload}
          />
          <Breadcrumbs
            folders={selectedFolder}
            onNavigate={handleNavigateFolder}
            onSaveNewFolder={handleSaveFolder}
          />
          <Main>
            <TableContainer
              sx={{ flex: "1 1", maxHeight: "calc(100vh - 230px)" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Created at</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    [0, 1, 2, 3, 4].map((i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={4}>
                          <Skeleton variant="text" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : storageObjects && storageObjects.length ? (
                    storageObjects
                      .sort((item) => (item.children ? -1 : 1))
                      .sort(
                        (a, b) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                      )
                      .map((item) => (
                        <TableRow
                          key={item.name}
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleObjectClick(item)}
                        >
                          <TableCell>
                            <Stack flexDirection="row" gap={2}>
                              <FileIcon mimeType={item.mimeType ?? item.type} />{" "}
                              {item.name}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {item.type === "file" && fileSize(item.size)}
                          </TableCell>
                          <TableCell>
                            {item.type === "file"
                              ? item.mimeType ?? "unknown"
                              : ""}
                          </TableCell>
                          <TableCell>
                            {dayjs(item.createdAt).format("LLL")}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{
                          textAlign: "center",
                          borderBottom: "none",
                          paddingTop: 8,
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          sx={{ fontSize: 16, marginBottom: 0.5 }}
                        >
                          No folder or file
                        </Typography>
                        <Typography variant="body2">
                          Create your first folder and upload a file.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <DetailObject
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          </Main>
        </Card>
      </Box>
      <UploadProgress
        isOpen={progressInfos.length > 0}
        progressInfo={progressInfos}
        clearFilesUpload={clearFilesUpload}
      />
    </Stack>
  );
});
