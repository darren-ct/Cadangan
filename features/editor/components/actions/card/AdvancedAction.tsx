import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type {
  ActionCardProps,
  AdvancedActionOperator,
} from "@/features/editor";
import { ActionPopup, useMenuAdvancedAction } from "@/features/editor";

export const AdvancedAction = React.memo(function AdvancedAction({
  action,
  onUpdate,
}: Omit<ActionCardProps, "onDelete">) {
  const {
    conditionActions,
    conditionAnchorEl,
    currentAdvancedProps,
    handleCloseCondition,
    handleOpenCondition,
    handleConditionSelect,
    operatorActions,
    handleOperatorSelect,
  } = useMenuAdvancedAction({ action, handleActionUpdate: onUpdate });

  return (
    <Stack direction="column" sx={{ py: 2 }} gap={1}>
      <Typography fontWeight={500} variant="subtitle2">
        This action will only happen if...
      </Typography>
      <Button
        fullWidth
        sx={{
          backgroundColor: "white",
          textTransform: "none",
          justifyContent: "start",
        }}
        onClick={(e) => handleOpenCondition(e.currentTarget as HTMLElement)}
      >
        {!currentAdvancedProps ? "Select" : currentAdvancedProps?.title}
      </Button>
      {currentAdvancedProps && (
        <>
          <Select
            size="small"
            value={currentAdvancedProps?.operator}
            onChange={(e) =>
              handleOperatorSelect(e.target.value as AdvancedActionOperator)
            }
            sx={(theme) => ({
              fontSize: 12,
              fontWeight: "500",
              color: theme.palette.primary[500],
            })}
          >
            {operatorActions.map((item) => (
              <MenuItem value={item.value}>{item.label}</MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            placeholder="Empty"
            value={
              !currentAdvancedProps?.value?.value
                ? ""
                : String(currentAdvancedProps?.value?.value)
            }
          />
        </>
      )}
      <ActionPopup
        anchorEl={conditionAnchorEl}
        onClose={handleCloseCondition}
        onCloseAll={handleCloseCondition}
        actions={conditionActions}
        onSelect={handleConditionSelect}
      />
    </Stack>
  );
});
