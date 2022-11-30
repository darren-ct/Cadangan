import Chip from "@mui/material/Chip";
import { grey, lightBlue } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ArrowDownIcon } from "@/assets/icons";
import { InputButton } from "@/components/Form";
import type { Field, Row } from "@/types";

import type { FormTryServiceSimple } from "../../../types";

interface Props {
  w?: string;
  field: Field;
  index?: number;
  onPress: () => void;
}

export const InputLinkToRecord = React.memo(function InputLinkToRecord({
  w,
  field,
  index,
  onPress,
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const value = useWatch({
    control,
    name:
      index !== undefined
        ? `selectedLinkRecordParams.${index}`
        : `selectedLinkRecordBody.${field.name}`,
  });
  const secondValue = useWatch({
    control,
    name:
      index !== undefined
        ? `selectedLinkRecordParamsPrimary.${index}`
        : `selectedLinkRecordBodyPrimary.${field.name}`,
  });

  const records = value as (Row | null)[] | undefined;
  const primaryFieldName = secondValue as string | undefined;

  return (
    <InputButton
      sx={{
        width: w,
      }}
      disableRipple
      onClick={onPress}
    >
      <Stack
        sx={{
          flex: "1",
          overflow: "hidden",
          alignItems: "center",
        }}
        direction="row"
        spacing={0.5}
      >
        {records && records.length > 0 ? (
          records.map((item, index) => {
            const recordName =
              item && (item[primaryFieldName] as string | null | undefined);

            return (
              <Chip
                key={index}
                size="small"
                sx={{
                  backgroundColor: lightBlue[50],
                }}
                label={!recordName ? "Unnamed Record" : recordName}
              />
            );
          })
        ) : (
          <Typography color={grey[500]} fontSize="0.875em">
            {field.name}
          </Typography>
        )}
      </Stack>
      <ArrowDownIcon />
    </InputButton>
  );
});
