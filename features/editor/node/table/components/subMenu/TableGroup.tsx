import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { GroupIcon } from "@/assets/icons";
import { GroupMenu } from "@/widgets/features/master/menu";
import { Field, ToolbarGroupValue } from "@/widgets/types";

interface Props {
  value: ToolbarGroupValue[];
  onChange: (values: ToolbarGroupValue[]) => void;
  fields: Field[];
}

export const TableGroup = React.memo(function TableGroup({
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
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
          color: "#828282",
        })}
      >
        Group
      </Typography>
      <Button
        onClick={handleSortMenuOpen}
        sx={(theme) => ({
          color: theme.palette.text.primary,
          textTransform: "none",
          border: `1px solid ${theme.palette.grey[400]}`,
          justifyContent: "start",
          width: "165px",
          fontSize: theme.typography.fontSize - 1,
        })}
        disableElevation
        disableRipple
      >
        <GroupIcon
          sx={{
            marginRight: 0.5,
            fontSize: 18,
          }}
        />
        {`Grouped ${value.length} field`}
      </Button>
      <GroupMenu
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
