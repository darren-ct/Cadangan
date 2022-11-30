import TreeItem, { treeItemClasses, TreeItemProps } from "@mui/lab/TreeItem";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon, DatabaseIcon, EditIcon, TableIcon } from "@/assets/icons";
import { DeleteIcon } from "@/assets/icons/Delete";
import type { Database, Table } from "@/types";

interface Props extends TreeItemProps {
  database: Database;
  isActive?: boolean;
  isLockedBySystem?: boolean;
  table?: Table;
  onClickDelete: (table?: Table) => void;
  onClickEdit: (table?: Table, database?: Database) => void;
}

interface DBTreeProps extends TreeItemProps {
  isActive?: boolean;
  database: Database;
  onTableAdd: (database: Database) => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(1)} 0`,
  display: "flex",
  alignItems: "center",
  "& > svg": {
    margin: `0 ${theme.spacing(1)}`,
  },
  "& div": {
    flexGrow: 1,
    textAlign: "right",
    visibility: "hidden",
  },
  "&:hover div": {
    visibility: "visible",
  },
}));

export const DBTree = React.memo(function DBTree({
  database,
  onTableAdd,
  ...props
}: DBTreeProps) {
  const handleAddTable = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onTableAdd(database);
    },
    [database, onTableAdd]
  );

  return (
    <TreeItem
      sx={(theme) => ({
        "& .MuiTreeItem-content": {
          padding: `0 ${theme.spacing(3)}`,
        },
        "& .MuiCollapse-root": {
          margin: `0 ${theme.spacing(3)}`,
        },
      })}
      {...props}
      label={
        <StyledBox sx={{ my: 0 }}>
          <DatabaseIcon sx={{ fill: "none", fontSize: 24 }} fill="none" />
          <Typography variant="body2" fontWeight="500">
            {props.label}
          </Typography>

          <div>
            <IconButton size="small" onClick={handleAddTable}>
              <AddIcon />
            </IconButton>
          </div>
        </StyledBox>
      }
    />
  );
});

export const TableTree = React.memo(function TableTree({
  database,
  isActive,
  isLockedBySystem,
  table,
  onClickDelete,
  onClickEdit,
  ...props
}: Props) {
  const handleClickEdit = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClickEdit(table, database);
    },
    [database, onClickEdit, table]
  );

  const handleClickDelete = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClickDelete(table);
    },
    [onClickDelete, table]
  );

  return (
    <TreeItem
      {...props}
      sx={(theme) => ({
        marginBottom: 0.75,
        borderRadius: 1.5,
        overflow: "hidden",
        background: isActive
          ? theme.palette.grey[200]
          : theme.palette.background.default,
        [`& .${treeItemClasses.selected}`]: {
          backgroundColor: `${theme.palette.grey[200]} !important`,
        },
        [`& .${treeItemClasses.content} .${treeItemClasses.iconContainer}`]: {
          display: "none",
        },
        [`& .${treeItemClasses.label}`]: {
          paddingLeft: "0px !important",
        },
        "&:hover .table-label": {
          width: "calc(100% - 50px)",
        },
        "&:hover .table-action": {
          display: "flex",
        },
      })}
      label={
        <Stack
          sx={{
            "& .action-button": {
              visibility: "hidden",
            },
            "&:hover .action-button": {
              visibility: "visible",
            },
            padding: 0,
          }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <StyledBox className="table-label" sx={{ maxWidth: "100%" }}>
            <TableIcon sx={{ fontSize: 16 }} />
            <Typography variant="subtitle1" noWrap={true}>
              {props.label}
            </Typography>
          </StyledBox>
          {!isLockedBySystem && (
            <Stack
              direction="row"
              className="table-action"
              sx={{ display: "none" }}
            >
              <IconButton
                onClick={handleClickEdit}
                className="action-button"
                size="small"
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={handleClickDelete}
                className="action-button"
                size="small"
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      }
    />
  );
});
