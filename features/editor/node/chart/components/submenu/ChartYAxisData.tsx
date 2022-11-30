import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { ChartAxis, ChartAxisContents } from "@/features/editor";
import { ExpandableCard } from "@/features/editor";
import { useDisclose } from "@/hooks";
import { Field } from "@/widgets/types";

import { AxisData } from "./ChartAxis/AxisData";

interface Props {
  fields: Field[];
  onChange: (id: string, key: string, value: Field | string) => unknown;
  onCreate: () => unknown;
  onDelete: (id: string) => unknown;
  value: ChartAxis[];
  content?: ChartAxisContents[];
}

export const ChartYAxisData = React.memo(function ChartYAxisData({
  fields = [],
  onChange,
  onCreate,
  onDelete,
  value,
  content = ["field", "displayAs", "color"],
}: Props) {
  const { isOpen, onToggle } = useDisclose();
  return (
    <ExpandableCard title="Datasets" active={isOpen} onClick={onToggle}>
      <Stack direction="column" sx={{ width: "100%" }} gap={2}>
        {value.map((item, index) => (
          <AxisData
            key={item.id}
            {...item}
            onChange={onChange}
            fields={fields}
            label={`Dataset ${index + 1}`}
            onDelete={onDelete}
            content={content}
          />
        ))}
        <Button startIcon={<AddIcon />} fullWidth onClick={onCreate}>
          Create new Dataset
        </Button>
      </Stack>
    </ExpandableCard>
  );
});
