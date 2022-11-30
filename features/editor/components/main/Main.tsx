import Box from "@mui/material/Box";
import * as React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import { EyeOnIcon } from "@/assets/icons";

import { useEditorView } from "../../hooks";
import { NavItem, SideMenuItem } from "../../node";
import { DraggableItem, DraggableWrapper } from "../draggables";
import { FixedLayoutWrapper, GridHelper, PreviewModal } from "./helpers";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Main = React.memo(function Main() {
  const {
    activeDraggable,
    setActiveId,
    activeId,
    bps,
    defItemW,
    defItemH,
    defaultLayouts,
    lowestIndex,
    getColor,
    draggables,
    handleBreakpointChange,
    handleDrop,
    handleDraggableItemClick,
    handleDraggableKeyDown,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    isShowGridHelper,
    onShowGridHelperClose,
    navigateToPreview,
    isShowPreviewModal,
    onClosePreviewModal,
    onOpenPreviewModal,
    pageHeight,
  } = useEditorView();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        position: "relative",
        padding: 5,
        flex: 1,
        backgroundColor: "#f0f0f0",
        height: "100%",
        overflowX: "hidden",
        scrollbarWidth: "none",
      }}
    >
      <Box
        position="relative"
        overflow="hidden"
        zIndex={2}
        bgcolor="white"
        width="100%"
        minHeight={610}
        height={pageHeight}
        onClick={() => {
          setActiveId(null);
          onShowGridHelperClose();
        }}
      >
        {/* Fixed */}
        {draggables
          .filter((draggable) => {
            if (draggable.type === "nav" || draggable.type === "sideMenu") {
              return true;
            }

            return false;
          })
          .map((draggable) => (
            <FixedLayoutWrapper item={draggable} key={draggable.id}>
              {draggable.type === "nav" ? (
                <Box
                  sx={{
                    width: "100%",
                    border: `1px solid ${getColor(draggable.id)}`,
                  }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    handleDraggableItemClick(draggable);
                  }}
                >
                  <NavItem item={draggable} isDisabled={false} />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: "100%",
                    borderRight:
                      draggable.id !== activeId
                        ? "1px solid rgba(0,0,0,.1)"
                        : "1px solid #42a5f5",
                  }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    handleDraggableItemClick(draggable);
                  }}
                >
                  <SideMenuItem item={draggable} isDisabled={false} />
                </Box>
              )}
            </FixedLayoutWrapper>
          ))}

        {/* Grid */}
        <ResponsiveGridLayout
          className="layout"
          compactType={null}
          measureBeforeMount={false} //
          useCSSTransforms={false}
          preventCollision={false}
          isDroppable={true}
          autoSize={true}
          isResizable={true}
          resizeHandles={["se", "sw", "ne", "nw", "e", "w", "n", "s"]}
          breakpoints={bps}
          cols={{
            xs: 36,
            sm: 36,
          }}
          margin={[1, 1]}
          containerPadding={[0, 0]}
          layouts={defaultLayouts}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          onDrop={handleDrop}
          onBreakpointChange={handleBreakpointChange}
          rowHeight={16}
          droppingItem={{
            i: activeDraggable ? activeDraggable.id : "dummy",
            w: defItemW,
            h: defItemH,
            item: activeDraggable,
            isDraggable: true,
          }}
        >
          {draggables
            .filter((draggable) => {
              if (draggable.type === "nav" || draggable.type === "sideMenu") {
                return false;
              }

              if (draggable.containerId) {
                return false;
              }

              return true;
            })
            .map((item) => (
              <DraggableWrapper
                key={item.id}
                style={{
                  overflow:
                    item.type === "button"
                      ? "visible"
                      : item.type === "kanban"
                      ? "scroll"
                      : "hidden",
                  backgroundColor:
                    item.type === "textInput" || item.type === "kanban"
                      ? "white"
                      : "transparent",
                  border: `1px solid ${getColor(item.id)}`,
                  display: "flex",
                  alignItems:
                    activeDraggable?.type === "kanban"
                      ? "flex-start"
                      : "center",
                  justifyContent:
                    activeDraggable?.type === "kanban"
                      ? "flex-start"
                      : "center",
                  borderRadius: "4px",
                  outline: item.type === "text" ? "none" : "2px solid #ececec",
                }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  handleDraggableItemClick(item);
                }}
                onKeyDown={handleDraggableKeyDown}
              >
                <DraggableItem item={item} />
              </DraggableWrapper>
            ))}

          <Box
            key="DUMMY_DRAGGABLE"
            sx={{
              border: `1px solid transparent`,
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "4px",
            }}
          ></Box>
        </ResponsiveGridLayout>

        {/* Grid Helper */}
        {isShowGridHelper && (
          <GridHelper
            cols={36}
            rowHeight={16}
            margins={[1, 1]}
            depth={lowestIndex as number}
          />
        )}
      </Box>

      {/* Navigate to Edit Button */}
      <Box
        onClick={onOpenPreviewModal}
        sx={{
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "100vh",
          backgroundColor: "#11181C",
          position: "fixed",
          right: "36px",
          bottom: "16px",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.1)",
          },
          transition: "200ms ease",
        }}
      >
        <EyeOnIcon sx={{ color: "white" }} />
      </Box>

      {/* Modal */}
      <PreviewModal
        navigateToPreview={navigateToPreview}
        isShowPreviewModal={isShowPreviewModal}
        onClosePreviewModal={onClosePreviewModal}
      />
    </Box>
  );
});
