import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ChartTypeRegistry } from "chart.js";
import * as React from "react";

import { ChartIcon } from "@/components/ChartIcon";
import { chartTypesTitle } from "@/features/editor";

interface Props {
  active?: boolean;
  type: keyof ChartTypeRegistry;
  onClick?: () => void;
}

export const ChartType = React.memo(function ChartType({
  active,
  type,
  onClick,
}: Props) {
  return (
    <Box sx={{ aspectRatio: "1/1" }}>
      <Button
        sx={(theme) => ({
          height: "100%",
          width: "100%",
          borderRadius: 1,
          backgroundColor: !active
            ? theme.palette.grey[50]
            : theme.palette.primary[500],
          flexDirection: "column",
          alignItems: "center",
          textTransform: "none",
          color: !active ? theme.palette.primary[500] : "white",
          ":hover": {
            backgroundColor: !active
              ? theme.palette.grey[100]
              : theme.palette.primary[700],
          },
        })}
        onClick={onClick}
      >
        <ChartIcon type={type} sx={{ fontSize: 24 }} />
        <Typography
          fontWeight="500"
          variant="subtitle2"
          sx={(theme) => ({
            marginTop: "4px",
            fontSize: theme.typography.fontSize,
          })}
        >
          {chartTypesTitle[type]}
        </Typography>
      </Button>
    </Box>
  );
});
