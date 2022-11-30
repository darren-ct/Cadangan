import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { DeleteIcon } from "@/assets/icons/Delete";
import { EditIcon } from "@/assets/icons/Edit";
import { Image } from "@/components/Elements";
import type { FileObject } from "@/types";

interface Props {
  id: number;
  item: FileObject;
  onChange: (value: FileObject[]) => void;
  value?: FileObject[];
  showModal: (value: FileObject) => void;
}

export const FileItem = React.memo(function FileItem({
  item,
  onChange,
  value,
  showModal,
}: Props) {
  // Booleans
  const [onHover, setOnHover] = React.useState<boolean>(false);
  const [onEdit, setOnEdit] = React.useState<boolean>(false);

  const changeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newArray = value.map((file) => {
        if (file.fileName === item.fileName) {
          return { ...item, fileName: e.target.value };
        } else {
          return file;
        }
      });

      onChange(newArray);
    },
    [value, item, onChange]
  );

  const deleteHandler = React.useCallback(() => {
    const newFiles = value.filter((file) => file.fileName !== item.fileName);
    onChange(newFiles);
  }, [value, item, onChange]);

  const clickHandler: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback(() => {
      showModal(item);
    }, [item, showModal]);

  return (
    <div
      onMouseEnter={setOnHover.bind(this, true)}
      onMouseLeave={setOnHover.bind(this, false)}
    >
      <Stack>
        <div onClick={clickHandler}>
          <Stack
            width="100%"
            sx={{
              padding: "8px 48px",
              cursor: "pointer",
              borderRadius: "6px",
              boxShadow: "1px 1px 12px rgba(0,0,0,.15)",
            }}
          >
            {item.url && (
              <Image
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
                src={item.url}
                alt={item.fileName}
              />
            )}
          </Stack>
        </div>
        {!onEdit ? (
          <Stack
            mt={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="500" variant="subtitle2">
              {item.fileName}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ visibility: onHover ? "visible" : "hidden" }}
            >
              <Tooltip title="Delete">
                <IconButton onClick={deleteHandler}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={setOnEdit.bind(this, true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        ) : (
          <TextField
            value={item.fileName}
            onChange={changeHandler}
            onBlur={setOnEdit.bind(this, false)}
            size="small"
            sx={{
              fontSize: "12px",
              mt: 1,
            }}
          />
        )}
      </Stack>
    </div>
  );
});
