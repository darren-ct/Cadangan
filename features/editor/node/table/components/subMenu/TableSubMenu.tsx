import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable, TableItemProps } from "@/features/editor";
import { SubMenuSection } from "@/features/editor";

import { useTableSubMenu } from "../../hooks";
import { TableFilter } from "./TableFilter";
import { TableGroup } from "./TableGroup";
import { TableHideFields } from "./TableHideFields";
import { TableSort } from "./TableSort";
import { TableSourceSelect } from "./TableSourceSelect";

interface Props {
  item: Draggable;
}

export const TableSubMenu = React.memo(function TableSubMenu({ item }: Props) {
  const {
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
  } = useTableSubMenu({ item });

  const itemProps = React.useMemo(() => item?.props as TableItemProps, [item]);

  return (
    <Stack direction="column">
      <SubMenuSection
        title="Table"
        isOpen={isTableSectionOpen}
        onToggle={onTableSectionToggle}
      >
        <TableSourceSelect
          tables={memoizedTables}
          onSelect={handleTableSelect}
          value={itemProps?.table}
        />
      </SubMenuSection>

      <SubMenuSection
        title="Data"
        isOpen={isOptionSectionOpen}
        onToggle={onOptionSectionToggle}
      >
        <TableFilter
          value={itemProps?.filter ?? []}
          onChange={handleTableFilterChange}
          fields={memoizedFields}
        />

        <TableSort
          value={itemProps?.sort ?? []}
          onChange={handleTableSortChange}
          fields={memoizedFields}
        />

        <TableGroup
          value={itemProps?.group ?? []}
          onChange={handleTableGroupChange}
          fields={memoizedFields}
        />

        <TableHideFields
          value={itemProps?.hiddenFields ?? []}
          onChange={handleTableHideFieldChange}
          fields={memoizedFields}
        />
      </SubMenuSection>
    </Stack>
  );
});
