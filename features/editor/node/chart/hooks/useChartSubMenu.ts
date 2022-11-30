import { useQuery } from "@tanstack/react-query";
import { ChartTypeRegistry } from "chart.js";
import randomColor from "randomcolor";
import * as React from "react";

import type {
  ChartItemAxisProps,
  ChartItemProps,
  Draggable,
} from "@/features/editor";
import {
  chartTypes,
  useEditorDraggableStore,
  useSubMenuGlobalEvent,
} from "@/features/editor";
import { useDisclose } from "@/hooks";
import { Field, Table } from "@/widgets/types";

interface Props {
  item: Draggable;
}

export const useChartSubMenu = ({ item }: Props) => {
  const { updateDraggable, updateDraggableProps } = useEditorDraggableStore();
  const { onGetFields } = useSubMenuGlobalEvent();

  const { isOpen: isSelectCollectionOpen, onToggle: onSelectCollectionToggle } =
    useDisclose(false);

  const { isOpen: isDataOpen, onToggle: onDataToggle } = useDisclose(false);

  const currentProps = React.useMemo(() => {
    if (!item?.props) return;

    return item?.props as ChartItemProps;
  }, [item?.props]);

  const table = React.useMemo(() => currentProps?.table, [currentProps?.table]);
  const type = React.useMemo(() => currentProps?.type, [currentProps?.type]);

  const isBarOrLine = React.useMemo(
    () => ["bar", "line"].includes(type),
    [type]
  );

  const { data: rawFields } = useQuery(
    ["chartSubMenuFields", table],
    () => onGetFields(table),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const fields = React.useMemo(() => {
    if (!rawFields) return [];

    return rawFields;
  }, [rawFields]);

  const numberFields = React.useMemo(
    () =>
      fields.filter((field) =>
        [
          "count",
          "currency",
          "duration",
          "number",
          "percent",
          "rating",
        ].includes(field.type)
      ),
    [fields]
  );

  const textFields = React.useMemo(
    () =>
      fields.filter((field) =>
        [
          "checkBox",
          "email",
          "username",
          "phoneNumber",
          "singleLineText",
        ].includes(field.type)
      ),
    [fields]
  );

  const handleTableSelect = React.useCallback(
    (table: Table) => {
      let inputProps = currentProps;

      inputProps = {
        ...inputProps,
        table,
        axis: {
          x: { id: String(Date.now()) },
          y: [],
        },
      };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id]
  );

  const handleColorChange = React.useCallback(
    (currentValue: string[], newValue: string) => {
      const splitNewValue = newValue.split("-");
      const newValueIndex = +splitNewValue[1];
      const value = splitNewValue[0];

      return currentValue.map((item, index) => {
        if (index !== newValueIndex) return item;

        return value;
      });
    },
    []
  );

  const handleAxisFieldSelect = React.useCallback(
    (
      axis: keyof ChartItemAxisProps,
      id: string,
      key: string,
      value: Field | string | string[]
    ) => {
      const inputProps = currentProps?.axis;

      if (axis === "x") {
        inputProps["x"][key] = value;
      }

      if (axis === "y") {
        const yAxis = inputProps["y"] ?? [];

        inputProps["y"] = yAxis.map((item) => {
          if (item.id !== id) return item;

          const body = { [key]: value };

          if (key === "colors") {
            body[key] = handleColorChange(
              item[key] as string[],
              value as string
            );
          }

          return {
            ...item,
            ...body,
          };
        });
      }

      updateDraggableProps(item.id, "axis", inputProps);
    },
    [currentProps?.axis, item.id, updateDraggableProps, handleColorChange]
  );

  const handleCreateDataset = React.useCallback(() => {
    const inputProps = currentProps?.axis;

    const colors = randomColor({ count: 10 });

    (inputProps.y ?? []).push({
      id: String(Date.now()),
      colors,
      type: "bar",
    });

    updateDraggableProps(item.id, "axis", inputProps);
  }, [updateDraggableProps, currentProps, item.id]);

  const handleDeleteDataset = React.useCallback(
    (id: string) => {
      const inputProps = currentProps?.axis;

      inputProps.y = inputProps.y.filter((item) => item.id !== id);

      updateDraggableProps(item.id, "axis", inputProps);
    },
    [updateDraggableProps, currentProps, item.id]
  );

  const handleChangeChartType = React.useCallback(
    (type: keyof ChartTypeRegistry) => {
      updateDraggableProps(item.id, "type", type);
    },
    [updateDraggableProps, item.id]
  );

  return {
    currentProps,
    chartTypes,
    fields,
    handleAxisFieldSelect,
    handleCreateDataset,
    handleChangeChartType,
    handleDeleteDataset,
    handleTableSelect,
    numberFields,
    isBarOrLine,
    isSelectCollectionOpen,
    isDataOpen,
    onSelectCollectionToggle,
    onDataToggle,
    textFields,
  };
};
