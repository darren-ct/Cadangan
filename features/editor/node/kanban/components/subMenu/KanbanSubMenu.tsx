import Stack from "@mui/material/Stack";
import * as React from "react";

import type { Draggable } from "@/features/editor";
import { SubMenuSection } from "@/features/editor";

import { useKanbanSubMenu } from "../../hooks";
import { KanbanFilter } from "./KanbanFilter";
import { KanbanHideFields } from "./KanbanHideFields";
import { KanbanSort } from "./KanbanSort";
import { KanbanSourceSelect } from "./KanbanSourceSelect";
import { KanbanStackingField } from "./KanbanStackingField";

interface Props {
  item: Draggable;
}

export const KanbanSubMenu = React.memo(function KanbanSubMenu({
  item,
}: Props) {
  const {
    kanbanProps,
    isTableSectionOpen,
    isOptionSectionOpen,
    memoizedTables,
    memoizedFields,
    handleTableSelect,
    handleTableFilterChange,
    handleTableSortChange,
    handleTableHideFieldChange,
    handleStackingFieldChange,
    onOptionSectionToggle,
    onTableSectionToggle,
  } = useKanbanSubMenu({ item });

  return (
    <Stack direction="column">
      <SubMenuSection
        title="Table"
        isOpen={isTableSectionOpen}
        onToggle={onTableSectionToggle}
      >
        <KanbanSourceSelect
          tables={memoizedTables}
          onSelect={handleTableSelect}
          value={kanbanProps?.table}
        />
      </SubMenuSection>

      <SubMenuSection
        title="Options"
        isOpen={isOptionSectionOpen}
        onToggle={onOptionSectionToggle}
      >
        <KanbanFilter
          value={kanbanProps?.filter ?? []}
          onChange={handleTableFilterChange}
          fields={memoizedFields}
        />

        <KanbanSort
          value={kanbanProps?.sort ?? []}
          onChange={handleTableSortChange}
          fields={memoizedFields}
        />

        <KanbanHideFields
          value={kanbanProps?.hiddenFields ?? []}
          onChange={handleTableHideFieldChange}
          fields={memoizedFields}
        />

        <KanbanStackingField
          value={kanbanProps?.stackingField}
          onChange={handleStackingFieldChange}
          fields={memoizedFields}
        />
      </SubMenuSection>
    </Stack>
  );
});
