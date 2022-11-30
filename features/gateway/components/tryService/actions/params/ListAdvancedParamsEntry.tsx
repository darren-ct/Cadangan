// import { HStack, Pressable } from "native-base";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { RemoveIcon } from "@/assets/icons";
import type { FieldArrayWithId } from "@/types";

import type { FormTryServiceAdvanced } from "../../../../types";
import { InputString } from "../InputString";

interface Props {
  index: number;
  param?: FieldArrayWithId<FormTryServiceAdvanced, "advancedParams", "id">;
  onRemove: (index: number) => void;
}

export const ListAdvancedParamsEntry = React.memo(
  function ListAdvancedParamsEntry({ index, onRemove }: Props) {
    const handlePress = React.useCallback(() => {
      onRemove(index);
    }, [index, onRemove]);

    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <InputString
          w="50%"
          placeholder="Key"
          name={`advancedParams.${index}.key`}
        />
        <InputString
          w="50%"
          placeholder="Value"
          name={`advancedParams.${index}.value`}
        />
        <IconButton onClick={handlePress}>
          <RemoveIcon
            sx={(theme) => ({
              color: theme.palette.grey[600],
              fontSize: "18px",
            })}
          />
        </IconButton>
      </Stack>
    );
  }
);
