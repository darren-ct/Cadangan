import * as React from "react";

import type { ActionCardProps } from "@/features/editor";
import {
  ExpandableCard,
  useDraggableAction,
  useSubMenuAction,
} from "@/features/editor";

import { AuthActionCard } from "./AuthActionCard";
import { CreateActionCard } from "./CreateActionCard";
import { DeleteActionCard } from "./DeleteActionCard";
import { LinkActionCard } from "./LinkActionCard";
import { UpdateActionCard } from "./UpdateActionCard";

export const ActionCard = React.memo(function ActionCard({
  action,
  item,
  updateNavLinkProps,
  bgColor,
}: Omit<ActionCardProps, "onUpdate" | "onDelete">) {
  const { handleActionUpdate, handleActionDelete } = useDraggableAction({
    item,
    updateNavLinkProps,
  });

  const { createActions, userTableId } = useSubMenuAction(item);

  if (action.type === "LINK")
    return (
      <LinkActionCard
        bgColor={bgColor}
        action={action}
        onDelete={handleActionDelete}
        onUpdate={handleActionUpdate}
        item={item}
      />
    );

  if (action.type === "CREATE_RECORD")
    return (
      <CreateActionCard
        bgColor={bgColor}
        action={action}
        onDelete={handleActionDelete}
        onUpdate={handleActionUpdate}
        item={item}
      />
    );

  if (
    action.type === "UPDATE_RECORD" ||
    action.type === "UPDATE_LOGGED_IN_USER"
  )
    return (
      <UpdateActionCard
        bgColor={bgColor}
        action={action}
        onDelete={handleActionDelete}
        onUpdate={handleActionUpdate}
        item={item}
        createActions={createActions}
        userTableId={userTableId}
      />
    );

  if (
    action.type === "DELETE_RECORD" ||
    action.type === "DELETE_LOGGED_IN_USER"
  )
    return (
      <DeleteActionCard
        bgColor={bgColor}
        action={action}
        onDelete={handleActionDelete}
        onUpdate={handleActionUpdate}
        createActions={createActions}
        userTableId={userTableId}
      />
    );

  if (action.type === "AUTH") {
    return (
      <AuthActionCard
        bgColor={bgColor}
        action={action}
        onDelete={handleActionDelete}
        onUpdate={handleActionUpdate}
        item={item}
      />
    );
  }
  return (
    <ExpandableCard
      title={action.title}
      onClick={() => console.log(action, "act")}
    />
  );
});
