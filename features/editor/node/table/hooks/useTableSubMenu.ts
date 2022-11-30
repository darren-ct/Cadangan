import { useRouter } from "next/router";
import * as React from "react";

import type { Draggable, TableItemProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { useGetFields, useGetTable } from "@/widgets/api";
import { useDisclose, useGlobalEventStore } from "@/widgets/hooks";
import {
  ExplorerParams,
  Table,
  ToolbarFilterValue,
  ToolbarGroupValue,
  ToolbarHiddenFieldsValue,
  ToolbarSortValue,
} from "@/widgets/types";

interface Props {
  item: Draggable;
}

export const useTableSubMenu = ({ item }: Props) => {
  const { onGetTables } = useGlobalEventStore((state) => state);
  const { updateDraggable } = useEditorDraggableStore();

  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;

  const { isOpen: isTableSectionOpen, onToggle: onTableSectionToggle } =
    useDisclose();
  const { isOpen: isOptionSectionOpen, onToggle: onOptionSectionToggle } =
    useDisclose();

  const { data: dataTables, isLoading: isLoadingGetTables } = useGetTable({
    getTables: onGetTables,
  });

  const currentProps = React.useMemo(() => {
    if (!item?.props) return {} as TableItemProps;

    return item?.props as TableItemProps;
  }, [item]);

  const fieldsEnabled = !!currentProps?.table;

  const { data: rawFields, isLoading: isLoadingGetFields } = useGetFields({
    dbId: databaseId,
    table: currentProps?.table,
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

  const handleTableSelect = React.useCallback(
    (table: Table) => {
      let inputProps = currentProps;

      inputProps = {
        ...inputProps,
        table,
        filter: null,
        group: null,
        sort: null,
      };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id]
  );

  const memoizedFields = React.useMemo(() => {
    if (!rawFields) return [];

    return rawFields;
  }, [rawFields]);

  const handleTableFilterChange = React.useCallback(
    (filter: ToolbarFilterValue[]) => {
      let inputProps = currentProps;

      inputProps = { ...inputProps, filter };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id]
  );

  const handleTableSortChange = React.useCallback(
    (sort: ToolbarSortValue[]) => {
      let inputProps = currentProps;

      inputProps = { ...inputProps, sort };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id]
  );

  const handleTableGroupChange = React.useCallback(
    (group: ToolbarGroupValue[]) => {
      let inputProps = currentProps;

      inputProps = { ...inputProps, group };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id]
  );

  const handleTableHideFieldChange = React.useCallback(
    (hiddenFields: ToolbarHiddenFieldsValue[]) => {
      let inputProps = currentProps;

      inputProps = { ...inputProps, hiddenFields };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id]
  );

  return {
    isLoadingGetTables,
    isLoadingGetFields,
    isTableSectionOpen,
    isOptionSectionOpen,
    memoizedTables,
    memoizedFields,
    handleTableSelect,
    handleTableFilterChange,
    handleTableSortChange,
    handleTableGroupChange,
    handleTableHideFieldChange,
    onOptionSectionToggle,
    onTableSectionToggle,
  };
};
