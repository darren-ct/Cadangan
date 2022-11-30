import TreeView from "@mui/lab/TreeView";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ArrowDownIcon, ArrowLeftIcon, EditIcon } from "@/assets/icons";
import { Button } from "@/components/Elements";
import { SearchInput } from "@/components/SearchInput";
import { useStore } from "@/hooks/useStore";
import type { Cluster, Database, Table } from "@/types";

import { TableTree } from "./TreeItem";

export const DRAWER_WIDTH = 260;

type Props = {
  activeTableId?: string;
  clusters: Cluster[];
  databaseId?: string;
  databases: Database[];
  dbTables: (Table[] | undefined)[];
  isLoading?: boolean;
  tableFilter: string;
  onAddDatabase: () => void;
  onDelete: (table?: Table) => void;
  onEdit: (table?: Table, database?: Database) => void;
  onTableAdd: (database: Database) => void;
  onTableFilter: (string) => void;
  onTableSelect: (params: { tableId: string; dbId: string }) => void;
};

export const Sidebar = React.memo(function Sidebar({
  activeTableId,
  databaseId,
  databases,
  dbTables,
  isLoading,
  tableFilter,
  onDelete,
  onEdit,
  onTableAdd,
  onTableFilter,
  onTableSelect,
}: Props) {
  const isSidebarExpanded = useStore((state) => state.isSidebarExpanded);
  const [expandedTree, setExpandedTree] = React.useState<string[]>([
    databaseId ?? "",
  ]);

  React.useEffect(() => {
    if (databaseId) {
      setExpandedTree([databaseId]);
    }
  }, [databaseId]);

  const handleToggle = React.useCallback(
    (_event: React.SyntheticEvent, nodeIds: string[]) => {
      setExpandedTree(nodeIds);
    },
    []
  );

  const handleTableFilter = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onTableFilter(event.target.value);
    },
    [onTableFilter]
  );

  const database = React.useMemo(() => {
    if (databases.length) {
      return databases[0];
    }

    return null;
  }, [databases]);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarExpanded}
      sx={{
        width: isSidebarExpanded ? DRAWER_WIDTH : 0,
        transition: "width 300ms",
        flexShrink: 0,
        ".MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          position: "relative",
        },
      }}
    >
      {/* <ClusterSelect clusters={clusters} /> */}

      <Toolbar sx={{ flexDirection: "column", my: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          color="inherit"
          sx={(theme) => ({
            justifyContent: "left",
            borderColor: theme.palette.grey[400],
          })}
          startIcon={<EditIcon fontSize="small" />}
          onClick={() => onTableAdd(database)}
        >
          New Table
        </Button>
        <SearchInput
          sx={(theme) => ({ marginTop: theme.spacing(1) })}
          value={tableFilter}
          onChange={handleTableFilter}
        />
      </Toolbar>

      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: `0 ${theme.spacing(3)}`,
          "& svg": {
            color: theme.palette.grey[600],
            visibility: "hidden",
          },
          "&:hover svg": {
            visibility: "visible",
          },
        })}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          All Tables
        </Typography>
        {/* <IconButton size="small" onClick={handleAddDatabase}>
          <AddIcon />
        </IconButton> */}
      </Box>
      {!(databases && dbTables && database) ? (
        isLoading ? (
          <Stack sx={{ px: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={24}
                sx={{ marginBottom: 2, borderRadius: 1 }}
              />
            ))}
          </Stack>
        ) : (
          <Stack sx={{ px: 3 }}>
            <Typography>No Tables found</Typography>
          </Stack>
        )
      ) : (
        <TreeView
          sx={{ flexGrow: 1, maxWidth: 400, overflowY: "auto", mx: 3 }}
          aria-label="database tree"
          defaultExpanded={expandedTree}
          expanded={expandedTree}
          onNodeToggle={handleToggle}
          defaultCollapseIcon={<ArrowDownIcon />}
          defaultExpandIcon={<ArrowLeftIcon />}
        >
          {dbTables?.[0]?.length > 0 ? (
            dbTables[0].map((table) => (
              <TableTree
                key={table.id}
                label={table.name}
                database={database}
                nodeId={table.id}
                table={table}
                isActive={activeTableId === table.id}
                isLockedBySystem={table.isLockedBySystem}
                onClick={() =>
                  onTableSelect({ tableId: table.id, dbId: database?.id })
                }
                onClickDelete={onDelete}
                onClickEdit={onEdit}
              />
            ))
          ) : (
            <Stack sx={{ px: 3, pt: 1 }}>
              <Typography>No Table found</Typography>
            </Stack>
          )}
          {/* {databases?.map((db, index) => (
            <DBTree
              key={db.id}
              database={db}
              label={db.name}
              nodeId={db.id}
              onTableAdd={onTableAdd}
            >
              {dbTables?.[index]?.map((table) => (
                <TableTree
                  key={table.id}
                  label={table.name}
                  database={db}
                  nodeId={table.id}
                  table={table}
                  isActive={activeTableId === table.id}
                  isLockedBySystem={table.isLockedBySystem}
                  onClick={() =>
                    onTableSelect({ tableId: table.id, dbId: db.id })
                  }
                  onClickDelete={onDelete}
                  onClickEdit={onEdit}
                />
              ))}
            </DBTree>
          ))} */}
        </TreeView>
      )}
    </Drawer>
  );
});
