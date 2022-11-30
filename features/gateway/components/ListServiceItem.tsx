import Collapse from "@mui/material/Collapse";
import { green, grey, purple } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import * as React from "react";

import {
  AddIcon,
  ChevronDownFilled,
  ChevronRightFilled,
  DeleteIcon,
} from "@/assets/icons";
import { Chip } from "@/components/Elements";
import { useDisclose } from "@/hooks";
import { useMethodsList } from "@/hooks/useMethodsList";
import { Block, Method, RecordRoles } from "@/types";

import { useDatabaseCluster } from "../hooks/useDatabaseCluster";
import { ListMethodsItem } from "./ListMethodsItem";

interface Props {
  activeMethod: Method;
  service: Block;
  publicRecordRoles: RecordRoles;
  onAddMethod: (service: Block, gatewayMethods: Method[]) => void;
  onDeleteMethod: (method: Method, service: Block) => void;
  onDeleteService: (databaseId: string, service: Block) => void;
  onOpenTryService: (method: Method, service: Block) => void;
  onUpdateMethod: (method: Method, service: Block) => void;
}

export const ListServiceItem = React.memo(function ListServiceItem({
  activeMethod,
  service,
  onAddMethod,
  onDeleteMethod,
  onDeleteService,
  onOpenTryService,
  onUpdateMethod,
}: Props) {
  const { isOpen, onToggle } = useDisclose();
  const { databases } = useDatabaseCluster();
  const { isParentFiles, isParentUsers, serviceMethods } = useMethodsList({
    databases,
    service,
  });

  const handleAddMethod = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onAddMethod(service, serviceMethods);
    },
    [onAddMethod, service, serviceMethods]
  );

  const handleDeleteTable = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDeleteService(service.parentId, service);
    },
    [onDeleteService, service]
  );

  const isCustomService = service.blockType === "apiGateway";

  return (
    <>
      <ListItem
        onClick={onToggle}
        sx={{
          px: 0,
          paddingBottom: 0,
          cursor: "pointer",
          ":hover .services-actions": {
            display: "flex",
          },
          ":hover .label-container": {
            ...(!isParentUsers && !isParentFiles
              ? { maxWidth: "calc(100% - 60px)" }
              : {}),
          },
          minHeight: "45px",
        }}
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
            direction="row"
            alignItems="center"
            className="label-container"
            sx={{ maxWidth: "100%" }}
          >
            <ListItemIcon sx={{ minWidth: "unset", paddingRight: 1 }}>
              {isOpen ? <ChevronDownFilled /> : <ChevronRightFilled />}
            </ListItemIcon>
            <ListItemText
              primary={service.title[0]}
              primaryTypographyProps={{ noWrap: true }}
              sx={{ flex: "unset", marginRight: 1 }}
            />
            {service.isLockedBySystem && (
              <Chip
                label="System"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: grey[50],
                  borderColor: grey[500],
                  color: grey[900],
                }}
              />
            )}
            {isCustomService && (
              <Chip
                label="Custom"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: purple[50],
                  borderColor: purple[500],
                  color: purple[900],
                }}
              />
            )}
            {!service.isLockedBySystem && !isCustomService && (
              <Chip
                label="Database"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: green[50],
                  borderColor: green[500],
                  color: green[900],
                }}
              />
            )}
          </Stack>

          <Stack
            className="services-actions"
            sx={{
              display: "none",
            }}
            direction="row"
          >
            {!isParentUsers && !isParentFiles && (
              <IconButton size="small" onClick={handleAddMethod}>
                <AddIcon
                  sx={{
                    color: "inherit",
                    fontSize: "inherit",
                  }}
                />
              </IconButton>
            )}
            {!service.isLockedBySystem && isCustomService && (
              <IconButton size="small" onClick={handleDeleteTable}>
                <DeleteIcon
                  sx={{
                    color: "inherit",
                    fontSize: "inherit",
                  }}
                />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </ListItem>
      <Collapse in={isOpen}>
        <List>
          {serviceMethods?.map((item) => (
            <ListMethodsItem
              key={item.id}
              activeMethod={activeMethod}
              method={item}
              service={service}
              onDeleteMethod={onDeleteMethod}
              onOpenTryService={onOpenTryService}
              onUpdateMethod={onUpdateMethod}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
});
