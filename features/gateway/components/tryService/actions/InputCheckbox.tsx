import Checkbox from "@mui/material/Checkbox";
import { grey } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { CheckboxIcon } from "@/components/Form/CheckboxIcon";
import type { FieldStyle, UseControllerProps } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string;
  fieldName: string;
  fieldStyle: FieldStyle | null;
}

export const InputCheckbox = React.memo(function InputCheckbox({
  w,
  fieldStyle,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value, onChange },
  } = useController({ control, ...rest });

  const isChecked = value as boolean | undefined;

  return (
    <Stack
      sx={{
        width: w,
        height: "36px",
      }}
      justifyContent="center"
      alignItems="flex-start"
    >
      <Checkbox
        sx={(theme) => ({
          padding: 0.5,
          backgroundColor: "white",
          borderRadius: 1,
          border: `1px ${theme.palette.grey[400]} solid`,
          ":hover": {
            border: `1px ${theme.palette.grey[700]} solid`,
          },
          ":focus": {
            border: `2px ${theme.palette.primary.main} solid`,
          },
        })}
        value={isChecked}
        icon={
          <CheckboxIcon
            fieldStyle={{ ...fieldStyle, color: grey[500] }}
            fieldStyles={[]}
          />
        }
        checkedIcon={<CheckboxIcon fieldStyle={fieldStyle} fieldStyles={[]} />}
        inputProps={{ "aria-label": "controlled" }}
        onChange={onChange}
      />
    </Stack>
  );
});
