/* eslint-disable @typescript-eslint/ban-ts-comment */
import Chip from "@mui/material/Chip";
import { grey, lightBlue } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ArrowDownIcon } from "@/assets/icons";
import { InputButton } from "@/components/Form";
import type { Row } from "@/types";

import type { FormTryServiceSimple } from "../../../../types";

interface Props {
  w?: string;
  fieldName: string;
  primaryFieldName: string;
  onPress: () => void;
}

export const InputLinkRecord = React.memo(function InputLinkRecord({
  w,
  fieldName,
  primaryFieldName,
  onPress,
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const value = useWatch({
    control,
    name: `selectedLinkRecordBody.${fieldName}`,
  });

  const record = value as Row | null | undefined;
  // @ts-ignore
  const recordName =
    record && (record[primaryFieldName] as string | null | undefined);

  return (
    <InputButton
      sx={{
        width: w,
      }}
      onClick={onPress}
    >
      <Stack direction="row" flex="1" alignItems="center">
        {recordName !== undefined ? (
          <Chip
            size="small"
            sx={{
              backgroundColor: lightBlue[50],
            }}
            label={!recordName ? "Unnamed Record" : recordName}
          />
        ) : (
          <Typography color={grey[500]} fontSize="0.875em" variant="subtitle1">
            Select record
          </Typography>
        )}
      </Stack>
      <ArrowDownIcon
        sx={{
          color: "black",
        }}
      />
    </InputButton>
  );
});
