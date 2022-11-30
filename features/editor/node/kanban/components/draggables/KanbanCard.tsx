import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Row, SelectOption, ToolbarHiddenFieldsValue } from "@/widgets/types";

interface Props {
  record: Row;
  hiddenFields: ToolbarHiddenFieldsValue[];
  onDragStart: (
    recordId: string,
    event: React.DragEvent<HTMLDivElement>
  ) => void;
}

export const KanbanCard = React.memo(function KanbanCard({
  record,
  hiddenFields,
  onDragStart,
}: Props) {
  const recordKeyValuePairs = React.useMemo(() => {
    const keyValuePairs = Object.entries(record);
    const filteredKeyValuePairs = keyValuePairs.filter((keyValue) => {
      let isShown = true;

      hiddenFields.every((field) => {
        if (keyValue[0] === "no") {
          isShown = false;
          return false;
        }

        if (field.field === keyValue[0]) {
          isShown = false;
          return false;
        }

        return true;
      });

      return isShown;
    });

    return filteredKeyValuePairs;
  }, [hiddenFields, record]);

  return (
    <Stack
      draggable={true}
      direction="column"
      spacing={1.5}
      alignItems="flex-start"
      padding={1.6}
      borderRadius={2}
      sx={{
        border: "2px solid rgba(0,0,0,.2)",
        backgroundColor: "white",
        cursor: "grab",
        width: "100%",
        transition: "100ms ease-in",
        "&:hover": {
          borderColor: " rgba(0,0,0,.3)",
        },
      }}
      onDragStart={(e) => {
        onDragStart(record._id, e);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
      }}
      onDrag={(e) => {
        e.stopPropagation();
      }}
    >
      {recordKeyValuePairs.map((keyValuePair) => (
        <Stack spacing={0.1}>
          <Typography
            sx={(theme) => ({
              fontSize: theme.typography.fontSize,
              color: "#828282",
              fontWeight: 500,
              wordWrap: "break-word",
            })}
          >
            {keyValuePair[0]}
          </Typography>
          {typeof keyValuePair[1] === "object" && (
            <Box
              sx={(theme) => ({
                paddingY: 0.5,
                paddingX: 1,
                borderRadius: 16,
                backgroundColor: (keyValuePair[1] as SelectOption).color,
                color: "white",
                fontSize: theme.typography.fontSize,
              })}
            >
              {(keyValuePair[1] as SelectOption).value}
            </Box>
          )}

          {typeof keyValuePair[1] !== "object" && (
            <Typography
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
                maxWidth: "160px",
                wordWrap: "break-word",
              })}
            >
              {String(keyValuePair[1])}
            </Typography>
          )}
        </Stack>
      ))}
    </Stack>
  );
});
