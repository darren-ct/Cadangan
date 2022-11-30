import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { DeleteIcon, EditIcon } from "@/assets/icons";
import { IconDisplay } from "@/features/editor";
import { useDisclose } from "@/hooks";

import {
  useEditorPageStore,
  UseEditorPageStoreState,
  useEditorView,
} from "../../hooks";
import { SharedSubMenuProps } from "../../types";

export const SubMenuHeader = React.memo(function SubMenuHeader({
  item,
  page,
  onRemove,
  onRemovePage,
}: SharedSubMenuProps) {
  const { setDraggables } = useEditorView();
  const { pages, setPages } = useEditorPageStore() as UseEditorPageStoreState;

  const { isOpen: isOnEdit, onToggle: toggleEdit } = useDisclose();
  const [name, setName] = React.useState<string>(
    item?.name ?? page?.name ?? ""
  );

  // Function
  const onEditHandler: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(
      (e) => {
        e.stopPropagation();
        toggleEdit();
      },
      [toggleEdit]
    );

  const onRemoveHandler: React.MouseEventHandler<HTMLButtonElement> =
    React.useCallback(
      (e) => {
        e.stopPropagation();

        item ? onRemove() : onRemovePage();
      },
      [item, onRemove, onRemovePage]
    );

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = React.useCallback((e) => {
    setName(e.target.value);
  }, []);

  const onSubmitName = React.useCallback(() => {
    if (item) {
      setDraggables((prev) => {
        return prev.map((draggable) => {
          if (draggable.id !== item?.id) {
            return draggable;
          } else {
            return { ...draggable, name };
          }
        });
      });
    } else {
      const newPages = pages.map((pageItem) => {
        if (pageItem.id === page.id) {
          return { ...pageItem, name };
        } else {
          return pageItem;
        }
      });
      setPages(newPages);
    }

    toggleEdit();
  }, [item, name, page?.id, pages, setDraggables, setPages, toggleEdit]);

  // useEffect
  React.useEffect(() => {
    if (item) {
      setName(item?.name);
    } else {
      setName(page?.name);
    }
  }, [item, page?.name]);

  return (
    <Stack direction="column" marginBottom={0}>
      <Stack
        onClick={toggleEdit}
        direction="row"
        alignItems="center"
        paddingX={"12px"}
        paddingY={"16px"}
        sx={{
          "&:hover": { background: "rgba(0,0,0,.025)" },
          transition: "100ms linear",
          cursor: "pointer",
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
          <IconDisplay name={item?.type ?? "page"} color="#130F40" />
          <Stack direction="column" marginLeft="10px" spacing={-0.5}>
            <Typography
              sx={(theme) => ({
                fontSize: theme.typography.fontSize,
                fontWeight: "bold",
                color: "#130F40",
              })}
            >
              {item?.name ?? page?.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#130F40",
              }}
            >
              {item?.type}
            </Typography>
          </Stack>
        </Stack>
        <Tooltip title="Edit Name">
          <IconButton onClick={onEditHandler}>
            <EditIcon
              sx={{ cursor: "pointer", fontSize: "16px", color: "#130F40" }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={item ? "Delete widget" : "Delete Page"}>
          <IconButton onClick={onRemoveHandler}>
            <DeleteIcon
              sx={{ cursor: "pointer", fontSize: "16px", color: "#130F40" }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        direction="column"
        alignItems="flex-end"
        paddingX="12px"
        paddingY="16px"
        sx={{ display: !isOnEdit ? "none" : "flex" }}
      >
        <Typography
          sx={(theme) => ({
            width: "100%",
            fontSize: theme.typography.fontSize,
            color: "#828282",
            fontWeight: 500,
            paddingLeft: "6px",
            marginBottom: "4px",
          })}
        >
          Name
        </Typography>
        <TextField
          size="small"
          placeholder="Enter name"
          sx={{
            backgroundColor: "#FAFAFA",
            marginBottom: 1,
          }}
          fullWidth
          onChange={onChange}
          inputProps={{ style: { fontSize: 12 } }}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter") {
              onSubmitName();
            }
          }}
          value={name}
        />
      </Stack>
    </Stack>
  );
});
