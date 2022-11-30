import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import type { Draggable, TabContainerProps } from "@/features/editor";
import { DraggableItem, DraggableWrapper, GridHelper } from "@/features/editor";

import { useTabContainerView } from "../../hooks";
import { TabLinkItem } from "./elements";

interface Props {
  item: Draggable;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

export const TabContainerItem = React.memo(function TabContainerItem({
  item,
}: Props) {
  const {
    isShowGridHelper,
    draggables,
    activeDraggable,
    tabLinkDefaultLayouts,
    clickedTabLinkId,
    setClickedTabLinkId,
    activeRow,
    bps,
    columns,
    lowestIndex,
    getColor,
    handleDrop,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleDraggableItemClick,
  } = useTabContainerView(item);

  return (
    <Box
      position="relative"
      zIndex={1}
      overflow="hidden"
      borderRadius={2}
      bgcolor="white"
      width="100%"
      height="100%"
    >
      <Stack
        onClick={(e) => {
          e.stopPropagation();
        }}
        onDragStart={(e) => e.stopPropagation()}
        direction="row"
        alignItems="center"
        spacing={2}
        borderBottom="1px solid rgba(0,0,0,.15)"
        padding={1}
      >
        {(item.props as TabContainerProps)?.tabLinks?.map((tabLink) => (
          <TabLinkItem
            key={tabLink.id}
            tabLink={tabLink}
            setClickedTabLinkId={setClickedTabLinkId}
            clickedTabLinkId={clickedTabLinkId}
          />
        ))}
      </Stack>
      <Box position="relative" zIndex={2} width="100%" height="100%">
        <ResponsiveGridLayout
          className="layout"
          compactType={null}
          measureBeforeMount={false}
          useCSSTransforms={false}
          preventCollision={false}
          isDroppable={true}
          autoSize={true}
          isResizable={true}
          resizeHandles={["se", "sw", "ne", "nw", "e", "w", "n", "s"]}
          breakpoints={bps}
          cols={columns}
          margin={[1, 1]}
          containerPadding={[0, 0]}
          layouts={tabLinkDefaultLayouts}
          rowHeight={activeRow}
          droppingItem={{
            i: activeDraggable ? activeDraggable.id : "dummy",
            w:
              activeDraggable?.type === "tabContainer" ||
              activeDraggable?.type === "container"
                ? 10
                : 3,
            h:
              activeDraggable?.type === "tabContainer" ||
              activeDraggable?.type === "container"
                ? 8
                : 3,
            item: activeDraggable,
            isDraggable: true,
          }}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        >
          {draggables
            .filter((draggable) => {
              if (draggable.type === "nav" || draggable.type === "sideMenu") {
                return false;
              }

              if (draggable.containerId !== clickedTabLinkId) {
                return false;
              }

              return true;
            })
            .map((item) => (
              <DraggableWrapper
                key={item.id}
                style={{
                  overflow: item.type === "button" ? "visible" : "hidden",
                  backgroundColor:
                    item.type === "textInput" ? "white" : "transparent",
                  border: `1px solid ${getColor(item.id)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  outline: item.type === "text" ? "none" : "2px solid #ececec",
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  handleDraggableItemClick(item);
                }}
              >
                <DraggableItem item={item} />
              </DraggableWrapper>
            ))}
          <Box
            key="DUMMY_DRAGGABLE"
            sx={{
              border: `1px solid transparent`,
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "4px",
            }}
          ></Box>
        </ResponsiveGridLayout>
        {isShowGridHelper && (
          <GridHelper
            cols={24}
            rowHeight={activeRow}
            margins={[1, 1]}
            depth={lowestIndex as number}
          />
        )}
      </Box>
    </Box>
  );
});
