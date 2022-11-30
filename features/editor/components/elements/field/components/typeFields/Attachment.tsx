import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AttachmentIcon } from "@/assets/icons";
import { AddAttachmentDialog } from "@/widgets/features/master/menu/attachment/AddAttachmentDialog";
import { useWidgetAttachment } from "@/widgets/hooks";
import type { Field, FileObject } from "@/widgets/types";

import { useFieldWidgetAttachment } from "../../hooks";
import { FileItem } from "../supports/FileItem";
import { FileModal } from "../supports/FileModal";

interface Props {
  name: string;
  error?: string;
  onChange?: (value: FileObject[]) => void;
  field: Field;
  value?: FileObject[];
  hideLabel?: boolean;
}

export const Attachment = React.memo(function Attachment({
  name,
  error,
  onChange,
  value,
  hideLabel,
}: Props) {
  const {
    currentAttachmentUrl,
    isFileModalOpen,
    handleAttachmentChange,
    handleFileModalClose,
    handleFileModalOpen,
    setCurrentAttachmentUrl,
  } = useFieldWidgetAttachment({ onChange });

  const {
    isDialogAddAttachmentOpen,
    isLoading: isUploadFileLoading,
    handleCloseAddAttachment,
    handleOpenAddAttachment,
    handleUploadAddAttachment,
  } = useWidgetAttachment({ onChange: handleAttachmentChange });

  const handleAttachFileClick: React.MouseEventHandler<HTMLLabelElement> =
    React.useCallback(() => {
      handleOpenAddAttachment({ attachments: value });
    }, [handleOpenAddAttachment, value]);

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          borderRadius: "6px",
          transition: 150,
        }}
      >
        {!hideLabel && (
          <Typography
            fontWeight="500"
            variant="subtitle1"
            sx={(theme) => ({ mb: "2px", fontSize: theme.typography.fontSize })}
          >
            {name}
          </Typography>
        )}

        <Stack direction="row" alignItems="flex-end">
          <Button
            onClick={handleAttachFileClick}
            variant="contained"
            component="label"
            sx={(theme) => ({
              width: "fit-content",
              background: "rgba(0,0,0,.2)",
              "&:hover": {
                background: "rgba(0,0,0,.15)",
              },
              color: theme.palette.grey[800],
            })}
            disableElevation
            size="small"
            startIcon={<AttachmentIcon />}
          >
            Attach File
          </Button>
        </Stack>

        <Grid container spacing={2} mt={2}>
          {value?.map((item, index) => (
            <Grid item xs={6} key={index}>
              <FileItem
                value={value}
                item={item}
                onChange={onChange}
                id={index}
                showModal={handleFileModalOpen}
              />
            </Grid>
          ))}
        </Grid>

        <Typography
          sx={{
            color: "error.main",
            fontSize: "10px",
            marginTop: 0.5,
          }}
        >
          {error}
        </Typography>
      </Stack>

      <AddAttachmentDialog
        isLoading={isUploadFileLoading}
        isOpen={isDialogAddAttachmentOpen}
        onClose={handleCloseAddAttachment}
        onUpload={handleUploadAddAttachment}
      />

      <FileModal
        isShown={isFileModalOpen}
        hideModal={handleFileModalClose}
        currentAttachmentUrl={currentAttachmentUrl}
        setCurrentAttachmentUrl={setCurrentAttachmentUrl}
        value={value}
        onChange={onChange}
      />
    </>
  );
});
