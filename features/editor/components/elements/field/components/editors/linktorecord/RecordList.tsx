import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";

import type { Field, LinkToRecordObjectInput, Row } from "@/widgets/types";

import { RecordItem } from "./RecordItem";

interface Props {
  fields: Field[];
  isLoading?: boolean;
  primaryField: string;
  records: Row[];
  onClickDelete?: (item: Row) => void;
  onClickItem?: (item: LinkToRecordObjectInput) => void;
}

export const RecordList = React.memo(function RecordList({
  fields,
  isLoading,
  records,
  onClickItem,
  primaryField,
}: Props) {
  return (
    <Box
      sx={{
        maxHeight: 416,
        minHeight: 100,
        overflowY: "auto",
        paddingBottom: 1.5,
      }}
    >
      {records && records.length ? (
        records.map((item, i) => (
          <RecordItem
            fields={fields || []}
            item={item}
            key={i}
            onClickItem={onClickItem}
            primaryField={primaryField}
          />
        ))
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          {isLoading ? <CircularProgress /> : "No matching records"}
        </Box>
      )}
    </Box>
  );
});
