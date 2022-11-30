import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { ActionCardProps, Draggable } from "@/features/editor";
import {
  ActionPopup,
  ExpandableCard,
  Form,
  useDraggableCreateAction,
  useSubMenuAction,
} from "@/features/editor";

export const CreateActionCard = React.memo(function CreateActionCard({
  bgColor,
  item,
  action,
  onDelete,
  onUpdate,
}: ActionCardProps) {
  const { handleCreateActions } = useSubMenuAction();

  const {
    anchorEl,
    handleOpenPopup,
    handleClosePopup,
    isOpen,
    onToggle,
    handleCreateFieldsSubmit,
    table,
    dataSource,
    actionFields,
  } = useDraggableCreateAction({ action, handleActionUpdate: onUpdate });

  const actions = React.useMemo(
    () => handleCreateActions(),
    [handleCreateActions]
  );

  return (
    <ExpandableCard
      backgroundColor={bgColor}
      active={isOpen}
      title="Create"
      subTitle={table?.name ?? ""}
      onClick={onToggle}
      onRemove={action?.isDefault ? undefined : () => onDelete(action.id)}
    >
      {!action?.isDefault && (
        <>
          <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
            <Button
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
                textTransform: "none",
                justifyContent: "start",
              }}
              onClick={(e) => handleOpenPopup(e.currentTarget as HTMLElement)}
            >
              <Stack direction="column" justifyContent="start">
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.grey[500],
                    fontSize: theme.typography.fontSize - 1,
                  })}
                >
                  Collection
                </Typography>
                <Typography
                  sx={(theme) => ({ fontSize: theme.typography.fontSize })}
                >
                  {table?.name ?? ""}
                </Typography>
              </Stack>
            </Button>
            <Form
              item={item as Draggable}
              onSubmit={handleCreateFieldsSubmit}
              buttonText="Done"
              fields={actionFields}
              foreignFields={dataSource.foreignFields}
              onGetForeignRecords={dataSource.onGetForeignRecords}
              onRowChange={dataSource.onRowChange}
              onUploadAttachment={dataSource.onUploadAttachment}
            />
          </Stack>
          <ActionPopup
            actions={actions}
            anchorEl={anchorEl}
            onClose={handleClosePopup}
            onCloseAll={handleClosePopup}
            onSelect={(newAction) => onUpdate(action.id, newAction)}
          />
        </>
      )}
      {action?.isDefault && (
        <Typography
          variant="subtitle2"
          sx={(theme) => ({
            textAlign: "center",
            color: theme.palette.primary[500],
            fontSize: theme.typography.fontSize,
          })}
        >
          Clicking the Submit Button on the form will create the{" "}
          {table?.name ?? ""}
        </Typography>
      )}
    </ExpandableCard>
  );
});
