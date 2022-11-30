import { grey } from "@mui/material/colors";
import Rating from "@mui/material/Rating";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { RatingIcon } from "@/components/Form/RatingIcon";
import type { FieldStyle, UseControllerProps } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string;
  fieldName: string;
  fieldStyle: FieldStyle | null;
  max: number;
}

export const InputRating = React.memo(function InputRating({
  w,
  fieldName,
  fieldStyle,
  max,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value, onChange },
  } = useController({ control, ...rest });

  const rating = value as number | undefined;

  return (
    <Rating
      sx={(theme) => ({
        width: w,
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        paddingX: 1,
        paddingY: 0.5,
        borderRadius: 1,
        border: `1px ${theme.palette.grey[400]} solid`,
        ":hover": {
          border: `1px ${theme.palette.grey[700]} solid`,
        },
        ":focus": {
          border: `2px ${theme.palette.primary.main} solid`,
        },
      })}
      value={rating}
      name={fieldName}
      precision={1}
      size="large"
      max={max}
      icon={
        <RatingIcon
          fieldStyles={[]}
          fieldStyle={fieldStyle}
          fontSize="inherit"
        />
      }
      emptyIcon={
        <RatingIcon
          fieldStyles={[]}
          fieldStyle={{ ...fieldStyle, color: grey[500] }}
          fontSize="inherit"
        />
      }
      onChange={onChange}
    />
  );
});
