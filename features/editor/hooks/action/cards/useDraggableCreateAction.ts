import { useRouter } from "next/router";
import * as React from "react";

import { useDisclose } from "@/hooks";
import { useDataSource } from "@/widgets";
import type { ExplorerParams, Row } from "@/widgets/types";

import type {
  Action,
  CreateRecordActionProps,
  SharedMutateRecordActionProps,
} from "../../../types";

interface Props {
  action: Action;
  handleActionUpdate: (id: string, newAction: Action) => unknown;
}

export const useDraggableCreateAction = ({
  action,
  handleActionUpdate,
}: Props) => {
  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;

  const { isOpen, onToggle } = useDisclose();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const table = React.useMemo(() => {
    if (!(action?.props as CreateRecordActionProps)?.table) return;

    return (action?.props as CreateRecordActionProps)?.table;
  }, [action?.props]);

  const rawActionFields = React.useMemo(() => {
    if (!(action?.props as SharedMutateRecordActionProps)?.fields) return;

    return (action?.props as SharedMutateRecordActionProps)?.fields;
  }, [action?.props]);

  const dataSource = useDataSource(databaseId as string, table);

  const actionFields = React.useMemo(() => {
    if (!dataSource?.fields) return [];
    if (!rawActionFields) return dataSource.fields;

    const rawActionFieldNames = Object.entries(rawActionFields);

    return dataSource.fields.map((field) => {
      const rawActionField = rawActionFieldNames.find(
        ([key]) => field.name === key
      );

      if (!rawActionField) return field;

      const [, value] = rawActionField;
      field.defaultValue = value as string | number | boolean;

      return field;
    });
  }, [dataSource?.fields, rawActionFields]);

  const handleOpenPopup = React.useCallback((anchorEl: HTMLElement) => {
    setAnchorEl(anchorEl);
  }, []);

  const handleClosePopup = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleCreateFieldsSubmit = React.useCallback(
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
        } as CreateRecordActionProps,
      };

      handleActionUpdate(action.id, newAction);
      onToggle();
    },
    [action, handleActionUpdate, onToggle]
  );

  return {
    anchorEl,
    isOpen,
    onToggle,
    handleOpenPopup,
    handleClosePopup,
    handleCreateFieldsSubmit,
    table,
    dataSource,
    actionFields,
  };
};
