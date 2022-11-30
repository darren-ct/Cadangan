import { useRouter } from "next/router";
import * as React from "react";

import type { Draggable, KanbanProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useDisclose } from "@/hooks";
import { useGetFields, useGetTable } from "@/widgets/api";
import { useGlobalEventStore } from "@/widgets/hooks";
import {
  ExplorerParams,
  Field,
  Table,
  ToolbarFilterValue,
  ToolbarHiddenFieldsValue,
  ToolbarSortValue,
} from "@/widgets/types";

interface Props {
  item: Draggable;
}

export const useKanbanSubMenu = ({ item }: Props) => {
  const { onGetTables } = useGlobalEventStore((state) => state);
  const { updateDraggable } = useEditorDraggableStore();

  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;

  const { isOpen: isTableSectionOpen, onToggle: onTableSectionToggle } =
    useDisclose();
  const { isOpen: isOptionSectionOpen, onToggle: onOptionSectionToggle } =
    useDisclose();

  const kanbanProps = React.useMemo(() => {
    return item.props as KanbanProps;
  }, [item.props]);

  // Get Datas
  const { data: dataTables, isLoading: isLoadingGetTables } = useGetTable({
    getTables: onGetTables,
  });

  const fieldsEnabled = !!kanbanProps?.table;

  const { data: rawFields, isLoading: isLoadingGetFields } = useGetFields({
    dbId: databaseId,
    table: kanbanProps?.table,
    enabled: fieldsEnabled,
  });

  const memoizedTables = React.useMemo(() => {
    let data: Table[] = [];

    if (dataTables) {
      data = dataTables.slice(0);

      const systemTables = data.filter((item) => item.isLockedBySystem);
      const rolesTable = systemTables.find((item) => item.name === "Roles");
      const usersTable = systemTables.find((item) => item.name === "Users");

      if (rolesTable?.id && usersTable?.id) {
        const otherTables = data.filter(
          (item) =>
            item.id !== rolesTable.id &&
            item.id !== usersTable.id &&
            !item.isApiGateway
        );

        data = [usersTable, ...otherTables];
      }
    }

    return data;
  }, [dataTables]);

  const memoizedFields = React.useMemo(() => {
    if (!rawFields) return [];

    return rawFields;
  }, [rawFields]);

  // Functions
  const handleTableSelect = React.useCallback(
    (table: Table) => {
      let inputProps = kanbanProps;

      inputProps = {
        ...inputProps,
        table,
        filter: null,
        group: null,
        sort: null,
      };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, kanbanProps, item.id]
  );

  const handleTableFilterChange = React.useCallback(
    (filter: ToolbarFilterValue[]) => {
      let inputProps = kanbanProps;

      inputProps = { ...inputProps, filter };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, kanbanProps, item.id]
  );

  const handleTableSortChange = React.useCallback(
    (sort: ToolbarSortValue[]) => {
      let inputProps = kanbanProps;

      inputProps = { ...inputProps, sort };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, kanbanProps, item.id]
  );

  const handleTableHideFieldChange = React.useCallback(
    (hiddenFields: ToolbarHiddenFieldsValue[]) => {
      let inputProps = kanbanProps;

      inputProps = { ...inputProps, hiddenFields };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, kanbanProps, item.id]
  );

  const handleStackingFieldChange = React.useCallback(
    (field: Field) => {
      let inputProps = kanbanProps;

      inputProps = { ...inputProps, stackingField: field };

      updateDraggable(item.id, { props: inputProps });
    },
    [item.id, kanbanProps, updateDraggable]
  );

  return {
    kanbanProps,
    isTableSectionOpen,
    isOptionSectionOpen,
    isLoadingGetTables,
    isLoadingGetFields,
    memoizedTables,
    memoizedFields,
    handleTableSelect,
    handleTableFilterChange,
    handleTableSortChange,
    handleTableHideFieldChange,
    handleStackingFieldChange,
    onOptionSectionToggle,
    onTableSectionToggle,
  };
};
