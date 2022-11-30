import * as React from "react";
import { useForm } from "react-hook-form";

import {
  useGetBlocks,
  useGetTables,
  useUpdateRecord,
  useUpdateTablePermissionType,
} from "@/api";
import { useGetRecordsByBlocks } from "@/api/features/records/hooks/useGetRecordsByBlocks";
import { useMethodsList } from "@/hooks/useMethodsList";
import type {
  Block,
  Database,
  DatabaseBlocks,
  Method,
  RecordRoles,
  RoleType,
  Table,
} from "@/types";

import { FormAuthorization, SchemeType } from "../types";

interface Props {
  databases: Database[];
}

export const useAuthorization = ({ databases }: Props) => {
  const [activeScheme, setActiveScheme] = React.useState<SchemeType>("http");

  const databaseId = databases[0]?.id;

  const dataQueriesBlocks = useGetBlocks({
    databases,
  });

  const dataQueriesTables = useGetTables({
    databases,
  });

  const getBlocks = React.useCallback((dataBlocks: Block[]) => {
    let data = dataBlocks;

    const systemBlocks = data.filter((item) => item.isLockedBySystem);
    const rolesBlocks = systemBlocks.filter(
      (item) => item.title?.[0]?.[0] === "Roles"
    );
    const usersBlocks = systemBlocks.filter(
      (item) => item.title?.[0]?.[0] === "Users"
    );

    if (rolesBlocks.length > 0 && usersBlocks.length > 0) {
      let authBlocks: Block[] = [];
      let storageBlocks: Block[] = [];

      usersBlocks.forEach((item) => {
        const authBlock: Block = {
          id: `${item.parentId}-auth`,
          blockType: "table",
          title: [["Authentication"]],
          properties: {
            tableId: "",
          },
          content: null,
          parentId: `${item.parentId}-users`,
          parentTable: "project",
          isLockedBySystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          parent: item,
        };
        const storageBlock: Block = {
          id: `${item.parentId}-storage`,
          blockType: "table",
          title: [["Storage"]],
          properties: {
            tableId: "",
          },
          content: null,
          parentId: `${item.parentId}-files`,
          parentTable: "project",
          isLockedBySystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          parent: "filesBlock",
        };

        authBlocks = [...authBlocks, authBlock];
        storageBlocks = [...storageBlocks, storageBlock];
      });

      const otherBlocks = data.filter(
        (item) =>
          !rolesBlocks.find((rolesItem) => rolesItem.id === item.id) &&
          !usersBlocks.find((usersItem) => usersItem.id === item.id)
      );

      data = [...authBlocks, ...usersBlocks, ...otherBlocks];

      if (data.length > 0) {
        data.splice(authBlocks.length, 0, ...storageBlocks);
      }
    }

    return { blocks: data, rolesBlocks };
  }, []);

  const { blocks, rolesBlocks } = React.useMemo(() => {
    const blocks: Block[] = [];
    const groupedBlocks: DatabaseBlocks[] = [];
    const rolesBlocks: Block[] = [];

    if (dataQueriesBlocks.length) {
      dataQueriesBlocks.forEach((item, index) => {
        if (item.data) {
          const { blocks: dbBlocks, rolesBlocks: dbRolesBlocks } = getBlocks([
            ...item.data,
          ]);

          groupedBlocks.push({
            id: databases[index].id,
            blocks: dbBlocks,
            name: databases[index].name,
          });
          blocks.push(...dbBlocks);
          rolesBlocks.push(...dbRolesBlocks);
        }
      });
    }

    return { blocks, groupedBlocks, rolesBlocks };
  }, [dataQueriesBlocks, databases, getBlocks]);

  const dataQueriesRecords = useGetRecordsByBlocks({ blocks: rolesBlocks });

  const { mutate: updateRecord } = useUpdateRecord({ type: "roles" });
  const { mutate: updatePermissionType } = useUpdateTablePermissionType({});

  const methods = useForm<FormAuthorization>({
    defaultValues: {
      selectedRoleId: "public",
      selectedServiceId: undefined,
    },
  });
  const { reset, setValue, watch } = methods;
  const selectedRoleId = watch("selectedRoleId");
  const selectedServiceId = watch("selectedServiceId");

  const selectedService = blocks.find(
    (item) => item.properties.tableId === selectedServiceId
  );

  const { serviceMethods } = useMethodsList({
    databases,
    service: selectedService,
  });

  const tables = React.useMemo(() => {
    let data: Table[] = [];

    if (dataQueriesTables) {
      data = dataQueriesTables[0]?.data?.tables.slice(0) ?? [];

      if (data) {
        const systemTables = data.filter((item) => item.isLockedBySystem);
        const rolesTable = systemTables.find((item) => item.name === "Roles");
        const usersTable = systemTables.find((item) => item.name === "Users");

        if (rolesTable?.id && usersTable?.id) {
          const storageTable: Table = {
            id: "storage",
            name: "Storage",
            version: 0,
            isApiGateway: false,
            isLockedBySystem: true,
            parent: "filesTable",
            permissionType: "method",
          };
          const otherTables = data.filter(
            (item) => item.id !== rolesTable.id && item.id !== usersTable.id
          );

          data = [usersTable, ...otherTables];

          if (activeScheme === "http") {
            data = [storageTable, ...data];
          }
        }
      }
    }

    return data;
  }, [activeScheme, dataQueriesTables]);

  React.useEffect(() => {
    if (!tables.length) {
      reset({ selectedRoleId: "public", selectedServiceId: undefined });
      return;
    }

    const tableIdx = tables.findIndex((item) => item.id === selectedServiceId);

    if (selectedServiceId && tableIdx !== -1) {
      return;
    }

    if (activeScheme === "http") {
      setValue("selectedServiceId", "storage");
    } else if (tables?.[0]?.id) {
      setValue("selectedServiceId", tables[0].id);
    }
  }, [activeScheme, reset, selectedServiceId, setValue, tables]);

  const handleSelectActiveScheme = React.useCallback((type: SchemeType) => {
    setActiveScheme(type);
  }, []);

  const handleSelectRole = React.useCallback(
    (roleId: RoleType) => {
      setValue("selectedRoleId", roleId);
    },
    [setValue]
  );

  const handleSelectService = React.useCallback(
    (serviceId: string) => {
      setValue("selectedServiceId", serviceId);
    },
    [setValue]
  );

  const dataRecords = React.useMemo(() => {
    if (dataQueriesRecords.length > 0) {
      return dataQueriesRecords[0]?.data?.data ?? [];
    }

    return null;
  }, [dataQueriesRecords]);

  const recordRoles = React.useMemo(() => {
    if (!dataRecords) {
      return null;
    }

    const record = (dataRecords as RecordRoles[]).find(
      (item) => item.name === selectedRoleId
    );

    if (record) {
      return record;
    }

    return null;
  }, [dataRecords, selectedRoleId]);

  const rolesTableId = React.useMemo(() => {
    if (rolesBlocks.length === 0) {
      return null;
    }

    const rolesBlock = rolesBlocks[0];

    if (rolesBlock?.properties?.tableId) {
      return rolesBlock.properties.tableId;
    }

    return null;
  }, [rolesBlocks]);

  const serviceTable = tables.find((item) => item.id === selectedServiceId);

  const handleUpdatePermission = React.useCallback(
    (method: Method, isRule?: boolean) => {
      if (
        !databaseId ||
        !recordRoles?.permissions ||
        !selectedServiceId ||
        !rolesBlocks
      ) {
        return;
      }

      let methodId = method.id;

      if (method.isFile) {
        methodId = method.id.replace("File", "");
      }

      const permissions = recordRoles.permissions.slice(0);

      let permission = `${selectedServiceId}:${methodId}`;

      if (serviceTable.permissionType === "path" && activeScheme === "http") {
        permission = `${selectedServiceId}:${methodId}:${method.type}${
          isRule ? "Own" : ""
        }`;
      }

      if (!permissions.includes(permission)) {
        permissions.push(permission);
      } else {
        permissions.splice(permissions.indexOf(permission), 1);
        if (!isRule) {
          if (permissions.indexOf(permission + "Own") !== -1) {
            permissions.splice(permissions.indexOf(permission + "Own"), 1);
          }
        }
      }

      updateRecord({
        dbId: databaseId,
        tableId: rolesTableId,
        id: recordRoles._id,
        body: { permissions },
      });
    },
    [
      activeScheme,
      databaseId,
      recordRoles,
      rolesBlocks,
      rolesTableId,
      selectedServiceId,
      serviceTable,
      updateRecord,
    ]
  );

  const handleUpdatePermissionType = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!databaseId || !selectedServiceId || !rolesBlocks) {
        return;
      }

      updatePermissionType({
        databaseId,
        tableId: selectedServiceId,
        permissionType: e.target.value as "path" | "method",
      });
    },
    [databaseId, rolesBlocks, selectedServiceId, updatePermissionType]
  );

  const permissions = React.useMemo(() => {
    let data: string[] = [];

    if (dataRecords) {
      const record = (dataRecords as RecordRoles[]).find(
        (item) => item.name === selectedRoleId
      );

      if (record?.permissions) {
        data = record.permissions.filter((item) => {
          const str = item.split(":");

          return str[0] === selectedServiceId;
        });
      }
    }

    return data;
  }, [dataRecords, selectedRoleId, selectedServiceId]);

  const isSystemService =
    selectedService?.isLockedBySystem || selectedServiceId === "storage";

  return {
    activeScheme,
    methods,
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
  };
};
