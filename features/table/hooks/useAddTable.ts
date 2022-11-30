import { useRouter } from "next/router";
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  useAddTable as useAddTableMutation,
  useGetRecords,
  useGetTables,
} from "@/api";
import { useDefaultDatabase } from "@/hooks/useDefaultDB";
import type { ExplorerParams, RecordRoles } from "@/types";

interface DatabaseForm {
  databaseName: string | null;
}

export const useAddTable = () => {
  const router = useRouter();
  const { clusterId, databaseId } = router.query as ExplorerParams;
  const [loadingCreateService, setLoadingCreateService] = React.useState(false);
  const [rolesTableId, setRolesTableId] = React.useState<string | null>(null);
  const [authenticatedRecordRoles, setAuthenticatedRecordRoles] =
    React.useState<RecordRoles>();

  const methods = useForm<DatabaseForm>();
  const { handleSubmit } = methods;
  const isGetRecordsEnabled = !!databaseId && !!rolesTableId;

  const { databases: databaseData } = useDefaultDatabase({
    clusterId,
    databaseId,
  });
  const tablesData = useGetTables({ databases: databaseData });
  const { data: dataRoleRecords } = useGetRecords({
    customQueryName: "getRolesRecords",
    dbId: databaseId ?? "",
    tableId: rolesTableId ?? "",
    query: "",
    enabled: isGetRecordsEnabled,
  });

  const { mutateAsync: mutateAddtableAsync } = useAddTableMutation({
    dbId: databaseId ?? "",
  });

  const handleAddTable = React.useCallback(
    async (formTable: DatabaseForm) => {
      const { databaseName } = formTable;

      if (
        !databaseId ||
        !databaseName ||
        !rolesTableId ||
        !authenticatedRecordRoles?.permissions
      ) {
        return;
      }

      try {
        setLoadingCreateService(true);

        const blocks = await mutateAddtableAsync({
          body: {
            projectId: databaseId,
            parentId: databaseId,
            parentTable: "project",
            blockType: "table",
            title: [[databaseName.trim()]],
            properties: { includeRecord: false },
          },
        });

        if (!blocks[0]?.id || !blocks[0].properties?.tableId) {
          return;
        }

        router.push(
          `/explorer/clusters/${clusterId}/databases/${databaseId}/tables/${blocks[0].properties.tableId}`
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCreateService(false);
      }
    },
    [
      authenticatedRecordRoles,
      clusterId,
      databaseId,
      mutateAddtableAsync,
      rolesTableId,
      router,
    ]
  );

  const handleCancel = React.useCallback(() => {
    router.push(
      `/explorer/clusters/${clusterId}/databases/${databaseId}/tables`
    );
  }, [clusterId, databaseId, router]);

  React.useEffect(() => {
    if (databaseId && databaseData) {
      const currentTablesData = tablesData.find(
        (item) => item.data?.databaseId === databaseId
      )?.data;

      if (currentTablesData) {
        const rolesTable = currentTablesData.tables.find(
          (item) => item.name === "Roles" && item.isLockedBySystem
        );

        if (rolesTable) {
          setRolesTableId(rolesTable.id);
        }
      }
    }
  }, [databaseData, databaseId, tablesData]);

  React.useEffect(() => {
    if (!dataRoleRecords) {
      return;
    }

    const authenticatedRecord = (dataRoleRecords as RecordRoles[]).find(
      (item) => item.name === "authenticated"
    );

    if (authenticatedRecord) {
      setAuthenticatedRecordRoles(authenticatedRecord);
    }
  }, [dataRoleRecords]);

  return {
    loadingCreateService,
    methods,
    handleAddTable,
    handleCancel,
    handleSubmit,
  };
};
