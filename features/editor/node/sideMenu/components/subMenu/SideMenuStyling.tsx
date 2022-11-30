import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type { Draggable, SideMenuProps } from "@/features/editor";
import { useEditorDraggableStore } from "@/features/editor";

interface Props {
  item: Draggable;
  itemProps: SideMenuProps;
}

export const SideMenuStyling = React.memo(function SideMenuStyling({
  item,
  itemProps,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();

  return (
    <Stack direction="column">
      {/*  Color */}
      <Typography
        sx={(theme) => ({
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
          value={itemProps?.paddingY ?? 24}
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
          value={itemProps?.paddingY ?? 24}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(item.id, e.target.name, e.target.value);
          }}
          sx={{
            width: "100px",
            border: "none",
          }}
        />
      </Stack>

      {/* Link PaddingX */}
      <Typography
        sx={(theme) => ({
          marginTop: 2,
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Link Horizontal Padding
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Slider
          name="linkPaddingX"
          size="small"
          aria-label="Spacing"
          value={itemProps?.linkPaddingX ?? 4}
          onChange={(e: Event, value: number | number[]) => {
            updateDraggableProps(item.id, e.target.name, value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          variant="standard"
          placeholder="px"
          name="linkPaddingX"
          size="small"
          type="number"
          inputProps={{ style: { fontSize: 12 } }}
          value={itemProps?.linkPaddingX ?? 4}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDraggableProps(item.id, e.target.name, e.target.value);
          }}
          sx={{
            width: "100px",
            border: "none",
          }}
        />
      </Stack>

      {/* Link PaddingY */}
      <Typography
        sx={(theme) => ({
          marginTop: 2,
          marginBottom: "4px",
          color: "#828282",
          fontWeight: 500,
          fontSize: theme.typography.fontSize,
        })}
      >
        Link Vertical Padding
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Slider
          name="linkPaddingY"
          size="small"
          aria-label="Spacing"
          value={itemProps.linkPaddingY ?? 4}
          onChange={(e: Event, value: number | number[]) => {
            updateDraggableProps(item.id, e.target.name, value as number);
          }}
          sx={{ marginRight: 2 }}
        />
        <TextField
          variant="standard"
          placeholder="px"
          name="linkPaddingY"
          size="small"
          type="number"
          inputProps={{ style: { fontSize: 12 } }}
          value={itemProps.linkPaddingY ?? 4}
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
