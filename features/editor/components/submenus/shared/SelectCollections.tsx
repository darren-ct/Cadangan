import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { useSubMenuGlobalEvent } from "@/features/editor";
import { Table } from "@/widgets/types";

interface Props {
  onSelect?: (value: Table) => void;
  value?: Table | undefined;
}

export const SelectCollections = React.memo(function SelectCollections({
  onSelect,
  value,
}: Props) {
  const { onGetTables } = useSubMenuGlobalEvent();

  const { data: dataTables, isLoading: isLoadingGetTables } = useQuery(
    ["subMenuGetTables"],
    () => onGetTables(),
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const memoizedTables = React.useMemo(() => {
    let data: Table[] = [];

    if (dataTables) {
      data = dataTables.slice(0);

      const systemTables = data.filter((item) => item.isLockedBySystem);
      const rolesTable = systemTables.find((item) => item.name === "Roles");
      const usersTable = systemTables.find((item) => item.name === "Users");

      if (rolesTable?.id && usersTable?.id) {
        const otherTables = data.filter(
          (item) =>
            item.id !== rolesTable.id &&
            item.id !== usersTable.id &&
            !item.isApiGateway
        );

        data = [usersTable, ...otherTables];
      }
    }

    return data;
  }, [dataTables]);

  return (
    <Stack sx={{ marginBottom: 2 }}>
      <Typography
        sx={(theme) => ({
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Which data collection ?
      </Typography>
      <Autocomplete
        size="small"
        id="combo-box-demo"
        options={memoizedTables}
        getOptionLabel={(option: Table) => option.name}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              style: { fontSize: 12, width: "100%" },
            }}
            placeholder="Select table"
            size="small"
          />
        )}
        renderTags={(value: Table[], getTagProps) =>
          value.map((option: Table, index: number) => (
            <Typography {...getTagProps({ index })} sx={{ fontSize: "12px" }}>
              {option.name}
            </Typography>
          ))
        }
        onChange={(_e, value) => onSelect(value as Table)}
        disableClearable
        value={!value ? undefined : value}
        loading={isLoadingGetTables}
      />
    </Stack>
  );
});
