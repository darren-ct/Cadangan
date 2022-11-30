import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";

import type { Draggable, KanbanProps } from "@/features/editor";
import { useDataSource } from "@/widgets/hooks";
import type { DataSourceOptions, FieldOptionsSelect } from "@/widgets/types";

import { KanbanBoard } from "./KanbanBoard";

interface Props {
  item: Draggable;
}

export const KanbanItem = React.memo(function KanbanItem({ item }: Props) {
  const { databaseId: dbId } = useRouter().query;

  // State
  const [onDraggingId, setOnDraggingId] = React.useState<string>("");

  // Memo
  const kanbanProps = React.useMemo(() => {
    return item.props as KanbanProps;
  }, [item.props]);

  const selectOptions = React.useMemo(() => {
    return (
      (kanbanProps.stackingField?.options as FieldOptionsSelect)?.options ?? []
    );
  }, [kanbanProps.stackingField?.options]);

  const options: DataSourceOptions = React.useMemo(() => {
    let opt: DataSourceOptions = {
      pageSize: 50,
      onlyGateway: false,
    };

    if (kanbanProps.filter) {
      opt = { ...opt, filter: kanbanProps.filter };
    }

    if (kanbanProps.sort) {
      opt = { ...opt, sort: kanbanProps.sort };
    }

    if (kanbanProps.hiddenFields) {
      opt = { ...opt, hiddenFields: kanbanProps.hiddenFields };
    }

    return opt;
  }, [kanbanProps.filter, kanbanProps.hiddenFields, kanbanProps.sort]);

  // Hooks
  const { onGetForeignRecords } = useDataSource(
    dbId as string,
    kanbanProps.table,
    options,
    item.id
  );

  const { data: records, refetch: refetchRecords } = useQuery(
    ["getKanbanRecords", kanbanProps.table],
    () =>
      onGetForeignRecords({
        table: kanbanProps.table,
        query: options as unknown as Record<string, unknown>,
      }),
    {
      enabled: !!kanbanProps.table && !!kanbanProps.stackingField,
    }
  );

  // Optional Rendering
  if (!kanbanProps.table) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Typography
          sx={(theme) => ({
            textAlign: "center",
            color: theme.palette.primary[500],
            fontSize: theme.typography.fontSize,
          })}
        >
          Pick a Table
        </Typography>
      </Stack>
    );
  }

  if (!kanbanProps.stackingField) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Typography
          sx={(theme) => ({
            textAlign: "center",
            color: theme.palette.primary[500],
            fontSize: theme.typography.fontSize,
          })}
        >
          Pick 1 Stacking Field
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      padding={3}
      bgcolor="white"
      alignItems="flex-start"
    >
      {selectOptions.map((option) => (
        <KanbanBoard
          key={option.id}
          table={kanbanProps.table}
          option={option}
          fieldName={kanbanProps.stackingField?.name}
          records={records}
          refetchRecords={refetchRecords}
          onDraggingId={onDraggingId}
          setOnDraggingId={setOnDraggingId}
        />
      ))}
    </Stack>
  );
});
