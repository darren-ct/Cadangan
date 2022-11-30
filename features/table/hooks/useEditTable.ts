import { useRouter } from "next/router";
import * as React from "react";
import { useForm } from "react-hook-form";

import { useGetBlockByDatabaseId, useUpdateTable } from "@/api";
import type { Block, ExplorerParams } from "@/types";

import type { TableForm } from "../types";

export const useEditTable = () => {
  const router = useRouter();
  const { clusterId, databaseId, tableId } = router.query as ExplorerParams;
  const [loadingCreateService, setLoadingCreateService] = React.useState(false);
  const [tableBlock, setTableBlock] = React.useState<Block | undefined>();

  const { data: blocksData } = useGetBlockByDatabaseId({
    databaseId: databaseId ?? "",
  });
  const { mutateAsync: mutateUpdateTable } = useUpdateTable({});

  const methods = useForm<TableForm>();
  const { handleSubmit, setValue } = methods;

  React.useEffect(() => {
    if (blocksData) {
      const selectedBlock = blocksData.find(
        (item) => item.properties?.tableId === tableId
      );

      if (selectedBlock) {
        setTableBlock(selectedBlock);
      }
    }
  }, [blocksData, tableBlock, tableId]);

  React.useEffect(() => {
    if (tableBlock) {
      setValue("name", tableBlock.title[0][0]);
    }
  }, [setValue, tableBlock]);

  const handleEditTable = React.useCallback(
    async ({ name }: TableForm) => {
      if (!name || !tableBlock) {
        return;
      }

      try {
        setLoadingCreateService(true);

        await mutateUpdateTable({
          databaseId,
          tableId: tableBlock.id,
          body: {
            title: [[name.trim()]],
          },
        });

        router.push(
          `/explorer/clusters/${clusterId}/databases/${databaseId}/tables/${tableId}`
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCreateService(false);
      }
    },
    [clusterId, databaseId, mutateUpdateTable, router, tableBlock, tableId]
  );

  const handleCancel = React.useCallback(() => {
    router.push(
      `/explorer/clusters/${clusterId}/databases/${databaseId}/tables`
    );
  }, [clusterId, databaseId, router]);

  return {
    loadingCreateService,
    methods,
    handleCancel,
    handleEditTable,
    handleSubmit,
  };
};
