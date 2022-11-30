import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Draggable, NavProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  item: Draggable;
  itemProps: NavProps;
}

export const NavStyling = React.memo(function NavStyling({
  item,
  itemProps,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();

  const memoizedType = React.useMemo(() => {
    if (!itemProps.type) {
      return "top";
    }

    return itemProps.type;
  }, [itemProps.type]);

  const memoizedPaddingX = React.useMemo(() => {
    if (memoizedType === "top" && !itemProps.paddingX) {
      return 24;
    }

    if (memoizedType === "top") {
      return itemProps.paddingX;
    }

    if (!itemProps.paddingX) {
      return 16;
    }

    return itemProps.paddingX;
  }, [itemProps.paddingX, memoizedType]);

  const memoizedPaddingY = React.useMemo(() => {
    if (memoizedType === "top" && !itemProps.paddingY) {
      return 16;
    }

    if (memoizedType === "top") {
      return itemProps.paddingY;
    }

    if (!itemProps.paddingY) {
      return 24;
    }

    return itemProps.paddingY;
  }, [itemProps.paddingY, memoizedType]);

  return (
    <Stack direction="column">
      {/* Sticky option */}
      <Typography
        sx={(theme) => ({
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
          marginBottom: "4px",
        })}
      >
        Behaviour
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography sx={(theme) => ({ fontSize: theme.typography.fontSize })}>
          Apply Sticky?
        </Typography>
        <Switch
          size="small"
          checked={itemProps?.isSticky ?? false}
          onChange={() =>
            updateDraggableProps(item.id, "isSticky", !itemProps?.isSticky)
          }
        />
      </Stack>
      {/*  Color */}
      <Typography
        sx={(theme) => ({
          marginTop: 3,
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
          marginBottom: "6px",
        })}
      >
        Color
      </Typography>

      {/* Background Color */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        marginBottom="10px"
      >
        <Typography sx={(theme) => ({ fontSize: theme.typography.fontSize })}>
          Background Color
        </Typography>
        <label htmlFor="bg-color">
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,.4)",
              width: "18px",
              height: "18px",
              cursor: "pointer",
              backgroundColor: itemProps?.backgroundColor ?? "white",
            }}
          >
            <TextField
              id="bg-color"
              type="color"
              name="backgroundColor"
              value={itemProps?.backgroundColor ?? "white"}
              sx={{ padding: "0px", display: "none" }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateDraggableProps(item.id, e.target.name, e.target.value)
              }
            />
          </Box>
        </label>
      </Stack>

      {/* Links Color */}
      <Stack direction="row" alignItems="center" spacing={6.2}>
        <Typography sx={(theme) => ({ fontSize: theme.typography.fontSize })}>
          Links Color
        </Typography>
        <label htmlFor="link-color">
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,.4)",
              width: "18px",
              height: "18px",
              cursor: "pointer",
              backgroundColor: itemProps?.linkColor ?? "black",
            }}
          >
            <TextField
              id="link-color"
              type="color"
              name="linkColor"
              value={itemProps?.linkColor ?? "black"}
              sx={{ padding: "0px", display: "none" }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateDraggableProps(item.id, e.target.name, e.target.value)
              }
            />
          </Box>
        </label>
      </Stack>

      {/* PaddingX */}
      <Typography
        sx={(theme) => ({
          marginTop: 3,
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Horizontal Padding
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Slider
          name="paddingX"
          size="small"
          aria-label="Spacing"
          value={memoizedPaddingX}
          onChange={(e: Event, value: number | number[]) => {
            updateDraggableProps(item.id, e.target.name, value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          variant="standard"
          placeholder="px"
          name="paddingX"
          size="small"
          type="number"
          inputProps={{ style: { fontSize: 12 } }}
          value={memoizedPaddingX}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(item.id, e.target.name, e.target.value);
          }}
          sx={{
            width: "100px",
            border: "none",
          }}
        />
      </Stack>

      {/* PaddingY */}
      <Typography
        sx={(theme) => ({
          marginTop: 2,
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Vertical Padding
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Slider
          name="paddingY"
          size="small"
          aria-label="Spacing"
          value={memoizedPaddingY}
          onChange={(e: Event, value: number | number[]) => {
            updateDraggableProps(item.id, e.target.name, value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          variant="standard"
          placeholder="px"
          name="paddingY"
          size="small"
          type="number"
          inputProps={{ style: { fontSize: 12 } }}
          value={memoizedPaddingY}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(item.id, e.target.name, e.target.value);
          }}
          sx={{
            width: "100px",
            border: "none",
          }}
        />
      </Stack>

      {/* Link Spacing */}
      <Typography
        sx={(theme) => ({
          marginTop: 2,
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Link Spacing
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Slider
          name="linkSpacing"
          size="small"
          aria-label="Spacing"
          value={itemProps.linkSpacing ?? 1}
          onChange={(e: Event, value: number | number[]) => {
            updateDraggableProps(item.id, e.target.name, value as number);
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
          value={itemProps.linkSpacing ?? 1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(item.id, e.target.name, e.target.value);
          }}
          sx={{
            width: "100px",
            border: "none",
          }}
        />
      </Stack>

      {/* Link-Icon Spacing */}
      <Typography
        sx={(theme) => ({
          marginTop: 2,
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Link-Icon Spacing
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Slider
          name="linkIconSpacing"
          size="small"
          aria-label="linkIconSpacing"
          value={itemProps.linkIconSpacing ?? 16}
          onChange={(e: Event, value: number | number[]) => {
            updateDraggableProps(item.id, e.target.name, value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          variant="standard"
          placeholder="px"
          name="linkIconSpacing"
          size="small"
          type="number"
          inputProps={{ style: { fontSize: 12 } }}
          value={itemProps.linkIconSpacing ?? 16}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(item.id, e.target.name, e.target.value);
          }}
          sx={{
            width: "100px",
            border: "none",
          }}
        />
      </Stack>
    </Stack>
  );
});
