import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

import { RoleType, Table } from "@/types";

import type { Role } from "../types";

interface Props {
  isActive: boolean;
  role: Role;
  service: Table;
  onSelect: (serviceId: string) => void;
  onSelectRole: (roleId: RoleType) => void;
}

export const ListRolesItem = React.memo(function ListRolesItem({
  isActive,
  role,
  service,
  onSelect,
  onSelectRole,
}: Props) {
  const handlePress = React.useCallback(() => {
    onSelect(service.id);
    onSelectRole(role.id);
  }, [onSelect, onSelectRole, role, service]);

  return (
    <ListItem
      sx={(theme) => ({
        my: 0.5,
        py: 0.25,
        pr: 0.5,
        ":hover": {
          background: theme.palette.grey[200],
        },
        background: isActive ? theme.palette.grey[200] : undefined,
        borderRadius: "6px",
        cursor: "pointer",
      })}
      onClick={handlePress}
    >
      <ListItemText
        primary={role.name}
        primaryTypographyProps={{ noWrap: true, fontSize: "1em" }}
      />
    </ListItem>
  );
});
