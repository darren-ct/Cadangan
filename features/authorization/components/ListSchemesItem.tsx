import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Scheme, SchemeType } from "../types";

interface Props {
  isActive: boolean;
  scheme: Scheme;

  onSelect: (type: SchemeType) => void;
}

export const ListSchemesItem = React.memo(function ListSchemesItem({
  isActive,
  scheme,
  onSelect,
}: Props) {
  const handlePress = React.useCallback(() => {
    onSelect(scheme.id);
  }, [onSelect, scheme.id]);

  return (
    <Button
      sx={(theme) => ({
        display: "flex",
        flex: 1,
        p: 1,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 0,
        alignItems: "center",
      })}
      variant={isActive ? "contained" : "outlined"}
      disableRipple
      onClick={handlePress}
    >
      <Typography fontSize="0.875em" fontWeight={500}>
        {scheme.name}
      </Typography>
    </Button>
  );
});
