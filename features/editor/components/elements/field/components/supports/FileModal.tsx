import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ArrowLeftIcon } from "@/assets/icons/ArrowLeft";
import { CloseIcon } from "@/assets/icons/Close";
import { DeleteIcon } from "@/assets/icons/Delete";
import { EditIcon } from "@/assets/icons/Edit";
import { Image } from "@/components/Elements";
import { FileObject } from "@/widgets/types";

interface Prop {
  isShown: boolean;
  hideModal: () => void;
  currentAttachmentUrl: string | null;
  setCurrentAttachmentUrl: React.Dispatch<React.SetStateAction<string>>;
  value: FileObject[];
  onChange: (value: FileObject[]) => void;
}

export const FileModal = React.memo(function FileModal({
  isShown,
  hideModal,
  currentAttachmentUrl,
  setCurrentAttachmentUrl,
  value,
  onChange,
}: Prop) {
  const [onEdit, setOnEdit] = React.useState<boolean>(false);

  const selectedFile = React.useMemo(() => {
    const currentFile = value?.find(
      (item) => item.url === currentAttachmentUrl
    );

    return currentFile;
  }, [currentAttachmentUrl, value]);

  const nextAttachmentUrl = React.useMemo(() => {
    if (!value || !selectedFile) return;

    const currentIndex = value.findIndex(
      (item) => item.url === selectedFile.url
    );

    if (currentIndex === value.length - 1) return;

    return value[currentIndex + 1].url;
  }, [value, selectedFile]);

  const previousAttachmentUrl = React.useMemo(() => {
    if (!value || !selectedFile) return;

    const currentIndex = value.findIndex(
      (item) => item.url === selectedFile.url
    );

    if (currentIndex === 0) return;

    return value[currentIndex - 1].url;
  }, [value, selectedFile]);

  const leftArrowClick = React.useCallback(() => {
    setCurrentAttachmentUrl(previousAttachmentUrl);
  }, [previousAttachmentUrl, setCurrentAttachmentUrl]);

  const rightArrowClick = React.useCallback(() => {
    setCurrentAttachmentUrl(nextAttachmentUrl);
  }, [nextAttachmentUrl, setCurrentAttachmentUrl]);

  const changeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newArray = value.map((file) => {
        if (file.fileName === selectedFile?.fileName) {
          return { ...selectedFile, fileName: e.target.value };
        } else {
          return file;
        }
      });

      onChange(newArray);
    },
    [value, selectedFile, onChange]
  );

  const deleteHandler = React.useCallback(() => {
    const newFiles = value.filter(
      (file) => file.fileName !== selectedFile?.fileName
    );
    onChange(newFiles);
    hideModal();
    setCurrentAttachmentUrl(null);
  }, [value, selectedFile, hideModal, onChange, setCurrentAttachmentUrl]);

  const editHandler = React.useCallback(() => {
    setOnEdit(true);
  }, []);

  const hideModal2 = React.useCallback(() => {
    setOnEdit(false);
  }, []);

  return (
    <Modal
      open={isShown}
      onClose={hideModal}
      sx={{ backgroundColor: "rgba(0,0,0,.9)" }}
    >
      <>
        <Stack
          direction="column"
          spacing={2}
          height="100vh"
          justifyContent="space-between"
          alignItems="center"
          mx="auto"
          width="100%"
          maxWidth={800}
          paddingY={4}
          paddingX={8}
        >
          <span
            onClick={hideModal}
            style={{ position: "fixed", right: "16px", top: "16px" }}
          >
            <CloseIcon sx={{ color: "white", cursor: "pointer" }} />
          </span>

          {!!previousAttachmentUrl && (
            <span
              onClick={leftArrowClick}
              style={{
                top: "50%",
                left: 88,
                position: "fixed",
                transform: "translateY(-50%) rotate(180deg)",
                cursor: "pointer",
              }}
            >
              <ArrowLeftIcon sx={{ color: "white", fontSize: "100px" }} />
            </span>
          )}

          {!!nextAttachmentUrl && (
            <span
              onClick={rightArrowClick}
              style={{
                top: "50%",
                right: 88,
                position: "fixed",
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
            >
              <ArrowLeftIcon sx={{ color: "white", fontSize: "100px" }} />
            </span>
          )}

          <Tooltip title="Remove attachment">
            <IconButton
              sx={{
                bottom: "16px",
                right: "48px",
                position: "fixed",
                cursor: "pointer",
              }}
              onClick={deleteHandler}
            >
              <DeleteIcon sx={{ color: "white", fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Rename attachment">
            <IconButton
              sx={{
                bottom: "16px",
                right: "16px",
                position: "fixed",
                cursor: "pointer",
              }}
              onClick={editHandler}
            >
              <EditIcon sx={{ color: "white", fontSize: "20px" }} />
            </IconButton>
          </Tooltip>

          <Typography color="white" sx={{ fontSize: "18px" }}>
            {selectedFile?.fileName}
          </Typography>

          <Image
            src={selectedFile?.url}
            sx={{
              margin: "48px 0 32px 0",
              objectFit: "cover",
              height: 400,
              width: "100%",
            }}
            alt="file Image"
          />

          <Stack direction="row" spacing={2} alignItems="center">
            {value?.map((item) => (
              <div
                onClick={() => setCurrentAttachmentUrl(item.url)}
                key={item.url}
                style={{
                  cursor: "pointer",
                  border: `4px solid ${
                    item.url === currentAttachmentUrl ? "white" : "transparent"
                  }`,
                  borderRadius: "4px",
                  overflow: "hidden",
                  width: 52,
                  height: 52,
                }}
              >
                <Image src={item.url} sx={{ width: "100%" }} alt="File image" />
              </div>
            ))}
          </Stack>
        </Stack>

        <Modal
          open={onEdit}
          onClose={hideModal2}
          sx={{
            backgroundColor: "rgba(0,0,0,.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            bgcolor={"white"}
            padding={4}
            borderRadius={2}
            width={"100%"}
            maxWidth={440}
          >
            <form
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                size="small"
                sx={{ flex: "1" }}
                value={selectedFile?.fileName}
                onChange={changeHandler}
              />
              <Button
                variant="contained"
                sx={{ marginLeft: "8px" }}
                onClick={hideModal2}
              >
                Rename
              </Button>
            </form>
          </Box>
        </Modal>
      </>
    </Modal>
  );
});
