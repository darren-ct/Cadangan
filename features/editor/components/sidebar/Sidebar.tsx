import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { EditIcon } from "@/assets/icons";

import { useSidebarView } from "../../hooks";
import { SidebarSection } from "./Section";
import { AddPageTab, EditPageTab, ExplorerTab, WidgetTab } from "./tabs";

export const Sidebar = React.memo(function Sidebar() {
  const {
    draggables,
    setActiveId,
    handleActiveDraggableChange,
    tab,
    setTab,
    isPagesOpen,
    togglePage,
    isWidgetsOpen,
    toggleWidget,
    onWidgetSearchHandler,
    filteredWidgets,
    onPageTypesSearchHandler,
    filteredPageTypes,
    pages,
    pickedPage,
    setPickedPageId,
    editorPageId,
    handleCreatePage,
    handlePageClick,
  } = useSidebarView();

  if (pickedPage) {
    return <EditPageTab page={pickedPage} setPickedPageId={setPickedPageId} />;
  }

  return (
    <Stack
      direction="column"
      alignItems="center"
      width={270}
      height="100vh"
      bgcolor="white"
      sx={{
        transition: "150ms ease",
        borderRight: "1px solid #F2F2F2",
        overflowX: "hidden",
      }}
    >
      {/* On Page Tab */}
      {tab === "page" && (
        <AddPageTab
          setTab={setTab}
          handleCreatePage={handleCreatePage}
          filteredPageTypes={filteredPageTypes}
          onPageTypesSearchHandler={onPageTypesSearchHandler}
        />
      )}

      {/* Not on Page Tab */}
      {tab !== "page" && (
        <React.Fragment>
          <SidebarSection
            isOpen={isPagesOpen}
            onToggleExpand={togglePage}
            title="Pages"
            onAdd={() => {
              setTab("page");
            }}
          >
            <Stack
              direction="column"
              spacing={0.5}
              sx={{ px: "12px", width: "100%" }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.id}
                  selected={page.id === editorPageId}
                  sx={{
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={() => handlePageClick(page.id)}
                >
                  <Typography sx={{ fontSize: 12 }}>{page.name}</Typography>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(null);
                      setPickedPageId(page.id);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </MenuItem>
              ))}
            </Stack>
          </SidebarSection>

          <Stack
            sx={{
              padding: "10px 12px 10px 12px",
              width: "100%",
              borderTop: "1px solid #F2F2F2",
              borderBottom: "1px solid #F2F2F2",
            }}
          >
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              spacing={1}
              sx={{
                padding: "4px",
                background: "#F4F6F8",
                borderRadius: "4px",
              }}
            >
              <Box
                onClick={() => setTab("explorer")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#130F40",
                  transition: "100ms ease",
                  background: tab === "explorer" ? "white" : "transparent",
                  flex: 1,
                  textAlign: "center",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                Explorer
              </Box>
              <Box
                onClick={() => setTab("widgets")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#130F40",
                  transition: "100ms ease",
                  background: tab === "widgets" ? "white" : "transparent",
                  flex: 1,
                  textAlign: "center",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                Widgets
              </Box>
            </Stack>
          </Stack>

          {/* Explorer Tab */}
          {tab === "explorer" && (
            <ExplorerTab
              isWidgetsOpen={isWidgetsOpen}
              toggleWidget={toggleWidget}
              setTab={setTab}
              draggables={draggables}
            />
          )}

          {/* Widgets Tab */}
          {tab === "widgets" && (
            <WidgetTab
              onWidgetSearchHandler={onWidgetSearchHandler}
              handleActiveDraggableChange={handleActiveDraggableChange}
              filteredWidgets={filteredWidgets}
            />
          )}
        </React.Fragment>
      )}
    </Stack>
  );
});
