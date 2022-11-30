import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { FilterIcon } from "@/assets/icons";
import { FilterMenu } from "@/widgets/features/master/menu";
import { Field, ToolbarFilterValue } from "@/widgets/types";

interface Props {
  value: ToolbarFilterValue[];
  onChange: (values: ToolbarFilterValue[]) => void;
  fields: Field[];
}

export const KanbanFilter = React.memo(function KanbanFilter({
  fields,
  onChange,
  value,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleFilterMenuClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleFilterMenuOpen: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback((e) => {
      setAnchorEl(e.currentTarget as HTMLElement);
    }, []);

  return (
    <Stack direction="row" alignItems="center" sx={{ marginBottom: 1 }}>
      <Typography
        sx={(theme) => ({
          marginBottom: 1,
          flex: 1,
          fontSize: theme.typography.fontSize,
          fontWeight: 500,
          color: "#828282",
        })}
      >
        Filter
      </Typography>
      <Button
        onClick={handleFilterMenuOpen}
        sx={(theme) => ({
          fontSize: theme.typography.fontSize - 1,
          color: theme.palette.text.primary,
          textTransform: "none",
          border: `1px solid ${theme.palette.grey[400]}`,
          justifyContent: "start",
          width: "165px",
        })}
        disableElevation
        disableRipple
      >
        <FilterIcon
          sx={{
            marginRight: 0.5,
            fontSize: 18,
          }}
        />
        {`Filtered ${value.length} field`}
      </Button>
      <FilterMenu
        anchorEl={anchorEl}
        fields={fields}
        onChange={onChange}
        value={value}
        onClose={handleFilterMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
    </Stack>
  );
});
