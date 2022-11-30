import * as React from "react";

import {
  ButtonItem,
  ChartItem,
  ContainerItem,
  FormItem,
  KanbanItem,
  NavItem,
  SideMenuItem,
  TabContainerItem,
  TableItem,
  TextInputItem,
  TextItem,
} from "../../node";
import { Draggable, FormProps } from "../../types";

export const DraggableItem = React.memo(function DraggableItem({
  item,
}: {
  item: Draggable;
}) {
  if (item.isHidden) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {item.type === "button" && <ButtonItem item={item} isDisabled={true} />}
      {item.type === "form" && (
        <FormItem itemProps={item.props as FormProps} isDisabled={true} />
      )}
      {item.type === "text" && <TextItem item={item} />}
      {item.type === "nav" && <NavItem item={item} isDisabled={true} />}
      {item.type === "table" && <TableItem item={item} />}
      {item.type === "textInput" && (
        <TextInputItem item={item} isDisabled={true} />
      )}
      {item.type === "chart" && <ChartItem item={item} />}
      {item.type === "container" && <ContainerItem item={item} />}
      {item.type === "tabContainer" && <TabContainerItem item={item} />}
      {item.type === "sideMenu" && (
        <SideMenuItem item={item} isDisabled={true} />
      )}
      {item.type === "kanban" && <KanbanItem item={item} />}
    </React.Fragment>
  );
});
