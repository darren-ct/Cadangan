import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { DeleteIcon } from "@/assets/icons/Delete";
import type { Field, LinkToRecordObjectInput } from "@/widgets/types";

interface Props {
  item: LinkToRecordObjectInput;
  handleRemoveLinkToRecord: (item: LinkToRecordObjectInput) => void;
  primaryField: Field;
}

export const RecordItem = React.memo(function RecordItem({
  item,
  handleRemoveLinkToRecord,
  primaryField,
}: Props) {
  const [isHover, setIsHover] = React.useState<boolean>(false);

  const hoverHandler = React.useCallback(() => {
    setIsHover(true);
  }, []);

  const leaveHandler = React.useCallback(() => {
    setIsHover(false);
  }, []);

  const removeHandler = React.useCallback(
    (item: LinkToRecordObjectInput) => {
      handleRemoveLinkToRecord(item);
    },
    [handleRemoveLinkToRecord]
  );

  return (
    <Button
      disableRipple
      onMouseEnter={hoverHandler}
      onMouseLeave={leaveHandler}
      sx={{
        position: "relative",
        marginBottom: "12px",
        padding: "0px",
        background: "transparent",
        color: "black",
        "&:hover": {
          background: "transparent",
        },
      }}
    >
      <Box
        key={item._id}
        padding="8px"
        borderRadius="4px"
        sx={{
          textAlign: "center",
          width: "100%",
          border: "1px solid rgba(0,0,0,.30)",
          marginBottom: "8px",
        }}
      >
        <>{item[primaryField?.name] ?? "Unnamed"}</>
      </Box>
      {isHover && (
        <div
          onClick={removeHandler.bind(this, item)}
          style={{
            borderRadius: "100vw",
            display: "inline-block",
            position: "absolute",
            right: "-10px",
            top: "-10px",
          }}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            px={0.75}
            py={0.25}
            sx={{
              backgroundColor: "gray",
              borderRadius: "100vw",
            }}
          >
            <DeleteIcon sx={{ color: "white", width: 12 }} />
          </Stack>
        </div>
      )}
    </Button>
  );
});
