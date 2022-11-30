import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { SortIcon } from "@/assets/icons";
import { SortMenu } from "@/widgets/features/master/menu";
import { Field, ToolbarSortValue } from "@/widgets/types";

interface Props {
  value: ToolbarSortValue[];
  onChange: (values: ToolbarSortValue[]) => void;
  fields: Field[];
}

export const TableSort = React.memo(function TableSort({
  fields,
  onChange,
  value,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleSortMenuClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSortMenuOpen: React.MouseEventHandler<HTMLButtonElement> =
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
        Sort
      </Typography>
      <Button
        onClick={handleSortMenuOpen}
        sx={(theme) => ({
          color: theme.palette.text.primary,
          fontSize: theme.typography.fontSize - 1,
          textTransform: "none",
          border: `1px solid ${theme.palette.grey[400]}`,
          justifyContent: "start",
          width: "165px",
        })}
        disableElevation
        disableRipple
      >
        <SortIcon
          sx={{
            marginRight: 0.5,
            fontSize: 18,
          }}
        />
        {`Sorted ${value.length} field`}
      </Button>
      <SortMenu
        anchorEl={anchorEl}
        fields={fields}
        onChange={onChange}
        onClose={handleSortMenuClose}
        value={value}
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
