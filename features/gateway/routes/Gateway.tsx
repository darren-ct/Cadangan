import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import { ConfirmDialog } from "@/components/ConfirmDialog";

import { ModalNewMethod } from "../components/ModalNewMethod";
import { ModalNewService } from "../components/ModalNewService";
import { ModalUpdateMethod } from "../components/ModalUpdateMethod";
import { Sidebar } from "../components/Sidebar";
import { TryService } from "../components/tryService/TryService";
import { useBlock } from "../hooks/useBlocks";
import { useDatabaseCluster } from "../hooks/useDatabaseCluster";
import { useMethods } from "../hooks/useMethods";
import { useTryService } from "../hooks/useTryService";

export const GatewayPage = React.memo(function GatewayPage() {
  const { databaseIds, databases } = useDatabaseCluster();

  const {
    activeMethod,
    activeTryServiceType,
    // isTryServiceOpen,
    methodTabList,
    methodTabServiceIds,
    // handleCloseTryService,
    handleCloseTryServiceTab,
    handleOpenTryService,
    handleOpenTryServiceTab,
    handleCloseTryServiceTabsByService,
    handleSelectTryServiceType,
  } = useTryService();

  const {
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
  } = useBlock({ databaseIds, databases, handleCloseTryServiceTabsByService });

  const {
    isDialogDeleteMethodOpen,
    isModalNewMethodOpen,
    isModalUpdateMethodOpen,
    loadingCreateMethod,
    loadingDeleteMethod,
    loadingUpdateMethod,
    methods: formMethodProps,
    handleDeleteMethod,
    handleOpenDialogDeleteMethod,
    handleOpenModalNewMethod,
    handleOpenModalUpdateMethod,
    handleSaveNewMethod,
    handleUpdateMethod,
    onCloseDialogDeleteMethod,
    onCloseModalNewMethod,
    onCloseModalUpdateMethod,
  } = useMethods({
    adminRecordRoles,
    authenticatedRecordRoles,
    databaseIds,
    publicRecordRoles,
    rolesBlocks,
    handleOpenTryService,
  });

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
      <Sidebar
        activeMethod={activeMethod}
        serviceFilter={serviceFilter}
        groupedBlocks={publicRecordRoles.length > 0 ? groupedBlocks : []}
        publicRecordRoles={publicRecordRoles}
        rolesTables={rolesBlocks}
        onAddMethod={handleOpenModalNewMethod}
        onAddService={handleOpenAddService}
        onDeleteMethod={handleOpenDialogDeleteMethod}
        onDeleteService={handleOpenConfirmDeleteService}
        onOpenTryService={handleOpenTryService}
        onServiceFilter={setServiceFilter}
        onUpdateMethod={handleOpenModalUpdateMethod}
      />
      <Box
        style={{
          flexGrow: "1",
          display: "flex",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {activeMethod && blocks.length > 0 ? (
          <TryService
            activeMethod={activeMethod}
            activeTryServiceType={activeTryServiceType}
            databases={databases}
            methodTabList={methodTabList}
            methodTabServiceIds={methodTabServiceIds}
            services={blocks}
            onCloseTryServiceTab={handleCloseTryServiceTab}
            onOpenTryServiceTab={handleOpenTryServiceTab}
            onSelectTryServiceType={handleSelectTryServiceType}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>Please select API to try</Typography>
          </Box>
        )}
      </Box>
      <FormProvider {...formMethodProps}>
        <ModalNewMethod
          isModalOpen={isModalNewMethodOpen}
          isLoading={loadingCreateMethod}
          onCloseModal={onCloseModalNewMethod}
          onSubmit={handleSaveNewMethod}
        />
        <ModalUpdateMethod
          isModalOpen={isModalUpdateMethodOpen}
          isLoading={loadingUpdateMethod}
          onCloseModal={onCloseModalUpdateMethod}
          onUpdate={handleUpdateMethod}
        />
      </FormProvider>
      <FormProvider {...methods}>
        <ModalNewService
          databases={databases}
          isLoading={loadingCreateService}
          open={isModalNewServiceOpen}
          onClose={onCloseModalNewService}
          onSubmit={handleNewService}
        />
      </FormProvider>
      <ConfirmDialog
        description="Are you sure to delete this method?"
        isLoading={loadingDeleteMethod}
        isOpen={isDialogDeleteMethodOpen}
        title="Delete Confirmation"
        onClose={onCloseDialogDeleteMethod}
        onConfirm={handleDeleteMethod}
      />
      <ConfirmDialog
        description="Are you sure to delete this table?"
        isLoading={loadingDeleteService}
        isOpen={isDialogDeleteServiceOpen}
        title="Delete Confirmation"
        onClose={onCloseDialogDeleteService}
        onConfirm={handleDeleteService}
      />
    </Box>
  );
});
