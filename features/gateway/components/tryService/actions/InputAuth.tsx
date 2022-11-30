import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ArrowDownIcon } from "@/assets/icons";
import { InputButton } from "@/components/Form";
import type { Authentication } from "@/types";

interface Props {
  auth: Authentication;
  onPress: () => void;
}

export const InputAuth = React.memo(function InputAuth({
  auth,
  onPress,
}: Props) {
  return (
    <InputButton disableFocusRipple onClick={onPress}>
      <Stack direction="row" flex="1" alignItems="center">
        <Typography fontSize="0.875em" variant="subtitle1">
          {auth.identity}
        </Typography>
      </Stack>
      <ArrowDownIcon
        sx={{
          color: "black",
        }}
      />
    </InputButton>
  );
});
