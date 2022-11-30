import * as React from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";

import { Sidebar } from "../components";
import { useExplorerSidebar } from "../hooks/useExplorerSidebar";

export const ExplorerSidebar = React.memo(function ExplorerSidebar() {
  const {
    activeTableId,
    clusters,
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
  } = useExplorerSidebar();

  return (
    <>
      <Sidebar
        activeTableId={activeTableId}
        clusters={clusters ?? []}
        databaseId={currentDatabaseId}
        databases={databaseData ?? []}
        dbTables={dbTables}
        isLoading={isLoadingGet}
        tableFilter={tableFilter}
        onAddDatabase={handleAddDatabase}
        onDelete={handleOpenDelete}
        onEdit={handleOpenEdit}
        onTableAdd={handleOpenAddTable}
        onTableFilter={setTableFilter}
        onTableSelect={handleSelectTable}
      />
      <ConfirmDialog
        description={`Are you sure to delete this table ${selectedTable?.name}?`}
        isLoading={loadingDeleteTable}
        isOpen={isDeleteConfirmDialogOpen}
        title="Delete Confirmation"
        onClose={handleCloseDelete}
        onConfirm={handleDeleteTable}
      />
    </>
  );
});
