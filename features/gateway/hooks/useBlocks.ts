import * as React from "react";
import { useForm } from "react-hook-form";

import { useAddTable, useDeleteTable, useGetBlocks } from "@/api";
import { useGetRecordsByBlocks } from "@/api/features/records/hooks/useGetRecordsByBlocks";
import { useDisclose } from "@/hooks";
import { Block, Database, DatabaseBlocks, RecordRoles } from "@/types";

import { FormApi } from "../types";

interface Params {
  databaseIds: string[];
  databases: Database[];
  handleCloseTryServiceTabsByService: (service: Block) => void;
}

export const useBlock = ({
  databaseIds,
  databases,
  handleCloseTryServiceTabsByService,
}: Params) => {
  const [loadingCreateService, setLoadingCreateService] = React.useState(false);
  const [serviceFilter, setServiceFilter] = React.useState("");

  const {
    isOpen: isModalNewServiceOpen,
    onOpen: onOpenModalNewService,
    onClose: onCloseModalNewService,
  } = useDisclose();
  const {
    isOpen: isDialogDeleteServiceOpen,
    onOpen: onOpenDialogDeleteService,
    onClose: onCloseDialogDeleteService,
  } = useDisclose();
  const methods = useForm<FormApi>({
    defaultValues: {
      externalUrl: "",
      serviceName: "",
      selectedService: undefined,
      selectedDatabase: undefined,
    },
  });
  const { getValues, resetField, setValue } = methods;

  const databasesBlocks = useGetBlocks({ databases });
  const { mutateAsync: mutateAddtableAsync } = useAddTable({});
  const { mutateAsync: deleteService, isLoading: loadingDeleteService } =
    useDeleteTable({});

  const handleOpenAddService = React.useCallback(
    (databaseId: string) => {
      resetField("serviceName");

      const selectedDatabase = databases.find((item) => item.id === databaseId);
      if (selectedDatabase) {
        setValue("selectedDatabase", selectedDatabase);
      } else {
        setValue("selectedDatabase", databases[0]);
      }

      onOpenModalNewService();
    },
    [databases, onOpenModalNewService, resetField, setValue]
  );

  const handleOpenConfirmDeleteService = React.useCallback(
    (databaseId: string, service: Block) => {
      const selectedDatabase = databases.find((item) => item.id === databaseId);
      if (selectedDatabase) {
        setValue("selectedDatabase", selectedDatabase);
      } else {
        setValue("selectedDatabase", databases[0]);
      }

      setValue("selectedService", service);
      onOpenDialogDeleteService();
    },
    [databases, onOpenDialogDeleteService, setValue]
  );

  const handleDeleteService = React.useCallback(async () => {
    const selectedDatabase = getValues("selectedDatabase");
    const selectedService = getValues("selectedService");

    if (!selectedDatabase || !selectedService) {
      return;
    }

    try {
      await deleteService({
        databaseId: selectedDatabase.id,
        tableId: selectedService.id,
      });

      handleCloseTryServiceTabsByService(selectedService);
    } catch (error) {
      console.log(error);
    } finally {
      onCloseDialogDeleteService();
    }
  }, [
    deleteService,
    getValues,
    handleCloseTryServiceTabsByService,
    onCloseDialogDeleteService,
  ]);

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

  const { blocks, groupedBlocks, rolesBlocks } = React.useMemo(() => {
    const blocks: Block[] = [];
    const groupedBlocks: DatabaseBlocks[] = [];
    const rolesBlocks: Block[] = [];

    if (databasesBlocks.length) {
      databasesBlocks.forEach((item, index) => {
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
  }, [databases, databasesBlocks, getBlocks]);

  const dataRecords = useGetRecordsByBlocks({ blocks: rolesBlocks });

  const { publicRecordRoles, authenticatedRecordRoles, adminRecordRoles } =
    React.useMemo(() => {
      if (dataRecords.length !== databases.length) {
        return {
          publicRecordRoles: [],
          authenticatedRecordRoles: [],
          adminRecordRoles: [],
        };
      }

      let publicRecords: RecordRoles[] = [];

      dataRecords.forEach((item) => {
        const publicRecordItem = item.data?.data?.find(
          (recordItem) => recordItem.name === "public"
        );

        if (publicRecordItem) {
          publicRecords = [
            ...publicRecords,
            { ...publicRecordItem, blockId: item.data.blockId },
          ];
        }
      });

      let authenticatedRecords: RecordRoles[] = [];

      dataRecords.forEach((item) => {
        const authenticatedRecordItem = item.data?.data?.find(
          (recordItem) => recordItem.name === "authenticated"
        );
        if (authenticatedRecordItem) {
          authenticatedRecords = [
            ...authenticatedRecords,
            { ...authenticatedRecordItem, blockId: item.data.blockId },
          ];
        }
      });
      let adminRecords: RecordRoles[] = [];

      dataRecords.forEach((item) => {
        const adminRecordItem = item.data?.data?.find(
          (recordItem) => recordItem.name === "admin"
        );
        if (adminRecordItem) {
          adminRecords = [
            ...adminRecords,
            { ...adminRecordItem, blockId: item.data.blockId },
          ];
        }
      });

      return {
        publicRecordRoles: publicRecords,
        authenticatedRecordRoles: authenticatedRecords,
        adminRecordRoles: adminRecords,
      };
    }, [dataRecords, databases]);

  const handleNewService = React.useCallback(async () => {
    const serviceName = getValues("serviceName");
    const selectedDatabase = getValues("selectedDatabase");

    if (
      !databaseIds?.length ||
      !serviceName ||
      !rolesBlocks.length ||
      !selectedDatabase
    ) {
      return;
    }

    const selectedRoles = rolesBlocks.find(
      (item) => item.parentId === selectedDatabase.id
    );

    let selectedPublicRecordRoles: RecordRoles | undefined;
    let selectedAuthenticatedRecordRoles: RecordRoles | undefined;

    if (selectedRoles) {
      selectedPublicRecordRoles = publicRecordRoles.find(
        (item) => item.blockId === selectedRoles.id
      );
      selectedAuthenticatedRecordRoles = authenticatedRecordRoles.find(
        (item) => item.blockId === selectedRoles.id
      );
    }

    if (
      !selectedPublicRecordRoles?.permissions ||
      !selectedAuthenticatedRecordRoles?.permissions ||
      !selectedRoles
    ) {
      return;
    }

    try {
      setLoadingCreateService(true);
      await mutateAddtableAsync({
        databaseId: selectedDatabase.id,
        body: {
          projectId: selectedDatabase.id,
          parentId: selectedDatabase.id,
          parentTable: "project",
          blockType: "apiGateway",
          title: [[serviceName.trim()]],
          properties: { includeRecord: false },
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCreateService(false);
      onCloseModalNewService();
    }
  }, [
    authenticatedRecordRoles,
    databaseIds,
    getValues,
    mutateAddtableAsync,
    onCloseModalNewService,
    publicRecordRoles,
    rolesBlocks,
  ]);

  return {
    adminRecordRoles,
    authenticatedRecordRoles,
    blocks,
    groupedBlocks,
    isDialogDeleteServiceOpen,
    isModalNewServiceOpen,
    loadingCreateService,
    loadingDeleteService,
    methods,
    publicRecordRoles,
    rolesBlocks,
    serviceFilter,
    handleDeleteService,
    handleNewService,
    handleOpenAddService,
    handleOpenConfirmDeleteService,
    onCloseDialogDeleteService,
    onCloseModalNewService,
    setServiceFilter,
  };
};
