import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { AddCircleIcon } from "@/assets/icons/AddCircle";
import { Input, Label } from "@/components/Elements";
import type { UseControllerProps } from "@/types";

import type { AttachmentResponse, FormTryServiceSimple } from "../../../types";
import { ListAttachmentsItem } from "./ListAttachmentsItem";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  fieldName: string;
  isMultiple?: boolean;
  onSelect: (file: FileList, fieldName: string) => void;
}

export const InputAttachment = React.memo(function InputAttachment({
  fieldName,
  isMultiple,
  onSelect,
  ...rest
}: Props) {
  const { control, setValue } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value },
  } = useController({ control, ...rest });

  const files = value as AttachmentResponse[] | undefined;

  const handlePress = React.useCallback(
    (e) => {
      onSelect(e.target.files, fieldName);
    },
    [fieldName, onSelect]
  );

  const handleRemove = React.useCallback(
    (fileName: string) => {
      let updatedFiles;

      if (files && files.length > 1) {
        updatedFiles = files.filter((item) => item.fileName !== fileName);
      }

      setValue(`body.${fieldName}`, updatedFiles);
    },
    [fieldName, files, setValue]
  );

  return (
    <>
      {files && files.length > 0 ? (
        files.map((item) => (
          <ListAttachmentsItem file={item} onRemove={handleRemove} />
        ))
      ) : (
        <Stack alignItems="flex-start">
          <Input
            sx={{
              display: "none",
            }}
            type="file"
            accept="*/*"
            id="attachment"
            name="attachment"
            multiple={isMultiple}
            onChange={handlePress}
          />
          <Label htmlFor="attachment">
            <Box
              sx={(theme) => ({
                display: "flex",
                width: "64px",
                height: "64px",
                background: "white",
                border: `1px solid ${theme.palette.grey[600]}`,
                borderRadius: "6px",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <AddCircleIcon
                sx={(theme) => ({
                  color: theme.palette.grey[600],
                })}
              />
            </Box>
          </Label>
        </Stack>
      )}
    </>
  );
});
