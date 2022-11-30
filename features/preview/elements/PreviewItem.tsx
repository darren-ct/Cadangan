import Box from "@mui/material/Box";
import * as React from "react";

import type { Draggable, FormProps } from "@/features/editor";
import {
  ButtonItem,
  ChartItem,
  FormItem,
  KanbanItem,
  NavItem,
  TableItem,
  TextInputItem,
  TextItem,
} from "@/features/editor";

interface Props {
  id: string;
  items: Draggable[];
}

export const PreviewItem = React.memo(function PreviewItem({
  id,
  items,
}: Props) {
  const item = React.useMemo(() => {
    const matchedItem = items?.filter((item) => item.id === id)[0];
    return matchedItem;
  }, [id, items]);

  return (
    <Box
      sx={(theme) => ({
        border:
          item?.type === "text" || item?.type === "button"
            ? "none"
            : `2px solid ${theme.palette.grey[300]}`,
      })}
    >
      {item?.type === "button" && <ButtonItem item={item} isDisabled={false} />}
      {item?.type === "form" && (
        <FormItem itemProps={item.props as FormProps} />
      )}
      {item?.type === "text" && <TextItem item={item} />}
      {item?.type === "nav" && <NavItem item={item} isDisabled={false} />}
      {item?.type === "table" && <TableItem item={item} />}
      {item?.type === "textInput" && (
        <TextInputItem item={item} isDisabled={false} />
      )}
      {item?.type === "chart" && <ChartItem item={item} />}
      {item?.type === "kanban" && <KanbanItem item={item} />}
    </Box>
  );
});
