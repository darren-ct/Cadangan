import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { RemoveIcon } from "@/assets/icons";
import type { FieldArrayWithId } from "@/types";

import type { FormTryServiceAdvanced } from "../../../../types";
import { InputString } from "../InputString";

interface Props {
  index: number;
  param?: FieldArrayWithId<FormTryServiceAdvanced, "headers", "id">;
  onRemove: (index: number) => void;
}

export const ListHeadersEntry = React.memo(function ListHeadersEntry({
  index,
  onRemove,
}: Props) {
  const handlePress = React.useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <InputString w="50%" placeholder="Key" name={`headers.${index}.key`} />
      <InputString
        w="50%"
        placeholder="Value"
        name={`headers.${index}.value`}
      />
      <IconButton onClick={handlePress}>
        <RemoveIcon
          sx={(theme) => ({ color: theme.palette.grey[600], fontSize: "18px" })}
        />
      </IconButton>
    </Stack>
  );
});
