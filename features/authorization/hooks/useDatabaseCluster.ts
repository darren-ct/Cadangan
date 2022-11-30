import { useRouter } from "next/router";
import * as React from "react";

import { useDefaultDatabase } from "@/hooks/useDefaultDB";
import { Database, GatewayParams } from "@/types";

export const useDatabaseCluster = () => {
  const router = useRouter();
  const { __clid, databaseId: defaultDatabaseId } =
    router.query as unknown as GatewayParams;

  const { databases: databaseData, isLoading: isDatabaseLoading } =
    useDefaultDatabase({
      clusterId: __clid,
      databaseId: defaultDatabaseId,
    });

  const databaseIds = React.useMemo(() => {
    if (databaseData) {
      return databaseData.map((item) => item.id);
    }

    return [];
  }, [databaseData]);

  const databaseId = databaseIds[0] ?? undefined;

  const databases: Database[] = databaseData ?? [];

  const loadingGet = isDatabaseLoading || databaseData === undefined;

  return {
    clusterId: __clid,
    databaseId,
    databaseIds,
    databases,
    loadingGet,
  };
};
