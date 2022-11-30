import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Row, SelectOption } from "@/widgets/types";

interface Props {
  record: Row;
}

export const KanbanCard = React.memo(function KanbanCard({ record }: Props) {
  const recordKeyValuePairs = React.useMemo(() => {
    return Object.entries(record);
  }, [record]);

  return (
    <Stack
      direction="column"
      spacing={1.5}
      alignItems="flex-start"
      padding={1.6}
      borderRadius={2}
      sx={{
        border: "2px solid rgba(0,0,0,.2)",
        backgroundColor: "white",
        cursor: "pointer",
        width: "100%",
        transition: "100ms ease-in",
        "&:hover": {
          borderColor: " rgba(0,0,0,.3)",
        },
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