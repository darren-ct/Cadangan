import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import * as React from "react";

import {
  DateIcon,
  KeyIcon,
  NumberBoxIcon,
  UnderLinedTextIcon,
} from "@/assets/icons";
import { ChevronDownIcon } from "@/assets/icons/ChevronDown";
import type { MagicTextSubLink, TextContent } from "@/features/editor";
import { useMagicPopOver } from "@/features/editor";

interface Props {
  actions: MagicTextSubLink[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onCloseAll: () => void;
  onSelect: (newTextContent: TextContent | Record<string, unknown>) => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export const MagicTextPopup = React.memo(function MagicTextPopup({
  anchorEl,
  onClose,
  onCloseAll,
  actions,
  onSelect,
  anchorOrigin = {
    vertical: "center",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "center",
    horizontal: "right",
  },
}: Props) {
  const [activeAnchorEl, setActiveAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const [currentChildren, setCurrentChildren] = React.useState<
    MagicTextSubLink[]
  >([]);

  const { onAddMagicTextContent } = useMagicPopOver({ onSelect });

  const handleCloseAll = React.useCallback(() => {
    setActiveAnchorEl(null);
    onCloseAll();
  }, [onCloseAll]);

  const handleOpenActive = React.useCallback(
    (anchorEl: HTMLElement, action: MagicTextSubLink) => {
      if (!action?.sublinks || action?.sublinks?.length === 0) {
        onAddMagicTextContent(action.id);

        handleCloseAll();

        return;
      }

      setActiveAnchorEl(anchorEl);
      setCurrentChildren(action.sublinks);
    },
    [onAddMagicTextContent, handleCloseAll]
  );

  const handleCloseActive = React.useCallback(() => {
    setActiveAnchorEl(null);
  }, []);

  const getIcon = React.useCallback((icon: string) => {
    switch (icon) {
      case "Date":
        return <DateIcon sx={{ fontSize: "16px" }} />;
      case "Text":
        return <UnderLinedTextIcon sx={{ fontSize: "16px" }} />;
      case "Number":
        return <NumberBoxIcon sx={{ fontSize: "16px" }} />;
      case "Arrow":
        return (
          <ChevronDownIcon
            sx={{ transform: "rotate(90deg)", fontSize: "16px" }}
          />
        );
      case "KEY":
        return <KeyIcon sx={{ fontSize: "16px" }} />;
      default:
        return "";
    }
  }, []);

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Box sx={{ width: 196 }}>
        {actions.map((item) => {
          if (!item.title) return <Divider key={item.title} />;

          return (
            <MenuItem
              key={item.title}
              sx={{
                py: 1.2,
                display:
                  item.sublinks && item.sublinks.length === 0 ? "none" : "flex",
              }}
              onClick={(e) =>
                handleOpenActive(e.currentTarget as HTMLElement, item)
              }
            >
              <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              <ListItemText>
                <Typography
                  sx={(theme) => ({ fontSize: theme.typography.fontSize })}
                >
                  {item.title}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Box>
      {currentChildren && (
        <MagicTextPopup
          actions={currentChildren}
          anchorEl={activeAnchorEl}
          onClose={handleCloseActive}
          onSelect={onSelect}
          onCloseAll={handleCloseAll}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
        />
      )}
    </Popover>
  );
});
