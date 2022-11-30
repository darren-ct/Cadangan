import Collapse from "@mui/material/Collapse";
import { green, grey, purple } from "@mui/material/colors";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { ChevronDownFilled, ChevronRightFilled } from "@/assets/icons";
import { Chip } from "@/components/Elements";
import { useDisclose } from "@/hooks";
import type { RoleType, Table } from "@/types";

import type { Role } from "../types";
import { ListRolesItem } from "./ListRolesItem";

interface Props {
  roleId: RoleType;
  roles: Role[];
  selectedServiceId: string;
  service: Table;
  onSelect: (serviceId: string) => void;
  onSelectRole: (roleId: RoleType) => void;
}

export const ListServicesItem = React.memo(function ListServicesItem({
  roleId,
  roles,
  selectedServiceId,
  service,
  onSelect,
  onSelectRole,
}: Props) {
  const { isOpen, onToggle, onOpen } = useDisclose();

  const handlePress = React.useCallback(() => {
    if (!selectedServiceId) {
      onSelect(service.id);
      onSelectRole("public");
    }

    onToggle();
  }, [onSelect, onSelectRole, onToggle, selectedServiceId, service.id]);

  const isActiveService = selectedServiceId === service.id;
  React.useEffect(() => {
    if (isActiveService && !isOpen) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveService, onOpen]);

  const isCustomService = service.isApiGateway;

  return (
    <Stack>
      <ListItem onClick={handlePress} sx={{ py: 0.75, cursor: "pointer" }}>
        <ListItemIcon sx={{ minWidth: "unset", paddingRight: 1 }}>
          {isOpen ? <ChevronDownFilled /> : <ChevronRightFilled />}
        </ListItemIcon>
        <ListItemText
          primary={service.name}
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
      </ListItem>

      <Collapse in={isOpen}>
        <List sx={{ py: 0, pl: 3, pr: 1 }}>
          {roles.map((item) => {
            const isActiveRole = roleId === item.id && isActiveService;

            return (
              <ListRolesItem
                key={item.id}
                isActive={isActiveRole}
                role={item}
                service={service}
                onSelect={onSelect}
                onSelectRole={onSelectRole}
              />
            );
          })}
        </List>
      </Collapse>
    </Stack>
  );
});
