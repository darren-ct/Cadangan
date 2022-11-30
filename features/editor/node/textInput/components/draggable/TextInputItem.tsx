import TextField from "@mui/material/TextField";
import * as React from "react";

import type {
  // ClassicSubProps,
  Draggable,
  // TextInputProps,
} from "@/features/editor";
import { useMagicResult, useTextInput } from "@/features/editor";

interface Props {
  item: Draggable;
  isDisabled: boolean;
}

export const TextInputItem = React.memo(function TextInputItem({
  item,
  isDisabled,
}: Props) {
  const { itemProps, updateDraggableProps } = useTextInput({ item });
  const { stringifiedOutput } = useMagicResult(itemProps?.defaultValue);

  // onInputChange
  const onInputChangeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) {
        return;
      }

      updateDraggableProps(item.id, "value", e.target.value);
    },
    [isDisabled, updateDraggableProps, item.id]
  );

  // useEffect
  React.useEffect(() => {
    if (!isDisabled && !itemProps?.value && itemProps?.value !== "") {
      updateDraggableProps(item.id, "value", stringifiedOutput);
    }
  }, [
    isDisabled,
    item.id,
    itemProps?.value,
    stringifiedOutput,
    updateDraggableProps,
  ]);

  return (
    <TextField
      autoComplete={isDisabled ? "off" : "on"}
      placeholder={itemProps?.placeholder ?? "Enter your text"}
      fullWidth
      variant="standard"
      InputProps={{
        disableUnderline: true,
      }}
      sx={{
        paddingX: 4,
      }}
      onChange={onInputChangeHandler}
      value={!isDisabled && itemProps?.value ? itemProps.value : ""}
    />
  );
});
