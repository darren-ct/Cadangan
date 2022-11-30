import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { EditIcon } from "@/assets/icons";
import { DeleteIcon } from "@/assets/icons/Delete";
import { Block, Method } from "@/types";

interface Props {
  activeMethod: Method;
  method: Method;
  service: Block;
  onDeleteMethod: (method: Method, service: Block) => void;
  onOpenTryService: (method: Method, service: Block) => void;
  onUpdateMethod: (method: Method, service: Block) => void;
}

export const ListMethodsItem = React.memo(function ListMethodsItem({
  activeMethod,
  method,
  service,
  onDeleteMethod,
  onOpenTryService,
  onUpdateMethod,
}: Props) {
  const handleDeleteMethod = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDeleteMethod(method, service);
    },
    [method, onDeleteMethod, service]
  );

  const handleOpenTryService = React.useCallback(() => {
    onOpenTryService(method, service);
  }, [method, onOpenTryService, service]);

  const handleUpdateMethod = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onUpdateMethod(method, service);
    },
    [method, onUpdateMethod, service]
  );

  const isEditable = !method.isFile && !method.isUser;
  const isActive = activeMethod?.id === method.id;

  return (
    <ListItem
      sx={(theme) => ({
        my: 0.5,
        py: 0.75,
        pr: 0.5,
        ":hover .method-list-description": {
          maxWidth: isEditable ? "120px" : "150px",
        },
        ":hover .method-list-actions": {
          display: "flex",
        },
        ":hover": {
          background: theme.palette.grey[200],
        },
        background: isActive ? theme.palette.grey[200] : undefined,
        borderRadius: "6px",
        cursor: "pointer",
      })}
      onClick={handleOpenTryService}
    >
      <Stack
        sx={{
          width: "100%",
        }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          className="method-list-description"
          sx={{ maxWidth: "150px" }}
          direction="row"
          alignItems="center"
        >
          <Chip
            size="small"
            label={method.label}
            sx={{
              backgroundColor: method.bgColor,
              color: method.color,
              marginRight: 1,
              borderRadius: 1,
            }}
          />
          <ListItemText
            primary={method.path}
            primaryTypographyProps={{ noWrap: true, fontSize: "1em" }}
          />
        </Stack>
        {isEditable && (
          <Stack
            className="method-list-actions"
            sx={{
              display: "none",
            }}
            direction="row"
            alignItems="center"
          >
            <IconButton size="small" onClick={handleUpdateMethod}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDeleteMethod}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </ListItem>
  );
});
