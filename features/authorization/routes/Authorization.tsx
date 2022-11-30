import Box from "@mui/material/Box";
import { blue, green, orange, pink, red } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import { Method } from "@/types";

import { ListMethodsItem } from "../components/ListMethodsItem";
import { ListPathsItem } from "../components/ListPathsItem";
import { Sidebar } from "../components/Sidebar";
import { useAuthorization } from "../hooks/useAuthorization";
import { useDatabaseCluster } from "../hooks/useDatabaseCluster";

const methods: Method[] = [
  {
    id: "find",
    label: "GET",
    bgColor: blue[500],
    color: "white",
  },
  {
    id: "create",
    label: "POST",
    bgColor: green[500],
    color: "white",
  },
  {
    id: "update",
    label: "PATCH",
    bgColor: orange[500],
    color: "black",
  },
  {
    id: "delete",
    label: "DELETE",
    bgColor: red[500],
    color: "white",
  },
  {
    id: "websocket",
    label: "Websocket",
    bgColor: pink[500],
    color: "white",
    isWebsocket: true,
  },
  {
    id: "findOwn",
    label: "Only find their own data?",
    bgColor: "coolGray.50",
    color: "darkText",
    isRule: true,
  },
  {
    id: "updateOwn",
    label: "Prevent updating others' data?",
    bgColor: "coolGray.50",
    color: "darkText",
    isRule: true,
  },
  {
    id: "deleteOwn",
    label: "Prevent deleting others' data?",
    bgColor: "coolGray.50",
    color: "darkText",
    isRule: true,
  },
  {
    id: "findFile",
    label: "GET",
    bgColor: blue[500],
    color: "white",
    isFile: true,
  },
  {
    id: "createFile",
    label: "POST",
    bgColor: green[500],
    color: "white",
    isFile: true,
  },
  {
    id: "deleteFile",
    label: "DELETE",
    bgColor: red[500],
    color: "white",
    isFile: true,
  },
];

export const AuthorizationPage = () => {
  const { databases } = useDatabaseCluster();

  const {
    activeScheme,
    methods: formAuthProvider,
    isSystemService,
    permissions,
    selectedRoleId,
    selectedServiceId,
    serviceMethods,
    serviceTable,
    tables,
    handleSelectActiveScheme,
    handleSelectRole,
    handleSelectService,
    handleUpdatePermission,
    handleUpdatePermissionType,
  } = useAuthorization({ databases });

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        width: "100%",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <Stack direction="row" flex="1">
        <FormProvider {...formAuthProvider}>
          <Sidebar
            activeScheme={activeScheme}
            selectedRoleId={selectedRoleId}
            selectedServiceId={selectedServiceId}
            services={tables}
            onSelectActiveScheme={handleSelectActiveScheme}
            onSelectRole={handleSelectRole}
            onSelectService={handleSelectService}
          />
          <Stack
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[100],
              overflow: "auto",
            })}
            flex="1"
          >
            {!!selectedServiceId && !!serviceTable && (
              <Stack
                sx={{
                  p: 3,
                }}
                spacing={3}
              >
                {!isSystemService && activeScheme !== "ws" && (
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      flex="1"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontSize="1.25em" fontWeight={600}>
                        Permission type
                      </Typography>

                      <FormControl>
                        <RadioGroup
                          row
                          name="permission-type"
                          value={serviceTable.permissionType}
                          onChange={handleUpdatePermissionType}
                        >
                          <FormControlLabel
                            value="method"
                            control={<Radio />}
                            label="Method"
                          />
                          <FormControlLabel
                            value="path"
                            control={<Radio />}
                            label="Path"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </Stack>
                )}
                {serviceTable.permissionType !== "path" ||
                activeScheme === "ws" ? (
                  <Stack spacing={2}>
                    <Typography fontSize="1.25em" fontWeight={600}>
                      Permissions
                    </Typography>

                    {methods
                      .filter((item) => {
                        if (selectedServiceId === "storage") {
                          return item.isFile;
                        }

                        return !item.isRule &&
                          !item.isFile &&
                          activeScheme === "http"
                          ? !item.isWebsocket
                          : item.isWebsocket;
                      })
                      .map((item) => {
                        return (
                          <ListMethodsItem
                            key={item.id}
                            method={item}
                            permissions={permissions}
                            serviceId={selectedServiceId}
                            onToggle={handleUpdatePermission}
                          />
                        );
                      })}
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <Typography fontSize="1.25em" fontWeight={600}>
                      Permissions
                    </Typography>

                    {serviceMethods.map((item) => {
                      return (
                        <ListPathsItem
                          key={item.id}
                          method={item}
                          permissions={permissions}
                          serviceId={selectedServiceId}
                          onToggle={handleUpdatePermission}
                        />
                      );
                    })}
                  </Stack>
                )}

                {activeScheme === "http" &&
                  selectedServiceId !== "storage" &&
                  serviceTable.permissionType === "method" && (
                    <Stack spacing={2}>
                      <Typography fontSize="1.25em" fontWeight={600}>
                        Rules
                      </Typography>
                      {methods
                        .filter((item) => item.isRule)
                        .map((item) => {
                          return (
                            <ListMethodsItem
                              key={item.id}
                              method={item}
                              permissions={permissions}
                              serviceId={selectedServiceId}
                              onToggle={handleUpdatePermission}
                            />
                          );
                        })}
                    </Stack>
                  )}
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </Stack>
    </Box>
  );
};
