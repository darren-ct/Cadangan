import { useRouter } from "next/router";
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  useCreateApiKey,
  useCreateDatabase,
  useCreatePlugin,
  useGetClusterDeploymentById,
  useGetClusterDeployments,
  useGetPlugins,
} from "@/api";
import type { ExplorerParams } from "@/types";
import { getCookie } from "@/utils/cookie";

interface DatabaseForm {
  databaseName: string | null;
}

export const useAddDatabase = () => {
  const router = useRouter();
  const { clusterId } = router.query as ExplorerParams;
  const [loadingAddProject, setLoadingAddProject] = React.useState(false);
  const [isClusterReady, setIsClusterReady] = React.useState(false);

  const { data: dataPlugins } = useGetPlugins();
  const { data: dataClusterDeployments } = useGetClusterDeployments({
    clusterId: clusterId ?? "",
  });

  const selectedClusterDeployment = React.useMemo(() => {
    if (dataClusterDeployments) {
      return dataClusterDeployments[0];
    }
  }, [dataClusterDeployments]);

  const { mutateAsync: createDatabaseAsync } = useCreateDatabase({
    deploymentId: selectedClusterDeployment?.id,
  });
  const { mutateAsync: createPluginAsync } = useCreatePlugin();
  const { mutateAsync: createApiKeyAsync } = useCreateApiKey();

  const methods = useForm<DatabaseForm>();
  const { handleSubmit } = methods;

  const { data: dataClusterDeployment } = useGetClusterDeploymentById({
    clusterDeploymentId: selectedClusterDeployment?.id ?? "",
    isPooling: true,
  });

  React.useEffect(() => {
    if (
      !isClusterReady &&
      dataClusterDeployment &&
      dataClusterDeployment.clusterId === clusterId
    ) {
      if (dataClusterDeployment.status === "active") {
        setIsClusterReady(true);
      }
    }
  }, [clusterId, dataClusterDeployment, isClusterReady]);

  const handleAddDatabase = React.useCallback(
    async (data: DatabaseForm) => {
      if (!data.databaseName || !dataPlugins) {
        return;
      }

      const authPlugin = dataPlugins.find(
        (item) => item.pluginCode === "auth" && item.status === "AVAILABLE"
      );

      if (!authPlugin?.id) {
        return;
      }

      try {
        setLoadingAddProject(true);
        const metadataString = decodeURIComponent(getCookie("__mtdt") ?? "");
        const metadata = JSON.parse(metadataString);
        const { id: databaseId } = await createDatabaseAsync({
          name: data.databaseName.trim(),
          includeTable: false,
          metadata,
        });

        await createApiKeyAsync({ databaseId });
        await createPluginAsync({ databaseId, pluginId: authPlugin.id });
        router.push({
          pathname: "/explorer/clusters/[clusterId]/databases/[databaseId]",
          query: { clusterId, databaseId },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAddProject(false);
      }
    },
    [
      clusterId,
      createApiKeyAsync,
      createDatabaseAsync,
      createPluginAsync,
      dataPlugins,
      router,
    ]
  );

  const handleCancel = React.useCallback(() => {
    router.push({
      pathname: "/explorer/clusters/[clusterId]/databases",
      query: { clusterId },
    });
  }, [clusterId, router]);

  return {
    loadingAddProject,
    isClusterReady,
    methods,
    handleAddDatabase,
    handleCancel,
    handleSubmit,
  };
};
