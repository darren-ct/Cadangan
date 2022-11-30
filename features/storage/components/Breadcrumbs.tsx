import MUIBreadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { StorageObject } from "@/api/types";

interface Props {
  folders: StorageObject[];
  onNavigate: (index: number) => void;
  onSaveNewFolder: (value: string) => void;
}

export const Breadcrumbs = React.memo(function Breadcrumbs({
  folders,
  onNavigate,
  onSaveNewFolder,
}: Props) {
  const [newFolder, setNewFolder] = React.useState<string>("");
  const newFolderRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (newFolderRef.current) {
      newFolderRef.current.focus();
    }
  }, [newFolderRef]);

  const handleChangeNewFolder = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewFolder(e.target.value);
    },
    []
  );

  const handleSaveNewFolder = React.useCallback(() => {
    onSaveNewFolder(newFolder);
    setNewFolder("");
  }, [newFolder, onSaveNewFolder]);

  const handleKeyPres = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        handleSaveNewFolder();
      }

      if (e.key === "Escape") {
        setNewFolder("");
        handleSaveNewFolder();
      }
    },
    [handleSaveNewFolder]
  );

  return (
    <Stack
      direction="row"
      sx={(theme) => ({
        alignItems: "center",
        backgroundColor: theme.palette.grey[200],
        height: 72,
        px: 3,
        py: 2,
      })}
    >
      <MUIBreadcrumbs>
        {folders.map((folder, index) => {
          if (index === folders.length - 1) {
            if (folder.type === "input") {
              return (
                <TextField
                  ref={newFolderRef}
                  key={index}
                  size="small"
                  autoFocus
                  onBlur={handleSaveNewFolder}
                  onChange={handleChangeNewFolder}
                  onKeyDown={handleKeyPres}
                />
              );
            }

            return (
              <Typography key={`${index}-${folder.name}`}>
                {folder.name}
              </Typography>
            );
          }

          return (
            <Typography
              key={`${index}-${folder.name}`}
              sx={(theme) => ({
                color: theme.palette.primary.main,
                cursor: "pointer",
              })}
              onClick={() => onNavigate(index)}
            >
              {folder.name}
            </Typography>
          );
        })}
      </MUIBreadcrumbs>
    </Stack>
  );
});
