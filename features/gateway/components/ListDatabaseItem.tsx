import Collapse from "@mui/material/Collapse";
// import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

// import { AddIcon, ChevronDownFilled, ChevronRightFilled } from "@/assets/icons";
import { useDisclose } from "@/hooks";
import { Block, DatabaseBlocks, Method, RecordRoles } from "@/types";

import { ListServiceItem } from "./ListServiceItem";

interface Props {
  activeMethod: Method;
  databaseBlock: DatabaseBlocks;
  serviceFilter: string;
  publicRecordRoles: RecordRoles[];
  rolesTables: Block[];
  onAddMethod: (service: Block, gatewayMethods: Method[]) => void;
  onAddService: (databaseId: string) => void;
  onDeleteMethod: (method: Method, service: Block) => void;
  onDeleteService: (databaseId: string, service: Block) => void;
  onOpenTryService: (method: Method, service: Block) => void;
  onUpdateMethod: (method: Method, service: Block) => void;
}

export const ListDatabaseItem = React.memo(function ListDatabaseItem({
  activeMethod,
  databaseBlock,
  serviceFilter,
  publicRecordRoles,
  rolesTables,
  onAddMethod,
  // onAddService,
  onDeleteMethod,
  onDeleteService,
  onOpenTryService,
  onUpdateMethod,
}: Props) {
  const {
    isOpen,
    // onToggle
  } = useDisclose(true);

  // const handleAdd = React.useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.stopPropagation();
  //     onAddService(databaseBlock.id);
  //   },
  //   [databaseBlock.id, onAddService]
  // );

  const selectedRolesTable = rolesTables.find((rolesItem) =>
    databaseBlock.id.includes(rolesItem.parentId)
  );
  const selectedPublicRecordRoles = publicRecordRoles.find(
    (publicRolesItem) => publicRolesItem.blockId === selectedRolesTable?.id
  );

  const blocks = React.useMemo(() => {
    if (serviceFilter) {
      return databaseBlock.blocks.filter((item) =>
        item.title[0][0].toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }

    return databaseBlock.blocks;
  }, [databaseBlock, serviceFilter]);

  return (
    <>
      {/* <ListItem
        onClick={onToggle}
        sx={{
          px: 0,
          paddingBottom: 0,
          cursor: "pointer",
          visibility: "hidden",
        }}
      >
        <ListItemIcon sx={{ minWidth: "unset", paddingRight: 1 }}>
          {isOpen ? <ChevronDownFilled /> : <ChevronRightFilled />}
        </ListItemIcon>
        <ListItemText primary={databaseBlock.name} />
        <IconButton onClick={handleAdd}>
          <AddIcon />
        </IconButton>
      </ListItem> */}
      <Collapse in={isOpen}>
        <List sx={{ py: 0 }}>
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <ListServiceItem
                key={block.id}
                activeMethod={activeMethod}
                service={block}
                publicRecordRoles={selectedPublicRecordRoles}
                onAddMethod={onAddMethod}
                onDeleteMethod={onDeleteMethod}
                onDeleteService={onDeleteService}
                onOpenTryService={onOpenTryService}
                onUpdateMethod={onUpdateMethod}
              />
            ))
          ) : (
            <Stack sx={{ px: 3, pt: 2 }}>
              <Typography>No Service found</Typography>
            </Stack>
          )}
        </List>
      </Collapse>
    </>
  );
});
