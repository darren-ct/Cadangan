import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ChartTypeRegistry } from "chart.js";
import * as React from "react";

import type { Draggable } from "@/features/editor";
import {
  SelectCollections,
  SubMenuSection,
  useChartSubMenu,
} from "@/features/editor";

import { ChartType } from "./ChartType";
import { ChartXAxisData } from "./ChartXAxisData";
import { ChartYAxisData } from "./ChartYAxisData";

interface Props {
  item: Draggable;
}

export const ChartSubMenu = React.memo(function ChartSubMenu({ item }: Props) {
  const {
    currentProps,
    chartTypes,
    handleAxisFieldSelect,
    handleChangeChartType,
    handleCreateDataset,
    handleTableSelect,
    handleDeleteDataset,
    isBarOrLine,
    isDataOpen,
    isSelectCollectionOpen,
    onSelectCollectionToggle,
    onDataToggle,
    numberFields,
    textFields,
  } = useChartSubMenu({
    item,
  });

  return (
    <Stack direction="column">
      <SubMenuSection
        title="Chart"
        isOpen={isSelectCollectionOpen}
        onToggle={onSelectCollectionToggle}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {chartTypes.map((type: keyof ChartTypeRegistry) => (
            <ChartType
              key={type}
              type={type}
              active={currentProps?.type === type}
              onClick={() => handleChangeChartType(type)}
            />
          ))}
        </Box>
      </SubMenuSection>

      <SubMenuSection title="Data" isOpen={isDataOpen} onToggle={onDataToggle}>
        <SelectCollections
          value={currentProps?.table}
          onSelect={handleTableSelect}
        />
        {!!currentProps?.table && (
          <>
            <ChartXAxisData
              fields={textFields}
              onChange={(id, key, value) =>
                handleAxisFieldSelect("x", id, key, value)
              }
              value={currentProps?.axis?.x}
            />
            <ChartYAxisData
              fields={numberFields}
              onChange={(id, key, value) =>
                handleAxisFieldSelect("y", id, key, value)
              }
              onCreate={handleCreateDataset}
              onDelete={handleDeleteDataset}
              value={currentProps?.axis.y}
              content={
                isBarOrLine
                  ? ["field", "displayAs", "color"]
                  : ["field", "color"]
              }
            />
          </>
        )}
      </SubMenuSection>
    </Stack>
  );
});
