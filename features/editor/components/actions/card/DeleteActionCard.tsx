import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import * as React from "react";

import type {
  ActionCardProps,
  CreateRecordActionProps,
} from "@/features/editor";
import { ExpandableCard, useDraggableDeleteAction } from "@/features/editor";

export const DeleteActionCard = React.memo(function DeleteActionCard({
  bgColor,
  action,
  createActions,
  userTableId,
  onDelete,
  onUpdate,
}: ActionCardProps) {
  const {
    pickedTable,
    isOpen,
    onToggle,
    onSelectItem,
    onRemoveAction,
    onSubmitAction,
  } = useDraggableDeleteAction({
    action,
    createActions,
    userTableId,
    handleActionDelete: onDelete,
    handleActionUpdate: onUpdate,
  });

  return (
    <ExpandableCard
      backgroundColor={bgColor}
      active={isOpen}
      title="Delete"
      subTitle={action.title}
      onClick={onToggle}
      onRemove={() => onRemoveAction(action.id)}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{ width: "100%" }}
        marginTop={1}
      >
        <FormControl fullWidth>
          <InputLabel id="collection-label">Collection</InputLabel>
          <Select
            size="small"
            labelId="collection-label"
            id="collection-label"
            value={pickedTable ? JSON.stringify(pickedTable) : "LOGGED_IN_USER"}
            label="Collection"
            onChange={(e) => onSelectItem(e.target.value)}
            sx={{ fontSize: "12px" }}
          >
            <MenuItem value="LOGGED_IN_USER" sx={{ fontSize: "12px" }}>
              Logged In User
            </MenuItem>
            {createActions?.map((actionItem) => (
              <MenuItem
                key={actionItem.id}
                value={JSON.stringify(
                  (actionItem.props as CreateRecordActionProps).table
                )}
                sx={{ fontSize: "12px" }}
              >
                {"New " + actionItem.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size="small"
          variant="contained"
          onClick={onSubmitAction}
          sx={{ fontSize: "11px" }}
        >
          Done
        </Button>
      </Stack>
    </ExpandableCard>
  );
});
