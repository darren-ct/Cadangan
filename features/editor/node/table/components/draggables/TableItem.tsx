import { useRouter } from "next/router";
import * as React from "react";

import type { Draggable, TableItemProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";
import { GridView } from "@/widgets/features/gridview";
import { useDataSource } from "@/widgets/hooks";
import {
  DataSourceOptions,
  ExplorerParams,
  ToolbarFilterValue,
  ToolbarGroupValue,
  ToolbarHiddenFieldsValue,
  ToolbarSortValue,
} from "@/widgets/types";

interface Props {
  item: Draggable;
}

export const TableItem = React.memo(function TableItem({ item }: Props) {
  const router = useRouter();
  const { updateDraggable } = useEditorDraggableStore();
  const { databaseId } = router.query as ExplorerParams;

  const {
    table: propsTable,
    filter: propsFilter,
    group: propsGroup,
    hiddenFields: propsHiddenFields,
    sort: propsSort,
  } = React.useMemo(() => (item.props ?? {}) as TableItemProps, [item.props]);

  const table = propsTable;

  const options: DataSourceOptions = React.useMemo(() => {
    let opt: DataSourceOptions = {
      pageSize: 50,
      onlyGateway: false,
    };

    if (propsFilter) {
      opt = { ...opt, filter: propsFilter };
    }

    if (propsGroup) {
      opt = { ...opt, group: propsGroup };
    }

    if (propsSort) {
      opt = { ...opt, sort: propsSort };
    }

    if (propsHiddenFields) {
      opt = { ...opt, hiddenFields: propsHiddenFields };
    }

    return opt;
  }, [propsFilter, propsGroup, propsSort, propsHiddenFields]);

  const {
    dataSource,
    fields,
    filter,
    foreignFields,
    group,
    hiddenFields,
    isLoading,
    fullLoading,
    sort,
    onFieldChange,
    onGetFieldStyles,
    onGetForeignRecords,
    onGetTables,
    onLoadMore,
    onRowChange,
    onUploadAttachment,
    onDetectFieldOptions,
  } = useDataSource(databaseId, table, options, item.id);

  console.log({ dataSource });

  const setSort = React.useCallback(
    (sort: ToolbarSortValue[]) => {
      let inputProps = item.props as TableItemProps;

      inputProps = { ...inputProps, sort };

      updateDraggable(item.id, { props: inputProps });
    },
    [item.id, updateDraggable, item.props]
  );

  const setFilter = React.useCallback(
    (filter: ToolbarFilterValue[]) => {
      let inputProps = item.props as TableItemProps;

      inputProps = { ...inputProps, filter };

      updateDraggable(item.id, { props: inputProps });
    },
    [item.id, updateDraggable, item.props]
  );

  const setGroup = React.useCallback(
    (group: ToolbarGroupValue[]) => {
      let inputProps = item.props as TableItemProps;

      inputProps = { ...inputProps, group };

      updateDraggable(item.id, { props: inputProps });
    },
    [item.id, updateDraggable, item.props]
  );

  const setHiddenFields = React.useCallback(
    (hiddenFields: ToolbarHiddenFieldsValue[]) => {
      let inputProps = item.props as TableItemProps;

      inputProps = { ...inputProps, hiddenFields };

      updateDraggable(item.id, { props: inputProps });
    },
    [item.id, updateDraggable, item.props]
  );

  if (!table) return <>Please select table</>;

  return (
    <GridView
      id={item.id}
      fields={fields}
      filter={filter}
      foreignFields={foreignFields}
      group={group}
      hiddenFields={hiddenFields}
      isLoading={isLoading}
      fullLoading={fullLoading}
      sort={sort}
      src={dataSource}
      onFieldChange={onFieldChange}
      onFilter={setFilter}
      onGetFieldStyles={onGetFieldStyles}
      onGetForeignRecords={onGetForeignRecords}
      onGetTables={onGetTables}
      onGroup={setGroup}
      onHideFields={setHiddenFields}
      onLoadMore={onLoadMore}
      onRowChange={onRowChange}
      onSort={setSort}
      onUploadAttachment={onUploadAttachment}
      config={{ hideToolbar: false, simpleMode: true }}
      onDetectFieldOptions={onDetectFieldOptions}
    />
  );
});
