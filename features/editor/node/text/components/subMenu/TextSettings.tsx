import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { MagicTextIcon, PaletteIcon } from "@/assets/icons";
import type { TextContent, TextProps } from "@/features/editor";
import {
  fontAlignments,
  fontTypes,
  fontWeights,
  MagicContainer,
  MagicTextPopup,
  useEditorDraggableStore,
  useMagicTextAction,
} from "@/features/editor";

interface Props {
  itemId: string;
  itemProps: TextProps;
  anchorEl: HTMLElement;
  activeDropdown: string;
  onDropdownToggle: (id: string) => void;
  isPaletteOpen: boolean;
  onPaletteToggle: () => void;
  onOpenMagicTextPopOver: React.MouseEventHandler<HTMLButtonElement>;
  onCloseMagicTextPopOver: () => void;
  onAddTextContent: (
    newTextContent: TextContent | Record<string, unknown>
  ) => void;
  onClassicTextContentChange: (newText: string, id: string) => void;
  onDeleteTextContent: (id: string) => void;
}

export const TextSettings = React.memo(function TextSettings({
  itemId,
  itemProps,
  anchorEl,
  activeDropdown,
  onDropdownToggle,
  isPaletteOpen,
  onPaletteToggle,
  onOpenMagicTextPopOver,
  onCloseMagicTextPopOver,
  onAddTextContent,
  onClassicTextContentChange,
  onDeleteTextContent,
}: Props) {
  const { updateDraggableProps } = useEditorDraggableStore();

  console.log({ itemProps });

  // States
  const [formatsAnchorEl, setFormatsAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const { actions } = useMagicTextAction();

  const onDropdownClose = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onDropdownToggle(null);
      setFormatsAnchorEl(null);
    },
    [setFormatsAnchorEl, onDropdownToggle]
  );

  const onDropdownOpen = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setFormatsAnchorEl(e.currentTarget);
    },
    [setFormatsAnchorEl]
  );

  //
  const onClickHandler = React.useCallback(
    (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onDropdownToggle(id);
      onDropdownOpen(e);
    },
    [onDropdownToggle, onDropdownOpen]
  );

  return (
    <Stack marginBottom={3}>
      <Typography
        sx={(theme) => ({
          marginBottom: "4px",
          paddingLeft: "8px",
          fontSize: theme.typography.fontSize,
          fontWeight: 500,
          color: "#828282",
        })}
      >
        Text
      </Typography>

      <Stack border="1px solid rgba(0,0,0,.2)" borderRadius={2}>
        {/* Field */}
        <MagicContainer
          textContents={itemProps?.content}
          onAddClassicTextContent={onAddTextContent}
          onClassicTextContentChange={onClassicTextContentChange}
          onDeleteTextContent={onDeleteTextContent}
        />
        {/* Options */}
        <Stack direction="row" alignItems="center" padding="4px">
          {!isPaletteOpen && (
            <>
              <Tooltip title="Add Magic Text">
                <IconButton
                  sx={{
                    color: anchorEl ? "#11181C" : "rgba(0,0,0,.6)",
                  }}
                  onClick={onOpenMagicTextPopOver}
                >
                  <MagicTextIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
              <MagicTextPopup
                actions={actions}
                anchorEl={anchorEl}
                onClose={onCloseMagicTextPopOver}
                onCloseAll={onCloseMagicTextPopOver}
                onSelect={onAddTextContent}
              />
            </>
          )}
          <Tooltip title="Formatting">
            <IconButton
              sx={{ color: isPaletteOpen ? "#11181C" : "rgba(0,0,0,.6)" }}
              onClick={onPaletteToggle}
            >
              <PaletteIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Tooltip>

          {isPaletteOpen && (
            <>
              {/* Family */}
              <Box sx={{ position: "relative" }}>
                <Tooltip title="Font">
                  <Box
                    sx={{
                      color: "black",
                      fontSize: 11,
                      padding: 0,
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      onClickHandler(
                        "family",
                        e as unknown as React.MouseEvent<HTMLButtonElement>
                      );
                    }}
                  >
                    {!itemProps || !itemProps.type ? "Body" : itemProps.type}
                  </Box>
                </Tooltip>
                {activeDropdown === "family" && (
                  <Popover
                    anchorEl={formatsAnchorEl}
                    open={Boolean(formatsAnchorEl)}
                    onClose={onDropdownClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Stack
                      paddingY={2}
                      border="1px solid rgba(0,0,0,.1)"
                      borderRadius={2}
                      boxShadow="1px 1px 10px rgba(0,0,0,.2)"
                      direction="column"
                      bgcolor="white"
                      minWidth={200}
                    >
                      {fontTypes.map((ft) => (
                        <Box
                          key={ft}
                          onClick={() =>
                            updateDraggableProps(itemId, "type", ft)
                          }
                          padding={1}
                          sx={(theme) => ({
                            cursor: "pointer",
                            fontSize: theme.typography.fontSize,
                            fontWeight:
                              (!itemProps || !itemProps?.type) && ft === "Body"
                                ? 600
                                : ft === itemProps.type
                                ? 600
                                : "normal",
                            background:
                              (!itemProps || !itemProps?.type) && ft === "Body"
                                ? "rgba(0,0,0,.05)"
                                : ft === itemProps.type
                                ? "rgba(0,0,0,.05)"
                                : "transparent",
                            transition: "100ms ease",
                            "&:hover": { background: "rgba(0,0,0,.05)" },
                          })}
                        >
                          {ft}
                        </Box>
                      ))}
                      <Box
                        sx={{
                          margin: "8px 0px",
                          width: "100%",
                          height: "1px",
                          backgroundColor: "rgba(0,0,0,.2)",
                        }}
                      ></Box>

                      <Box
                        paddingY={1}
                        paddingX={2}
                        sx={{
                          fontSize: 11,
                          cursor: "pointer",
                          color: "#a82058",
                          fontWeight: "bold",
                          transition: "100ms ease",
                          "&:hover": { background: "rgba(0,0,0,.05)" },
                        }}
                      >
                        CHANGE FONTS
                      </Box>
                    </Stack>
                  </Popover>
                )}
              </Box>

              <Typography sx={{ color: "rgba(0,0,0,.4)" }} marginX="3px">
                |
              </Typography>

              {/* Weight */}
              <Box sx={{ position: "relative" }}>
                <Tooltip title="Text Weight">
                  <Box
                    sx={{ color: "black", fontSize: 11, cursor: "pointer" }}
                    onClick={(e) => {
                      onClickHandler(
                        "weight",
                        e as unknown as React.MouseEvent<HTMLButtonElement>
                      );
                    }}
                  >
                    {!itemProps || !itemProps.fontWeight
                      ? "Normal"
                      : itemProps.fontWeight}
                  </Box>
                </Tooltip>
                {activeDropdown === "weight" && (
                  <Popover
                    anchorEl={formatsAnchorEl}
                    open={Boolean(formatsAnchorEl)}
                    onClose={onDropdownClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Stack
                      paddingY={2}
                      border="1px solid rgba(0,0,0,.3)"
                      borderRadius={2}
                      boxShadow="1px 1px 10px rgba(0,0,0,.4)"
                      direction="column"
                      bgcolor="white"
                      minWidth={200}
                    >
                      {fontWeights.map((fw) => (
                        <div
                          style={{ cursor: "pointer" }}
                          key={fw}
                          onClick={() =>
                            updateDraggableProps(itemId, "fontWeight", fw)
                          }
                        >
                          <Box
                            padding={1}
                            sx={{
                              fontWeight:
                                (!itemProps || !itemProps.fontWeight) &&
                                fw === "Normal"
                                  ? "bold"
                                  : fw === itemProps.fontWeight
                                  ? "bold"
                                  : "normal",
                              background:
                                (!itemProps || !itemProps.fontWeight) &&
                                fw === "Normal"
                                  ? "rgba(0,0,0,.05)"
                                  : fw === itemProps.fontWeight
                                  ? "rgba(0,0,0,.05)"
                                  : "transparent",
                              transition: "100ms ease",
                              "&:hover": { background: "rgba(0,0,0,.05)" },
                            }}
                          >
                            {fw}
                          </Box>
                        </div>
                      ))}
                    </Stack>
                  </Popover>
                )}
              </Box>

              <Typography sx={{ color: "rgba(0,0,0,.4)" }} marginX="3px">
                |
              </Typography>

              {/* Alignment */}
              <Box sx={{ position: "relative" }}>
                <Tooltip title="Alignment">
                  <Box
                    sx={{ color: "black", fontSize: 11, cursor: "pointer" }}
                    onClick={(e) => {
                      onClickHandler(
                        "alignment",
                        e as unknown as React.MouseEvent<HTMLButtonElement>
                      );
                    }}
                  >
                    {!itemProps || !itemProps.textAlign
                      ? "Left"
                      : itemProps.textAlign}
                  </Box>
                </Tooltip>
                {activeDropdown === "alignment" && (
                  <Popover
                    anchorEl={formatsAnchorEl}
                    open={Boolean(formatsAnchorEl)}
                    onClose={onDropdownClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Stack
                      paddingY={2}
                      border="1px solid rgba(0,0,0,.3)"
                      borderRadius={2}
                      boxShadow="1px 1px 10px rgba(0,0,0,.4)"
                      direction="column"
                      bgcolor="white"
                      minWidth={120}
                    >
                      {fontAlignments.map((fa) => (
                        <div
                          style={{ cursor: "pointer" }}
                          key={fa}
                          onClick={() =>
                            updateDraggableProps(itemId, "textAlign", fa)
                          }
                        >
                          <Box
                            padding={1}
                            sx={{
                              fontWeight:
                                (!itemProps || !itemProps.textAlign) &&
                                fa === "Left"
                                  ? "bold"
                                  : fa === itemProps.textAlign
                                  ? "bold"
                                  : "normal",
                              background:
                                (!itemProps || !itemProps.textAlign) &&
                                fa === "Left"
                                  ? "rgba(0,0,0,.05)"
                                  : fa === itemProps.textAlign
                                  ? "rgba(0,0,0,.05)"
                                  : "transparent",
                              transition: "100ms ease",
                              "&:hover": { background: "rgba(0,0,0,.05)" },
                            }}
                          >
                            {fa}
                          </Box>
                        </div>
                      ))}
                    </Stack>
                  </Popover>
                )}
              </Box>

              <Typography sx={{ color: "rgba(0,0,0,.4)" }} marginX="3px">
                |
              </Typography>

              {/* Font-Size */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  placeholder="size"
                  name="fontSize"
                  value={itemProps?.fontSize ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (isNaN(Number(e.target.value))) {
                      return;
                    }
                    updateDraggableProps(itemId, e.target.name, e.target.value);
                  }}
                />
              </Box>

              <Typography sx={{ color: "rgba(0,0,0,.4)" }} marginX="3px">
                |
              </Typography>

              {/* Color */}
              <Box sx={{ flex: 1, padding: "4px 4px" }}>
                <TextField
                  type="color"
                  fullWidth
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  name="color"
                  value={
                    !itemProps || !itemProps.color ? "#000000" : itemProps.color
                  }
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateDraggableProps(itemId, e.target.name, e.target.value)
                  }
                />
              </Box>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
});
