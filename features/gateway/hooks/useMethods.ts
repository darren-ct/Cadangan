import { blue, green, orange, pink, purple, red } from "@mui/material/colors";
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  useCreateApiGateway,
  useDeleteApiGateway,
  useUpdateApiGateway,
  useUpdateRecord,
} from "@/api";
import { useDisclose } from "@/hooks";
import type { Block, Method, RecordRoles } from "@/types";
import { capitalize } from "@/utils/misc";

import type { FormMethod } from "../types";
import { useMethodTypes } from "./useMethodTypes";

const methodsBgColor: Record<string, string> = {
  GET: blue[500],
  POST: green[500],
  PUT: orange[500],
  PATCH: orange[500],
  DELETE: red[500],
  LINK: purple[500],
  UNLINK: purple[500],
};

const methodsName: Record<string, string> = {
  GET: "Get info about the REST API",
  POST: "Create a REST API",
  PUT: "Update a REST API",
  PATCH: "Update a REST API",
  DELETE: "Delete a REST API",
};

interface Props {
  adminRecordRoles: RecordRoles[];
  authenticatedRecordRoles: RecordRoles[];
  databaseIds: string[];
  publicRecordRoles: RecordRoles[];
  rolesBlocks: Block[];
  handleOpenTryService: (method?: Method, service?: Block) => void;
}

