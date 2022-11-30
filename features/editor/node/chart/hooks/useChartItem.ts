import { useQuery } from "@tanstack/react-query";
import { ChartData } from "chart.js";
import * as React from "react";

import type { ChartItemProps, Draggable } from "@/features/editor";
import {
  chartMultiColorLabelPlaceholderData,
  chartPlaceholderData,
  useSubMenuGlobalEvent,
} from "@/features/editor";

interface Props {
  item: Draggable;
}
export const useChartItem = ({ item }: Props) => {
  const { onGetForeignRecords } = useSubMenuGlobalEvent();

  const currentProps = React.useMemo(() => {
    if (!item?.props) return;

    return item?.props as ChartItemProps;
  }, [item?.props]);

  const table = React.useMemo(() => currentProps?.table, [currentProps?.table]);
  const type = React.useMemo(() => currentProps?.type, [currentProps?.type]);
  const title = React.useMemo(() => currentProps?.title, [currentProps?.title]);
  const axis = React.useMemo(() => currentProps?.axis, [currentProps]);

  const isDataReady =
    !!currentProps?.axis?.x?.field &&
    currentProps?.axis?.y?.length > 0 &&
    !!currentProps?.table;

  const { data: rawRecords, isLoading: isRecordsLoading } = useQuery(
    ["chartItemRecords", table, axis],
    () => {
      return onGetForeignRecords(table, {});
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: isDataReady,
    }
  );

  const data: ChartData = React.useMemo(() => {
    if (!isDataReady || !rawRecords || !axis.y?.[0]?.field) {
      if (["bar", "line"].includes(type)) return chartPlaceholderData;

      return chartMultiColorLabelPlaceholderData;
    }

    const labels = rawRecords.map((record) => record[axis.x.field.name]);
    const datasets = axis?.y
      .filter((item) => !!item.field)
      .map((item) => {
        const isBarLine = ["bar", "line"].includes(type);

        return {
          type: isBarLine ? item.type : undefined,
          label: item.field.name,
          backgroundColor: !isBarLine
            ? item.colors?.map((color) => color + "33")
            : [item.colors[0] + "33"],
          borderColor: !isBarLine ? item.colors : [item.colors[0]],
          borderWidth: 1,
          data: rawRecords.map((record) => {
            const value = record[item.field.name];

            if (!value && typeof value !== "number") return 0;

            return value;
          }),
        };
      });

    return {
      labels,
      datasets,
    } as ChartData;
  }, [isDataReady, rawRecords, axis, type]);

  const options = React.useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: !title ? "Chart" : title,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }, [title]);

  const isLoading = isRecordsLoading && isDataReady;

  return { currentProps, isDataReady, isLoading, data, options };
};
