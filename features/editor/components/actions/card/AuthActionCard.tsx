import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { ActionCardProps, Draggable } from "@/features/editor";
import {
  loggedInUserDefaultProps,
  useDraggableAuthAction,
} from "@/features/editor";

import { ExpandableCard } from "../../elements";
import { FormFields } from "./helpers";

export const AuthActionCard = React.memo(function AuthActionCard({
  bgColor,
  action,
  onDelete,
  onUpdate,
  item,
}: ActionCardProps) {
  const { form, setForm, isOpen, onToggle, onSubmitAction, onRemoveAction } =
    useDraggableAuthAction({
      action,
      handleActionDelete: onDelete,
      handleActionUpdate: onUpdate,
    });

  return (
    <ExpandableCard
      backgroundColor={bgColor}
      active={isOpen}
      title={action.title}
      onClick={onToggle}
      onRemove={() => onRemoveAction(action.id)}
    >
      <Stack direction="column" spacing={1.7} sx={{ width: "100%" }}>
        {action.subType === "AUTH_LOGOUT" && (
          <Typography
            sx={{
              textAlign: "center",
              marginY: 3,
              fontSize: "12px",
            }}
          >
            No options
          </Typography>
        )}

        {action.subType === "AUTH_SIGNUP" &&
          Object.keys(loggedInUserDefaultProps).map((field) => (
            <FormFields
              item={item as Draggable}
              field={field}
              form={form}
              setForm={setForm}
            />
          ))}

        {action.subType === "AUTH_LOGIN" && (
          <React.Fragment>
            <FormFields
              item={item as Draggable}
              field={"email"}
              form={form}
              setForm={setForm}
            />
            <FormFields
              item={item as Draggable}
              field={"password"}
              form={form}
              setForm={setForm}
            />
          </React.Fragment>
        )}
      </Stack>
      <Button
        variant="contained"
        size="small"
        onClick={onSubmitAction}
        sx={{ fontSize: "11px", width: "100%", marginTop: "24px" }}
      >
        Done
      </Button>
    </ExpandableCard>
  );
});