export const useMethods = ({
  adminRecordRoles,
  authenticatedRecordRoles,
  databaseIds,
  publicRecordRoles,
  rolesBlocks,
  handleOpenTryService,
}: Props) => {
  const { customMethods, methods: methodTypes } = useMethodTypes();
  const {
    isOpen: isModalNewMethodOpen,
    onOpen: onOpenModalNewMethod,
    onClose: onCloseModalNewMethod,
  } = useDisclose();
  const {
    isOpen: isModalUpdateMethodOpen,
    onOpen: onOpenModalUpdateMethod,
    onClose: onCloseModalUpdateMethod,
  } = useDisclose();
  const {
    isOpen: isDialogDeleteMethodOpen,
    onOpen: onOpenDialogDeleteMethod,
    onClose: onCloseDialogDeleteMethod,
  } = useDisclose();

  const [activeGatewayMethods, setActiveGatewayMethods] = React.useState<
    Method[]
  >([]);

  const { mutateAsync: createApiGateway, isLoading: loadingCreateMethod } =
    useCreateApiGateway();
  const { mutateAsync: updateApiGateway, isLoading: loadingUpdateMethod } =
    useUpdateApiGateway();
  const { mutateAsync: deleteApiGateway, isLoading: loadingDeleteMethod } =
    useDeleteApiGateway();
  const { mutateAsync: updateRecord } = useUpdateRecord({ type: "roles" });

  // TODO: add yup validation
  const methods = useForm<FormMethod>({
    defaultValues: {
      methodPath: "",
      methodType: "url",
      methodUrl: "",
      selectedMethod: undefined,
      selectedReqMethod: undefined,
    },
  });
  const { getValues, resetField, setError, setValue } = methods;

  const handleOpenModalNewMethod = React.useCallback(
    (service: Block, gatewayMethods: Method[]) => {
      resetField("methodPath", { defaultValue: `/${service.title[0][0]}` });
      resetField("methodType");
      resetField("methodUrl");
      resetField("selectedReqMethod", { defaultValue: undefined });
      setValue("selectedService", service);
      setActiveGatewayMethods(gatewayMethods);

      onOpenModalNewMethod();
    },
    [onOpenModalNewMethod, resetField, setValue]
  );

  const handleSaveNewMethod = React.useCallback(
    async ({
      methodPath,
      methodType,
      methodUrl,
      selectedService,
      selectedReqMethod,
    }: FormMethod) => {
      if (
        !selectedService ||
        !(databaseIds && databaseIds.length > 0) ||
        !methodPath ||
        !selectedReqMethod ||
        !rolesBlocks.length
      ) {
        return;
      }

      const currentProjectId = databaseIds.find((item) =>
        selectedService.parentId.includes(item)
      );

      if (!currentProjectId) {
        return;
      }

      const selectedRoles = rolesBlocks.find(
        (item) => item.parentId === currentProjectId
      );

      let selectedAuthenticatedRecordRoles: RecordRoles | undefined;
      let selectedAdminRecordRoles: RecordRoles | undefined;

      if (selectedRoles) {
        selectedAuthenticatedRecordRoles = authenticatedRecordRoles.find(
          (item) => item.blockId === selectedRoles.id
        );
        selectedAdminRecordRoles = adminRecordRoles.find(
          (item) => item.blockId === selectedRoles.id
        );
      }

      if (
        !selectedAuthenticatedRecordRoles?.permissions ||
        !selectedAdminRecordRoles?.permissions ||
        !selectedRoles
      ) {
        return;
      }

      const customMethodIdx = activeGatewayMethods.findIndex(
        (item) =>
          item.tableId === selectedService.properties?.tableId &&
          item.path === methodPath
      );

      if (customMethodIdx !== -1) {
        setError("methodPath", { message: "Path is already exists" });
        return;
      }

      const isInternal = methodType === "internal";

      try {
        let path = methodPath.replace(/(?<!:)\/\/+/g, "/");

        if (path.length > 1 && path.endsWith("/")) {
          path = path.replace(/.$/, "");
        }

        path = path.trim();

        const api = await createApiGateway({
          databaseId: currentProjectId,
          body: {
            projectId: currentProjectId,
            tableId: selectedService.properties?.tableId,
            internalTableId: isInternal
              ? selectedService.properties?.tableId
              : undefined,
            path,
            method: selectedReqMethod.label,
            type: isInternal ? selectedReqMethod.type : "external",
            url: isInternal ? undefined : methodUrl,
          },
        });

        const authenticatedPermissions =
          selectedAuthenticatedRecordRoles.permissions.slice(0);
        const adminPermissions = selectedAdminRecordRoles.permissions.slice(0);

        const additionalPermission = `${selectedService.properties?.tableId}:${api.id}:${api.type}`;

        authenticatedPermissions.push(additionalPermission);
        adminPermissions.push(additionalPermission);

        await updateRecord({
          dbId: currentProjectId,
          tableId: selectedRoles.properties?.tableId,
          id: selectedAuthenticatedRecordRoles._id,
          body: { permissions: authenticatedPermissions },
        });
        await updateRecord({
          dbId: currentProjectId,
          tableId: selectedRoles.properties?.tableId,
          id: selectedAdminRecordRoles._id,
          body: { permissions: adminPermissions },
        });

        const method: Method = {
          ...api,
          name:
            api.type === "external"
              ? methodsName[api.method]
              : `${capitalize(api.type)} Record${
                  api.type === "find" || api.type === "count" ? "s" : ""
                }`,
          label: api.method,
          bgColor: methodsBgColor[api.method] ?? "pink.500",
          color:
            api.method === "PATCH" || api.method === "PUT" ? "black" : "white",
          path: api.path,
        };

        handleOpenTryService(method, selectedService);
      } catch (error) {
        console.log(error);
      } finally {
        onCloseModalNewMethod();
      }
    },
    [
      activeGatewayMethods,
      adminRecordRoles,
      authenticatedRecordRoles,
      createApiGateway,
      databaseIds,
      handleOpenTryService,
      onCloseModalNewMethod,
      rolesBlocks,
      setError,
      updateRecord,
    ]
  );

  const handleOpenModalUpdateMethod = React.useCallback(
    (method: Method, service: Block) => {
      if (!method.path) {
        return;
      }
      let reqMethod = method;

      const methodTypeList =
        method.type === "external" ? customMethods : methodTypes;

      const selectedmethodType = methodTypeList.find(
        (item) => item.name.toLowerCase() === reqMethod.name.toLowerCase()
      );

      if (selectedmethodType) {
        reqMethod = {
          ...method,
          id: selectedmethodType.id,
        };
      }

      setValue("selectedMethod", method);
      setValue("selectedReqMethod", reqMethod);
      setValue("selectedService", service);
      setValue("methodType", method.type === "external" ? "url" : "internal");
      setValue("methodPath", method.path, {
        shouldValidate: true,
        shouldTouch: true,
      });
      setValue("methodUrl", method.url ?? "", {
        shouldValidate: true,
        shouldTouch: true,
      });
      onOpenModalUpdateMethod();
    },
    [customMethods, methodTypes, onOpenModalUpdateMethod, setValue]
  );

  const handleUpdateMethod = React.useCallback(
    async ({
      selectedMethod,
      selectedReqMethod,
      selectedService,
      methodPath,
      methodUrl,
    }: FormMethod) => {
      if (
        !selectedService ||
        !(databaseIds && databaseIds.length > 0) ||
        !methodPath ||
        !rolesBlocks.length
      ) {
        return;
      }

      const currentProjectId = databaseIds.find((item) =>
        selectedService.parentId.includes(item)
      );

      if (!currentProjectId) {
        return;
      }

      const selectedRoles = rolesBlocks.find(
        (item) => item.parentId === currentProjectId
      );

      let selectedPublicRecordRoles: RecordRoles | undefined;
      let selectedAuthenticatedRecordRoles: RecordRoles | undefined;
      let selectedAdminRecordRoles: RecordRoles | undefined;

      if (selectedRoles) {
        selectedPublicRecordRoles = publicRecordRoles.find(
          (item) => item.blockId === selectedRoles.id
        );
        selectedAuthenticatedRecordRoles = authenticatedRecordRoles.find(
          (item) => item.blockId === selectedRoles.id
        );
        selectedAdminRecordRoles = adminRecordRoles.find(
          (item) => item.blockId === selectedRoles.id
        );
      }

      if (
        !selectedPublicRecordRoles?.permissions ||
        !selectedAuthenticatedRecordRoles?.permissions ||
        !selectedAdminRecordRoles?.permissions ||
        !selectedRoles
      ) {
        return;
      }

      try {
        const isInternal = selectedMethod.type !== "external";
        let path = methodPath.replace(/(?<!:)\/\/+/g, "/");

        if (path.length > 1 && path.endsWith("/")) {
          path = path.replace(/.$/, "");
        }

        path = path.trim();

        const api = await updateApiGateway({
          databaseId: currentProjectId,
          gatewayId: selectedMethod.id,
          body: {
            projectId: currentProjectId,
            tableId: selectedMethod.tableId,
            internalTableId: isInternal
              ? selectedMethod.internalTableId
              : undefined,
            path,
            method: selectedReqMethod.label,
            type: isInternal ? selectedReqMethod.type : selectedMethod.type,
            url: isInternal ? undefined : methodUrl,
          },
        });

        if (api.type !== selectedMethod?.type) {
          const gatewayWithOwn = ["find", "update", "delete"];
          const gatewayPermission = `${selectedService.properties?.tableId}:${selectedMethod.id}`;

          const gatewayPublicPermissions =
            selectedPublicRecordRoles?.permissions.filter((item) =>
              item.startsWith(gatewayPermission)
            );

          if (gatewayPublicPermissions.length > 0) {
            const publicPermissions =
              selectedPublicRecordRoles?.permissions.slice(0);

            gatewayPublicPermissions.forEach((item) => {
              publicPermissions.splice(publicPermissions.indexOf(item), 1);
            });

            publicPermissions.push(`${gatewayPermission}:${api.type}`);

            if (
              gatewayPublicPermissions.find((item) => item.includes("Own")) &&
              gatewayWithOwn.includes(api.type)
            ) {
              publicPermissions.push(`${gatewayPermission}:${api.type}Own`);
            }

            await updateRecord({
              dbId: currentProjectId,
              tableId: selectedRoles.properties?.tableId,
              id: selectedPublicRecordRoles._id,
              body: { permissions: publicPermissions },
            });
          }

          const gatewayAuthenticatedPermissions =
            selectedAuthenticatedRecordRoles?.permissions.filter((item) =>
              item.startsWith(gatewayPermission)
            );

          if (gatewayAuthenticatedPermissions.length > 0) {
            const authenticatedPermissions =
              selectedAuthenticatedRecordRoles?.permissions.slice(0);

            gatewayAuthenticatedPermissions.forEach((item) => {
              authenticatedPermissions.splice(
                authenticatedPermissions.indexOf(item),
                1
              );
            });

            authenticatedPermissions.push(`${gatewayPermission}:${api.type}`);

            if (
              gatewayAuthenticatedPermissions.find((item) =>
                item.includes("Own")
              ) &&
              gatewayWithOwn.includes(api.type)
            ) {
              authenticatedPermissions.push(
                `${gatewayPermission}:${api.type}Own`
              );
            }

            await updateRecord({
              dbId: currentProjectId,
              tableId: selectedRoles.properties?.tableId,
              id: selectedAuthenticatedRecordRoles._id,
              body: { permissions: authenticatedPermissions },
            });
          }

          const gatewayAdminPermissions =
            selectedAdminRecordRoles?.permissions.filter((item) =>
              item.startsWith(gatewayPermission)
            );

          if (gatewayAdminPermissions.length > 0) {
            const adminPermissions =
              selectedAdminRecordRoles?.permissions.slice(0);

            gatewayAdminPermissions.forEach((item) => {
              adminPermissions.splice(adminPermissions.indexOf(item), 1);
            });

            adminPermissions.push(`${gatewayPermission}:${api.type}`);

            if (
              gatewayAdminPermissions.find((item) => item.includes("Own")) &&
              gatewayWithOwn.includes(api.type)
            ) {
              adminPermissions.push(`${gatewayPermission}:${api.type}Own`);
            }

            await updateRecord({
              dbId: currentProjectId,
              tableId: selectedRoles.properties?.tableId,
              id: selectedAdminRecordRoles._id,
              body: { permissions: adminPermissions },
            });
          }
        }

        const method: Method = {
          ...api,
          name:
            api.type === "external"
              ? methodsName[api.method]
              : `${capitalize(api.type)} Record${
                  api.type === "find" || api.type === "count" ? "s" : ""
                }`,
          label: api.method,
          bgColor: methodsBgColor[api.method] ?? pink[500],
          color:
            api.method === "PATCH" || api.method === "PUT" ? "black" : "white",
          path: api.path,
        };

        handleOpenTryService(method, selectedService);
      } catch (error) {
        console.log(error);
      } finally {
        onCloseModalUpdateMethod();
      }
    },
    [
      adminRecordRoles,
      authenticatedRecordRoles,
      databaseIds,
      handleOpenTryService,
      onCloseModalUpdateMethod,
      publicRecordRoles,
      rolesBlocks,
      updateApiGateway,
      updateRecord,
    ]
  );

  const handleOpenDialogDeleteMethod = React.useCallback(
    (method: Method, service: Block) => {
      setValue("selectedMethod", method);
      setValue("selectedService", service);
      onOpenDialogDeleteMethod();
    },
    [onOpenDialogDeleteMethod, setValue]
  );

  const handleDeleteMethod = React.useCallback(async () => {
    const selectedMethod = getValues("selectedMethod");
    const selectedService = getValues("selectedService");

    if (
      !(databaseIds && databaseIds.length > 0) ||
      !selectedMethod?.id ||
      !selectedService ||
      !rolesBlocks.length
    ) {
      return;
    }

    const currentProjectId = databaseIds.find((item) =>
      selectedService.parentId.includes(item)
    );

    if (!currentProjectId) {
      return;
    }

    const selectedRoles = rolesBlocks.find(
      (item) => item.parentId === currentProjectId
    );

    let selectedPublicRecordRoles: RecordRoles | undefined;
    let selectedAuthenticatedRecordRoles: RecordRoles | undefined;
    let selectedAdminRecordRoles: RecordRoles | undefined;

    if (selectedRoles) {
      selectedPublicRecordRoles = publicRecordRoles.find(
        (item) => item.blockId === selectedRoles.id
      );
      selectedAuthenticatedRecordRoles = authenticatedRecordRoles.find(
        (item) => item.blockId === selectedRoles.id
      );
      selectedAdminRecordRoles = adminRecordRoles.find(
        (item) => item.blockId === selectedRoles.id
      );
    }

    if (
      !selectedPublicRecordRoles?.permissions ||
      !selectedAuthenticatedRecordRoles?.permissions ||
      !selectedAdminRecordRoles?.permissions ||
      !selectedRoles
    ) {
      return;
    }

    try {
      await deleteApiGateway({
        databaseId: currentProjectId,
        gatewayId: selectedMethod.id,
      });

      const gatewayPermission = `${selectedService.properties?.tableId}:${selectedMethod.id}`;

      const gatewayPublicPermissions =
        selectedPublicRecordRoles?.permissions.filter((item) =>
          item.startsWith(gatewayPermission)
        );

      if (gatewayPublicPermissions.length > 0) {
        const publicPermissions =
          selectedPublicRecordRoles?.permissions.slice(0);

        gatewayPublicPermissions.forEach((item) => {
          publicPermissions.splice(publicPermissions.indexOf(item), 1);
        });

        await updateRecord({
          dbId: currentProjectId,
          tableId: selectedRoles.properties?.tableId,
          id: selectedPublicRecordRoles._id,
          body: { permissions: publicPermissions },
        });
      }

      const gatewayAuthenticatedPermissions =
        selectedAuthenticatedRecordRoles?.permissions.filter((item) =>
          item.startsWith(gatewayPermission)
        );

      if (gatewayAuthenticatedPermissions.length > 0) {
        const authenticatedPermissions =
          selectedAuthenticatedRecordRoles?.permissions.slice(0);

        gatewayAuthenticatedPermissions.forEach((item) => {
          authenticatedPermissions.splice(
            authenticatedPermissions.indexOf(item),
            1
          );
        });

        await updateRecord({
          dbId: currentProjectId,
          tableId: selectedRoles.properties?.tableId,
          id: selectedAuthenticatedRecordRoles._id,
          body: { permissions: authenticatedPermissions },
        });
      }

      const gatewayAdminPermissions =
        selectedAdminRecordRoles?.permissions.filter((item) =>
          item.startsWith(gatewayPermission)
        );

      if (gatewayAdminPermissions.length > 0) {
        const adminPermissions = selectedAdminRecordRoles?.permissions.slice(0);

        gatewayAdminPermissions.forEach((item) => {
          adminPermissions.splice(adminPermissions.indexOf(item), 1);
        });

        await updateRecord({
          dbId: currentProjectId,
          tableId: selectedRoles.properties?.tableId,
          id: selectedAdminRecordRoles._id,
          body: { permissions: adminPermissions },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      onCloseDialogDeleteMethod();
    }
  }, [
    adminRecordRoles,
    authenticatedRecordRoles,
    databaseIds,
    deleteApiGateway,
    getValues,
    onCloseDialogDeleteMethod,
    publicRecordRoles,
    rolesBlocks,
    updateRecord,
  ]);

  return {
    isDialogDeleteMethodOpen,
    isModalNewMethodOpen,
    isModalUpdateMethodOpen,
    loadingCreateMethod,
    loadingDeleteMethod,
    loadingUpdateMethod,
    methods,
    handleDeleteMethod,
    handleOpenDialogDeleteMethod,
    handleOpenModalNewMethod,
    handleOpenModalUpdateMethod,
    handleSaveNewMethod,
    handleUpdateMethod,
    onCloseDialogDeleteMethod,
    onCloseModalNewMethod,
    onCloseModalUpdateMethod,
  };
};
