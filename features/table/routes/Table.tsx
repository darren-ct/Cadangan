import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import * as React from "react";

import { ExplorerSidebar } from "@/features/explorer";
import { GridView, useDataSource, usePersistToolbar } from "@/widgets";
import { DataSourceOptions, ExplorerParams } from "@/widgets/types";

export const Table = () => {
  const router = useRouter();
  const { tableId, databaseId } = router.query as ExplorerParams;

  const table = React.useMemo(
    () => ({ id: tableId as string, name: "" }),
    [tableId]
  );

  const toolbar = usePersistToolbar(table);

  const { setFilter, setGroup, setHiddenFields, setSort } = toolbar;

  const options = React.useMemo(() => {
    const { filter, group, hiddenFields, sort } = toolbar;
    let opt: DataSourceOptions = { pageSize: 50 };

    if (filter) {
      opt = { ...opt, filter };
    }

    if (group) {
      opt = { ...opt, group };
    }

    if (hiddenFields) {
      opt = { ...opt, hiddenFields };
    }

    if (sort) {
      opt = { ...opt, sort };
    }

    return opt;
  }, [toolbar]);

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
    onDetectFieldOptions,
    onGetFieldStyles,
    onGetForeignRecords,
    onGetTables,
    onLoadMore,
    onRowChange,
    onUploadAttachment,
  } = useDataSource(databaseId, table, options);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <ExplorerSidebar />
      <main style={{ flexGrow: 1, overflow: "auto" }}>
        <GridView
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
          onGetFieldStyles={onGetFieldStyles}
          onGetForeignRecords={onGetForeignRecords}
          onGetTables={onGetTables}
          onFilter={setFilter}
          onSort={setSort}
          onGroup={setGroup}
          onHideFields={setHiddenFields}
          onLoadMore={onLoadMore}
          onRowChange={onRowChange}
          onUploadAttachment={onUploadAttachment}
          onDetectFieldOptions={onDetectFieldOptions}
        />
      </main>
    </Box>
  );
};
