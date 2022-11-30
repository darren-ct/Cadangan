import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import * as React from "react";

import { Select2Icon } from "@/assets/icons";
import { Button } from "@/components/Elements";
import { useDisclose } from "@/hooks";
import type { Cluster } from "@/types";

import { ClusterSelectItem } from "./ClusterSelectItem";

interface Props {
  clusters: Cluster[];
}

const truncateText = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const ClusterSelect = ({ clusters }: Props) => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclose();

  const btnRef = React.useRef<HTMLButtonElement>(null);
  const mainCluster = clusters.find(
    (cluster) => cluster.id === router.query.clusterId
  );

  return (
    <Box sx={{ display: "block", marginTop: 3, marginBottom: 1, px: 3 }}>
      <Button
        color="primary"
        variant="outlined"
        ref={btnRef}
        onClick={onOpen}
        endIcon={<Select2Icon color="disabled" />}
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[100],
          borderColor: theme.palette.grey[200],
          color: theme.palette.grey[400],
          display: "flex",
          fontSize: 12,
          justifyContent: "space-between",
          ...truncateText,
          width: "100%",
        })}
      >
        Cluster{" "}
        <Typography
          variant="caption"
          color="text.primary"
          sx={{
            display: "inline-block",
            ...truncateText,
            fontWeight: 500,
            mx: 1,
          }}
        >
          {mainCluster?.name}
        </Typography>
      </Button>

      <Menu
        open={isOpen}
        onClose={onClose}
        anchorEl={btnRef.current}
        MenuListProps={{ sx: { minWidth: btnRef.current?.clientWidth } }}
      >
        {clusters.map((cluster) => (
          <ClusterSelectItem
            key={cluster.id}
            cluster={cluster}
            mainCluster={mainCluster}
            onClose={onClose}
          />
        ))}
      </Menu>
    </Box>
  );
};
