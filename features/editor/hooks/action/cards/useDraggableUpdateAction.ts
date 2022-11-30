import { useRouter } from "next/router";
import * as React from "react";

import type {
  Action,
  CreateRecordActionProps,
  UpdateRecordActionProps,
  UserRecordFields,
} from "@/features/editor";
import {
  loggedInUserDefaultProps,
  UpdateLoggedInUserActionProps,
} from "@/features/editor";
import { useDisclose } from "@/hooks";
import { useDataSource } from "@/widgets";
import { Field, Row, Table } from "@/widgets/types";

interface Props {
  action: Action;
  handleActionUpdate: (id: string, action: Action) => unknown;
  handleActionDelete: (id: string) => unknown;
  createActions: Action[];
  userTableId: string;
}

export const useDraggableUpdateAction = ({
  action,
  handleActionDelete,
  handleActionUpdate,
  createActions,
  userTableId,
}: Props) => {
  const { databaseId } = useRouter().query;

  const { isOpen, onToggle } = useDisclose();
  const [form, setForm] = React.useState<UserRecordFields>(
    (action.props as UpdateLoggedInUserActionProps)?.fields ??
      loggedInUserDefaultProps
  );

  // Get Fields
  const pickedTable = React.useMemo(() => {
    const actionProps: UpdateRecordActionProps =
      action.props as UpdateRecordActionProps;

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
          (action.props as UpdateRecordActionProps).table?.id
      )[0]?.props as CreateRecordActionProps
    )?.table;
  }, [action.props, createActions]);

  const dataSource = useDataSource(databaseId as string, pickedTable);

  const actionFields: Field[] = React.useMemo(() => {
    const fields = dataSource.fields;
    const defaultValues = (action.props as UpdateRecordActionProps).fields;

    if (!defaultValues) {
      return fields.map((field) => ({ ...field, defaultValue: null }));
    }

    const defaultValuesPairs = Object.entries(defaultValues);

    // Iterate through all fields
    for (let fieldsIndex = 0; fieldsIndex < fields.length; fieldsIndex++) {
      // Fill with default values
      for (
        let defValuesIndex = 0;
        defValuesIndex < defaultValuesPairs.length;
        defValuesIndex++
      ) {
        if (
          fields[fieldsIndex].name === defaultValuesPairs[defValuesIndex][0]
        ) {
          fields[fieldsIndex].defaultValue = defaultValuesPairs[
            defValuesIndex
          ][1] as string | number | boolean;
          defaultValuesPairs.splice(defValuesIndex, 1);
          break;
        }
      }
    }

    return fields;
  }, [action.props, dataSource.fields]);

  // Functions
  const onSelectItem = React.useCallback(
    (value: string) => {
      const parsedValue: Table =
        value === "LOGGED_IN_USER" ? undefined : JSON.parse(value);

      const newAction: Action = {
        id: parsedValue
          ? `UPDATE-UPDATE_RECORD-${parsedValue.id}-${parsedValue.name}`
          : "UPDATE-UPDATE_LOGGED_IN_USER",
        title: parsedValue ? `New ${parsedValue.name}` : "Logged In User",
        type: parsedValue ? "UPDATE_RECORD" : "UPDATE_LOGGED_IN_USER",
        props: {
          table: parsedValue ?? undefined,
          tableId: parsedValue ? undefined : userTableId,
          fields: parsedValue ? undefined : loggedInUserDefaultProps,
        },
      };

      handleActionUpdate(action.id, newAction);
    },
    [action.id, handleActionUpdate, userTableId]
  );

  const onRemoveAction = React.useCallback(
    (id: string) => {
      handleActionDelete(id);
    },
    [handleActionDelete]
  );
  // Table & Fields Related
  const handleUpdateFieldsSubmit = React.useCallback(
    (values: Row) => {
      const body = {};

      Object.entries(values).forEach(([key, value]) => {
        if (!value) return;

        body[key] = value;
      });

      const newAction: Action = {
        ...action,
        props: {
          ...action.props,
          fields: body,
        } as UpdateRecordActionProps,
      };
      handleActionUpdate(action.id, newAction);
      onToggle();
    },
    [action, handleActionUpdate, onToggle]
  );

  // Logged-In-User Related
  const onSubmitUserFields = React.useCallback(() => {
    const newAction: Action = {
      ...action,
      props: { ...action.props, fields: form },
    };

    handleActionUpdate(action.id, newAction);
    onToggle();
  }, [action, form, handleActionUpdate, onToggle]);

  return {
    isOpen,
    onToggle,
    onSelectItem,
    onRemoveAction,
    onSubmitUserFields,
    handleUpdateFieldsSubmit,
    pickedTable,
    dataSource,
    actionFields,
    form,
    setForm,
  };
};
