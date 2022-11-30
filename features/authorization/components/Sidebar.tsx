import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Drawer } from "@/components/Drawer";
// import { RoleType } from "@/features/gateway/types";
import type { RoleType, Table } from "@/types";

import type { Role, Scheme, SchemeType } from "../types";
import { ListSchemesItem } from "./ListSchemesItem";
import { ListServicesItem } from "./ListServicesItem";

const schemes: Scheme[] = [
  { id: "http", name: "HTTP" },
  { id: "ws", name: "WS" },
];

const roles: Role[] = [
  {
    id: "public",
    name: "Public",
  },
  {
    id: "authenticated",
    name: "Authenticated",
  },
  {
    id: "admin",
    name: "Admin",
  },
];

interface Props {
  activeScheme: SchemeType;
  selectedRoleId: RoleType;
  selectedServiceId: string;
  services: Table[];
  onSelectActiveScheme: (type: SchemeType) => void;
  onSelectRole: (roleId: RoleType) => void;
  onSelectService: (serviceId: string) => void;
}

export const Sidebar = React.memo(function Sidebar({
  activeScheme,
  selectedRoleId,
  selectedServiceId,
  services,
  onSelectActiveScheme,
  onSelectRole,
  onSelectService,
}: Props) {
  return (
    <Drawer>
      <Stack
        sx={{
          overflow: "hidden",
        }}
        spacing={1}
      >
        <Stack
          sx={{
            p: 3,
            pb: 0,
          }}
          direction="row"
        >
          {schemes.map((item) => {
            const isActive = item.id === activeScheme;

            return (
              <ListSchemesItem
                key={item.id}
                isActive={isActive}
                scheme={item}
                onSelect={onSelectActiveScheme}
              />
            );
          })}
        </Stack>
        <Stack sx={{ flex: "1", pt: 2, overflow: "hidden" }} spacing={1}>
          <Typography
            sx={{
              pl: 3,
            }}
            variant="subtitle1"
          >
            All Auths
          </Typography>
          {services.length > 0 && (
            <Stack sx={{ flex: "1", overflow: "auto" }}>
              <List sx={{ py: 0 }}>
                {services.map((item) => {
                  return (
                    <ListServicesItem
                      key={item.id}
                      roleId={selectedRoleId}
                      roles={roles}
                      selectedServiceId={selectedServiceId}
                      service={item}
                      onSelect={onSelectService}
                      onSelectRole={onSelectRole}
                    />
                  );
                })}
              </List>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
});
