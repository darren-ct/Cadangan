import Stack from "@mui/material/Stack";
import * as React from "react";

import { InputNumber } from "../InputNumber";

export const InputPagination = React.memo(function InputPagination() {
  return (
    <Stack direction="row" spacing={1}>
      <InputNumber w="50%" placeholder="Limit" name="pagination.limit" />
      <InputNumber w="50%" placeholder="Skip" name="pagination.skip" />
    </Stack>
  );
});
