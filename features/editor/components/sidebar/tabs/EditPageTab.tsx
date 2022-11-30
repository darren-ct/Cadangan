import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import * as React from "react";

import {
  AddIcon,
  ChevronDownIcon,
  EyeOffIcon,
  EyeOnIcon,
} from "@/assets/icons";
import type { Draggable, EditorPage } from "@/features/editor";
import {
  ActionCard,
  ActionPopup,
  useDraggableStore,
  UseDraggableStoreState,
  useEditorDraggableStore,
  useEditorPageStore,
  UseEditorPageStoreState,
  useEditPageTab,
} from "@/features/editor";

import { SubMenuHeader, SubMenuSection } from "../../submenus";

interface Props {
  page: EditorPage;
  setPickedPageId: React.Dispatch<React.SetStateAction<string>>;
}

export const EditPageTab = React.memo(function EditPageTab({
  page,
  setPickedPageId,
}: Props) {
  const {
    pageActions,
    isComponentsOpen,
    onComponentsToggle,
    isActionsOpen,
    onActionsToggle,
    subMenuActions,
    actionsAnchorEl,
    onOpenActionsPopOver,
    onCloseActionsPopOver,
    handleActionSelect,
    isStylesOpen,
    onStylesToggle,
  } = useEditPageTab({ page });
  // Router
  const router = useRouter();
  const { databaseId: dbId } = router.query;

  // Hooks
  const { draggables, setActiveId, updateDraggable } =
    useEditorDraggableStore();
  const { clearDefaultLayouts, clearDraggables } =
    useDraggableStore() as UseDraggableStoreState;
  const { pages, deletePage } = useEditorPageStore() as UseEditorPageStoreState;
  const { updatePageProps } = useEditorPageStore() as UseEditorPageStoreState;

  // Functions
  const onHideToggle = React.useCallback(
    (item: Draggable) => {
      const isHidden = item.isHidden;

      updateDraggable(item.id, { ...item, isHidden: !isHidden });
    },
    [updateDraggable]
  );

  const handleRemovePage = React.useCallback(() => {
    const excludedPages = pages.filter((pageItem) => pageItem.id !== page.id);
    const lastPage = excludedPages[excludedPages.length - 1];

    // Delete Page & contents
    deletePage(page.id);
    clearDefaultLayouts(page.id);
    clearDraggables(page.id);

    // Navigate
    if (!lastPage) {
      return router.push(`/databases/${dbId}/editor/${String(Date.now())}`);
    }

    router.push(`/databases/${dbId}/editor/${lastPage.id}`);
    setPickedPageId(null);
  }, [
    pages,
    deletePage,
    page.id,
    clearDefaultLayouts,
    clearDraggables,
    router,
    dbId,
    setPickedPageId,
  ]);

  return (
    <Stack direction="column" width={270} paddingY={1.5}>
      {/* BreadCrumbs */}
      <Stack
        paddingX={1.5}
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
        marginBottom={0.5}
      >
        <Typography
          sx={(theme) => ({
            color: "#130F40",
            cursor: "pointer",
            fontSize: theme.typography.fontSize - 2,
            "&:hover": {
              textDecoration: "underline",
            },
          })}
          onClick={() => setPickedPageId(null)}
        >
          Explorer Tab
        </Typography>
        <ChevronDownIcon
          sx={(theme) => ({
            color: "#130F40",
            transform: "rotate(270deg)",
            fontSize: theme.typography.fontSize + 2,
          })}
        />
        <Typography
          sx={(theme) => ({
            color: "#130F40",
            cursor: "pointer",
            fontSize: theme.typography.fontSize - 2,
          })}
        >{`Edit ${page.name}`}</Typography>
      </Stack>

      {/* Header */}
      <SubMenuHeader page={page} onRemovePage={handleRemovePage} />

      {/* Components */}
      <SubMenuSection
        title="Components"
        onToggle={onComponentsToggle}
        isOpen={isComponentsOpen}
      >
        <Stack direction="column" spacing={1}>
          {!draggables ||
            (draggables?.length === 0 && (
              <Typography
                sx={{
                  marginY: 2,
                  textAlign: "center",
                  color: "#828282",
                  fontSize: 12,
                }}
              >
                No item yet...
              </Typography>
            ))}
          {draggables.map((draggable) => (
            <Stack
              direction="row"
              key={draggable.id}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                paddingY: "8px",
                paddingX: "10px",
                backgroundColor: "rgba(0,0,0,.05)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,.1)",
                },
              }}
              onClick={() => {
                setActiveId(draggable.id);
              }}
            >
              <Stack flex={1} direction="column">
                <Typography sx={{ color: "rgba(0,0,0,.6)", fontSize: "11px" }}>
                  {draggable.type}
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                  {draggable.name}
                </Typography>
              </Stack>

              <IconButton
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onHideToggle(draggable);
                }}
              >
                {!draggable.isHidden ? (
                  <EyeOnIcon
                    sx={{ color: "rgba(0,0,0,.75)", fontSize: "18px" }}
                  />
                ) : (
                  <EyeOffIcon
                    sx={{ color: "rgba(0,0,0,.75)", fontSize: "18px" }}
                  />
                )}
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </SubMenuSection>

      {/* Actions */}
      <SubMenuSection
        title="Actions"
        onToggle={onActionsToggle}
        isOpen={isActionsOpen}
      >
        <Stack
          marginBottom={3}
          direction="column"
          justifyContent="space-between"
          position="relative"
        >
          <Typography
            sx={{
              marginBottom: 2,
              marginLeft: "6px",
              fontSize: "12px",
              color: " #828282",
              fontWeight: 500,
            }}
          >
            When a user visits the screen...
          </Typography>

          {/* list */}
          {!pageActions || pageActions.length < 1 ? (
            <Box
              sx={{
                fontSize: "12px",
                width: "100%",
                textAlign: "center",
                border: "1px dotted rgba(0,0,0,.4)",
                color: "rgba(0,0,0,.4)",
                borderRadius: 4,
                padding: "8px 24px",
              }}
            >
              No Actions
            </Box>
          ) : (
            <Stack>
              {pageActions.map((action, index) => (
                <ActionCard key={index} action={action} item={page} />
              ))}
            </Stack>
          )}
          {/* add actions */}
          <Button
            onClick={onOpenActionsPopOver}
            variant="text"
            startIcon={<AddIcon />}
            sx={{
              fontSize: "11px",
              marginTop: 2,
              color: "#130F40",
              width: "115px",
            }}
          >
            ADD ACTION
          </Button>
          <ActionPopup
            anchorEl={actionsAnchorEl}
            onClose={onCloseActionsPopOver}
            onCloseAll={onCloseActionsPopOver}
            actions={subMenuActions}
            onSelect={handleActionSelect}
          />
        </Stack>
      </SubMenuSection>

      {/* Others */}
      <Button
        onClick={onStylesToggle}
        variant={isStylesOpen ? "contained" : "outlined"}
        sx={{
          margin: "24px auto",
          borderRadius: 50,
          paddingX: 1.5,
          paddingY: 1.25,
          fontSize: "11px",
        }}
      >
        EDIT STYLES
      </Button>

      {isStylesOpen && (
        <Stack direction="column" paddingX="12px">
          <Typography
            sx={{
              marginBottom: 2,
              marginLeft: "6px",
              fontSize: "12px",
              color: " #828282",
              fontWeight: 500,
            }}
          >
            Page Height
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Slider
              size="small"
              aria-label="height"
              value={page.props?.stylingProps?.height ?? 540}
              onChange={(_e: Event, value: number | number[]) => {
                updatePageProps(page.id, "stylingProps", {
                  ...page.props?.stylingProps,
                  height: value as number,
                });
              }}
              sx={{ marginRight: 2 }}
            />
            <TextField
              variant="standard"
              placeholder="px"
              name="linkSpacing"
              size="small"
              type="number"
              inputProps={{ style: { fontSize: 12 } }}
              value={page.props?.stylingProps?.height ?? 540}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updatePageProps(page.id, "stylingProps", {
                  ...page.props?.stylingProps,
                  height: Number(e.target.value),
                });
              }}
              sx={{
                width: "100px",
                border: "none",
              }}
            />
          </Stack>

          <Typography
            sx={{
              marginTop: 3,
              marginBottom: 2,
              marginLeft: "6px",
              fontSize: "12px",
              color: " #828282",
              fontWeight: 500,
            }}
          >
            Max Page Width
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Slider
              size="small"
              aria-label="maxWidth"
              value={page.props?.stylingProps?.maxWidth ?? 1080}
              onChange={(_e: Event, value: number | number[]) => {
                updatePageProps(page.id, "stylingProps", {
                  ...page.props?.stylingProps,
                  height: value as number,
                });
              }}
              sx={{ marginRight: 2 }}
            />
            <TextField
              variant="standard"
              placeholder="px"
              name="linkSpacing"
              size="small"
              type="number"
              inputProps={{ style: { fontSize: 12 } }}
              value={page.props?.stylingProps?.maxWidth ?? 1080}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updatePageProps(page.id, "stylingProps", {
                  ...page.props?.stylingProps,
                  height: Number(e.target.value),
                });
              }}
              sx={{
                width: "100px",
                border: "none",
              }}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
});
