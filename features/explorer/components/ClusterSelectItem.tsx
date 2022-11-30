import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import * as React from "react";

import type { Cluster } from "@/types";

interface Props {
  cluster: Cluster;
  mainCluster?: Cluster;
  onClose: () => void;
}

export const ClusterSelectItem = React.memo(function ClusterSelectItem({
  cluster,
  mainCluster,
  onClose,
}: Props) {
  const router = useRouter();

  const handleSelectCluster = React.useCallback(() => {
    if (cluster.id !== mainCluster?.id) {
      router.push(`/explorer/clusters/${cluster.id}/databases`);
    }
    onClose();
  }, [cluster, mainCluster, onClose, router]);

  return (
    <MenuItem key={cluster.id} onClick={handleSelectCluster}>
      {cluster.name}
    </MenuItem>
  );
});
