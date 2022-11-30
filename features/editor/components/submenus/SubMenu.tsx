import Box from "@mui/material/Box";
import * as React from "react";

import {
  ButtonSubMenu,
  ChartSubMenu,
  ContainerSubMenu,
  FormSubMenu,
  KanbanSubMenu,
  NavSubMenu,
  SideMenuSubMenu,
  TabContainerSubMenu,
  TableSubMenu,
  TextInputSubMenu,
  TextSubMenu,
} from "../../node";
import { Draggable } from "../../types";
import { SubMenuHeader } from "./Header";

interface Props {
  item: Draggable;
  onRemove: () => void;
}

export const SubMenu = React.memo(function SubMenu({ item, onRemove }: Props) {
  if (!item) {
    return <React.Fragment />;
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Header */}
      <SubMenuHeader item={item} onRemove={onRemove} />

      {/* Content */}
      {item?.type === "button" && <ButtonSubMenu item={item} />}

      {item?.type === "form" && <FormSubMenu item={item} />}

      {item?.type === "text" && <TextSubMenu item={item} />}

      {item?.type === "nav" && <NavSubMenu item={item} />}

      {item?.type === "table" && <TableSubMenu item={item} />}

      {item?.type === "textInput" && <TextInputSubMenu item={item} />}

      {item?.type === "chart" && <ChartSubMenu item={item} />}

      {item?.type === "sideMenu" && <SideMenuSubMenu item={item} />}

      {item?.type === "container" && <ContainerSubMenu item={item} />}

      {item?.type === "tabContainer" && <TabContainerSubMenu item={item} />}

      {item?.type === "kanban" && <KanbanSubMenu item={item} />}
    </Box>
  );
});
