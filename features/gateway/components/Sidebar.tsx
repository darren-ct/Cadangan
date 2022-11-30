import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
// import List from "@mui/material/List";
import OutlinedInput from "@mui/material/OutlinedInput";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import Scrollbars from "rc-scrollbars";
import * as React from "react";

import { EditIcon, SearchIcon } from "@/assets/icons";
import { Drawer } from "@/components/Drawer";
import { Button } from "@/components/Elements";
import { Block, DatabaseBlocks, Method, RecordRoles } from "@/types";

import { ListDatabaseItem } from "./ListDatabaseItem";

interface Props {
  activeMethod: Method;
  serviceFilter: string;
  groupedBlocks: DatabaseBlocks[];
  publicRecordRoles: RecordRoles[];
  rolesTables: Block[];
  onAddMethod: (service: Block, gatewayMethods: Method[]) => void;
  onAddService: (databaseId: string) => void;
  onDeleteMethod: (method: Method, service: Block) => void;
  onDeleteService: (databaseId: string, service: Block) => void;
  onOpenTryService: (method?: Method, service?: Block) => void;
  onServiceFilter: (string) => void;
  onUpdateMethod: (method: Method, service: Block) => void;
}

export const Sidebar = React.memo(function Sidebar({
  activeMethod,
  serviceFilter,
  groupedBlocks,
  publicRecordRoles,
  rolesTables,
  onAddMethod,
  onAddService,
  onDeleteMethod,
  onDeleteService,
  onOpenTryService,
  onServiceFilter,
  onUpdateMethod,
}: Props) {
  const handleAdd = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onAddService(groupedBlocks[0]?.id);
    },
    [groupedBlocks, onAddService]
  );
  const handleServiceFilter = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onServiceFilter(e.target.value);
    },
    [onServiceFilter]
  );

  return (
    <Drawer>
      <Box
        sx={(theme) => ({
          // position: "sticky",
          // top: 0,
          // zIndex: 1000,
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Toolbar sx={{ flexDirection: "column", marginY: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            color="inherit"
            sx={(theme) => ({
              justifyContent: "left",
              borderColor: theme.palette.grey[400],
            })}
            onClick={handleAdd}
            startIcon={<EditIcon fontSize="small" />}
          >
            New API
          </Button>
          <OutlinedInput
            fullWidth
            placeholder="Search..."
            size="small"
            sx={(theme) => ({ marginTop: theme.spacing(1) })}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            }
            inputProps={{ sx: { fontSize: "0.8125rem" } }}
            value={serviceFilter}
            onChange={handleServiceFilter}
          />
        </Toolbar>
        <Box sx={{ my: 1, px: 3 }}>
          <Typography variant="subtitle1">All APIs</Typography>
        </Box>
      </Box>
      <Box sx={{ pl: 3, pr: 2, overflow: "auto" }}>
        {/* <List sx={{ py: 0 }}> */}
        {groupedBlocks.map((dbBlock) => (
          <ListDatabaseItem
            key={dbBlock.id}
            activeMethod={activeMethod}
            databaseBlock={dbBlock}
            serviceFilter={serviceFilter}
            publicRecordRoles={publicRecordRoles}
            rolesTables={rolesTables}
            onAddMethod={onAddMethod}
            onAddService={onAddService}
            onDeleteMethod={onDeleteMethod}
            onDeleteService={onDeleteService}
            onOpenTryService={onOpenTryService}
            onUpdateMethod={onUpdateMethod}
          />
        ))}
        {/* </List> */}
      </Box>
    </Drawer>
  );
});
