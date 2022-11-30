import * as React from "react";

import type {
  Action,
  CreateRecordActionProps,
  DeleteRecordActionProps,
} from "@/features/editor";
import { useDisclose } from "@/hooks";
import { Table } from "@/widgets/types";

interface Props {
  action: Action;
  handleActionUpdate: (id: string, action: Action) => unknown;
  handleActionDelete: (id: string) => unknown;
  createActions: Action[];
  userTableId: string;
}

export const useDraggableDeleteAction = ({
  action,
  handleActionDelete,
  handleActionUpdate,
  createActions,
  userTableId,
}: Props) => {
  const { isOpen, onToggle } = useDisclose();

  const pickedTable = React.useMemo(() => {
    const actionProps: DeleteRecordActionProps =
      action.props as DeleteRecordActionProps;

    if (!actionProps.table) {
      return;
    }

    if (!createActions) {
      return;
    }

    return (
      createActions?.filter(
        (actionItem) =>
          (actionItem.props as CreateRecordActionProps).table.id ===
          (action.props as DeleteRecordActionProps).table?.id
      )[0]?.props as CreateRecordActionProps
    ).table;
  }, [action.props, createActions]);

  // Functions
  const onSelectItem = React.useCallback(
    (value: string) => {
      const parsedValue: Table =
        value === "LOGGED_IN_USER" ? undefined : JSON.parse(value);

      const newAction: Action = {
        id: parsedValue
          ? `DELETE-DELETE_RECORD-${parsedValue.id}-${parsedValue.name}`
          : "DELETE-DELETE_LOGGED_IN_USER",
        title: parsedValue ? `New ${parsedValue.name}` : "Logged In User",
        type: parsedValue ? "DELETE_RECORD" : "DELETE_LOGGED_IN_USER",
        props: {
          table: parsedValue ?? undefined,
          tableId: parsedValue ? undefined : userTableId,
        },
      };

      handleActionUpdate(action.id, newAction);
    },
    [action, handleActionUpdate, userTableId]
  );

  const onRemoveAction = React.useCallback(
    (id: string) => {
      handleActionDelete(id);
    },
    [handleActionDelete]
  );

  const onSubmitAction = React.useCallback(() => {
    onToggle();
  }, [onToggle]);

  return {
    isOpen,
    onToggle,
    onSelectItem,
    onRemoveAction,
    onSubmitAction,
    pickedTable,
    createActions,
  };
};
