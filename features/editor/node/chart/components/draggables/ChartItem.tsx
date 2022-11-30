import CircularProgress from "@mui/material/CircularProgress";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { Bar, Chart, Doughnut, Pie, PolarArea, Radar } from "react-chartjs-2";

import type { Draggable } from "@/features/editor";

import { useChartItem } from "../../hooks";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip
);

interface Props {
  item: Draggable;
}

export const ChartItem = React.memo(function ChartItem({ item }: Props) {
  const { data, options, isLoading, currentProps } = useChartItem({ item });

  if (isLoading) return <CircularProgress />;

  if (currentProps.type === "bar")
    return (
      <Bar
        data={data as ChartData<"bar", unknown[], unknown>}
        options={options}
      />
    );

  if (currentProps.type === "doughnut")
    return (
      <Doughnut
        data={data as ChartData<"doughnut", unknown[], unknown>}
        options={options}
      />
    );

  if (currentProps.type === "pie")
    <Pie
      data={data as ChartData<"pie", unknown[], unknown>}
      options={options}
    />;

  if (currentProps.type === "polarArea")
    <PolarArea
      data={data as ChartData<"polarArea", unknown[], unknown>}
      options={options}
    />;

  if (currentProps.type === "radar")
    <Radar
      data={data as ChartData<"radar", unknown[], unknown>}
      options={options}
    />;

  return <Chart type={currentProps?.type} data={data} options={options} />;
});
