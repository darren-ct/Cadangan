import * as React from "react";

import type { ChartAxis, ChartAxisContents } from "@/features/editor";
import { ExpandableCard } from "@/features/editor";
import { useDisclose } from "@/hooks";
import { Field } from "@/widgets/types";

import { AxisData } from "./ChartAxis/AxisData";

interface Props {
  fields: Field[];
  onChange: (id: string, key: string, value: Field | string) => unknown;
  value: ChartAxis;
  content?: ChartAxisContents[];
}

export const ChartXAxisData = React.memo(function ChartXAxisData({
  fields = [],
  onChange,
  value,
  content = ["field"],
}: Props) {
  const { isOpen, onToggle } = useDisclose();
  return (
    <ExpandableCard title="Labels" active={isOpen} onClick={onToggle}>
      <AxisData
        {...value}
        fields={fields}
        onChange={onChange}
        label="Select field for chart label"
        content={content}
      />
    </ExpandableCard>
  );
});
