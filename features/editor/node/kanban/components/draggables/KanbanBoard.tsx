import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";

import { addRecord } from "@/api";
import { AddIcon, CollapseIcon } from "@/assets/icons";
import { useDisclose } from "@/hooks";
import { Row, SelectOption, Table } from "@/widgets/types";

import { KanbanCard } from "./KanbanCard";
import { KanbanModal } from "./KanbanModal";

interface Props {
  option: SelectOption;
  fieldName: string;
  table: Table;
  records: Row[];
  refetchRecords: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult<Row[], unknown>>;
}

export const KanbanBoard = React.memo(function KanbanBoard({
  option,
  fieldName,
  table,
  records,
  refetchRecords,
}: Props) {
  const { databaseId } = useRouter().query;

  // Hooks
  const { isOpen, onOpen, onClose } = useDisclose(true);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclose();

  // Memos
  const filteredRecords = React.useMemo(() => {
    return (
      records?.filter(
        (record) => (record[fieldName] as SelectOption).value === option.value
      ) ?? []
    );
  }, [fieldName, option.value, records]);

  // useCallbacks
  const onCreateRecordHandler = React.useCallback(
    async (values: Row) => {
      if (!values) {
        return;
      }
      const filteredValues = {};

      const keyValuePair = Object.entries(values);

      keyValuePair.forEach((keyValue) => {
        if (!keyValue[1]) {
          return;
        }

        if ((keyValue[1] as SelectOption).value) {
          return (filteredValues[keyValue[0]] = (
            keyValue[1] as SelectOption
          ).value);
        }

        return (filteredValues[keyValue[0]] = keyValue[1]);
      });

      // Create Record
      try {
        const data = await addRecord({
          dbId: databaseId as string,
          tableId: table.id,
          variables: {
            body: filteredValues,
          },
        });

        console.log({ data });
        refetchRecords();
      } catch (err) {
        console.log(err);
      }
    },
    [databaseId, refetchRecords, table.id]
  );

  // Optional Rendering
  if (!isOpen) {
    return (
      <Stack
        onClick={onOpen}
        spacing={1}
        sx={{
          height: 220,
          width: 80,
          flexShrink: 0,
          padding: 2,
          borderRadius: 2,
          backgroundColor: "rgba(0,0,0,.05)",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize + 1,
            fontWeight: 500,
            color: theme.palette.primary[500],
          })}
        >
          {option.value}
        </Typography>
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
            color: theme.palette.primary[500],
          })}
        >{`${filteredRecords.length} record${
          filteredRecords.length > 1 ? "s" : ""
        }`}</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={2}
      direction="column"
      padding={2}
      borderRadius={2}
      sx={{
        width: 220,
        backgroundColor: "rgba(0,0,0,.05)",
        flexShrink: 0,
        boxShadow: "1px 1px 4px rgba(0,0,0,.15)",
      }}
    >
      <Box
        sx={(theme) => ({
          width: "min-content",
          color: "white",
          backgroundColor: theme.palette.primary[500],
          fontSize: theme.typography.fontSize,
          borderRadius: 16,
          paddingX: 2,
          paddingY: 1,
        })}
      >
        {option.value}
      </Box>

      <Box
        sx={{
          paddingY: filteredRecords.length > 1 ? 0.5 : 0,
          borderTop:
            filteredRecords.length > 1 ? "1px solid rgba(0,0,0,.1)" : "none",
          borderBottom:
            filteredRecords.length > 1 ? "1px solid rgba(0,0,0,.1)" : "none",
          scrollbarWidth: "none",
          overflowY: filteredRecords.length > 1 ? "scroll" : "hidden",
          height: filteredRecords.length > 1 ? 600 : "fit-content",
        }}
      >
        <Stack direction="column" alignItems="center" spacing={3}>
          {filteredRecords.map((record) => (
            <KanbanCard key={record._id} record={record} />
          ))}
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={(theme) => ({
            fontSize: theme.typography.fontSize,
            color: theme.palette.primary[500],
          })}
        >{`${filteredRecords.length}  record${
          filteredRecords.length > 1 ? "s" : ""
        }`}</Typography>
        <Tooltip title="Add record" placement="right">
          <Box
            onClick={onModalOpen}
            sx={(theme) => ({
              borderRadius: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              cursor: "pointer",
              backgroundColor: theme.palette.primary[500],
              transition: "100ms linear",
              "&:hover": {
                transform: "scale(1.1)",
              },
            })}
          >
            <AddIcon
              sx={(theme) => ({
                fontSize: theme.typography.fontSize + 2,
                color: "white",
              })}
            />
          </Box>
        </Tooltip>
        <Tooltip title="Collapse stack" placement="right">
          <IconButton size="small" onClick={onClose}>
            <CollapseIcon
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
                color: theme.palette.primary[500],
              })}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <KanbanModal
        open={isModalOpen}
        onClose={onModalClose}
        onSubmit={onCreateRecordHandler}
        databaseId={databaseId as string}
        table={table}
        option={option}
        fieldName={fieldName}
      />
    </Stack>
  );
});
