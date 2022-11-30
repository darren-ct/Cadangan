import { useRouter } from "next/router";
import * as React from "react";

import { useDeleteTable, useGetBlocks, useGetTables } from "@/api";
import { useDisclose } from "@/hooks";
import { useDefaultDatabase } from "@/hooks/useDefaultDB";
import type { Block, Database, ExplorerParams, Table } from "@/types";

export const useExplorerSidebar = () => {
  const router = useRouter();
  const { clusterId, tableId, databaseId } = router.query as ExplorerParams;
  const {
    isOpen: isDeleteConfirmDialogOpen,
    onOpen: onOpenDeleteConfirmDialog,
    onClose: onCloseDeleteConfirmDialog,
  } = useDisclose();
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null);
  const [loadingDeleteTable, setLoadingDeleteTable] = React.useState(false);
  const [tableFilter, setTableFilter] = React.useState("");

  const { databases: databaseData } = useDefaultDatabase({
    clusterId,
    databaseId,
  });
  const tablesData = useGetTables({ databases: databaseData });
  const blocksData = useGetBlocks({ databases: databaseData });
  const { mutateAsync: deleteTableAsync } = useDeleteTable({});

  const handleOpenAddTable = React.useCallback(
    (database: Database) => {
      router.push(
        `/explorer/clusters/${clusterId}/databases/${database.id}/tables/new`
      );
    },
    [clusterId, router]
  );

  const handleSelectTable = React.useCallback(
    (params: { tableId: string; dbId: string }) => {
      router.push(
        `/explorer/clusters/${clusterId}/databases/${params.dbId}/tables/${params.tableId}`
      );
    },
    [clusterId, router]
  );

  const handleOpenDelete = React.useCallback(
    (table?: Table) => {
      if (table) {
        setSelectedTable(table);
        onOpenDeleteConfirmDialog();
      }
    },
    [onOpenDeleteConfirmDialog]
  );

  const handleOpenEdit = React.useCallback(
    (table?: Table, database?: Database) => {
      if (table && database) {
        router.push(
          `/explorer/clusters/${clusterId}/databases/${database.id}/tables/${table.id}/edit`
        );
      }
    },
    [clusterId, router]
  );

  const handleCloseDelete = React.useCallback(() => {
    setSelectedTable(null);
    onCloseDeleteConfirmDialog();
  }, [onCloseDeleteConfirmDialog]);

  const { blocks, isLoading: isLoadingGetBlocks } = React.useMemo(() => {
    let dataBlock: Block[] = [];

    if (blocksData) {
      blocksData.forEach((item) => {
        if (item.data) {
          dataBlock = [...dataBlock, ...item.data];
        }
      });
    }

    const isLoading = !!blocksData.find((item) => item.isLoading);

    return {
      blocks: dataBlock,
      isLoading,
    };
  }, [blocksData]);

  const handleDeleteTable = React.useCallback(async () => {
    setLoadingDeleteTable(true);

    try {
      const selectedBlock = blocks.find(
        (item) => item.properties?.tableId === selectedTable?.id
      );

      await deleteTableAsync({
        databaseId: selectedBlock?.parentId,
        tableId: selectedBlock?.id,
      });

      if (selectedTable?.id === tableId) {
        router.push(
          `/explorer/clusters/${clusterId}/databases/${databaseId}/tables`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseDelete();
      setLoadingDeleteTable(false);
    }
  }, [
    blocks,
    clusterId,
    databaseId,
    deleteTableAsync,
    handleCloseDelete,
    router,
    selectedTable,
    tableId,
  ]);

  const handleAddDatabase = React.useCallback(() => {
    router.push({
      pathname: "/clusters/[clusterId]/databases/new",
      query: { clusterId },
    });
  }, [clusterId, router]);

  const { dbTables, isLoading: isLoadingGetTable } = React.useMemo(() => {
    const dbTables =
      tablesData.map((tbl) => {
        const tableData = tbl.data?.tables.filter(
          (item) =>
            !item.isApiGateway &&
            !(item.name === "Roles" && item.isLockedBySystem)
        );

        if (tableFilter) {
          return tableData.filter((item) =>
            item.name.toLowerCase().includes(tableFilter.toLowerCase())
          );
        }

        return tableData;
      }) ?? [];

    const isLoading = !!tablesData.find((tbl) => tbl.isLoading);

    return {
      dbTables,
      isLoading,
    };
  }, [tableFilter, tablesData]);

  const activeTableId = tableId;
  const currentDatabaseId = databaseId;
  const isLoadingGet = isLoadingGetBlocks || isLoadingGetTable;

  return {
    activeTableId,
    clusters: [],
    currentDatabaseId,
    databaseData,
    dbTables,
    isDeleteConfirmDialogOpen,
    isLoadingGet,
    loadingDeleteTable,
    selectedTable,
    tableFilter,
    handleAddDatabase,
    handleCloseDelete,
    handleDeleteTable,
    handleOpenAddTable,
    handleOpenDelete,
    handleOpenEdit,
    handleSelectTable,
    setTableFilter,
  };
};
