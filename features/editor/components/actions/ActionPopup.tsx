import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { ChevronDownIcon } from "@/assets/icons/ChevronDown";
import type { Action, UseEditorPageStoreState } from "@/features/editor";
import { useEditorPageStore } from "@/features/editor";

interface Props {
  actions: Action[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onCloseAll: () => void;
  onSelect: (action: Action) => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
}

export const ActionPopup = React.memo(function ActionPopup({
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
  const { pages, createPage } = useEditorPageStore() as UseEditorPageStoreState;

  const [activeAnchorEl, setActiveAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const [currentChildren, setCurrentChildren] = React.useState<Action[]>([]);

  const handleCloseAll = React.useCallback(() => {
    setActiveAnchorEl(null);
    onCloseAll();
  }, [onCloseAll]);

  const handleOpenActive = React.useCallback(
    (anchorEl: HTMLElement, action: Action) => {
      if (!action?.children || action?.children?.length === 0) {
        // Create new page
        if (action.subType === "NEW_PAGE") {
          const id = String(Date.now());
          const name = `Page ${pages.length + 1}`;

          createPage({ id, name });

          const newAction: Action = {
            id: `LINK-PAGE-${id}`,
            title: name,
            type: "LINK",
            subType: "PAGE",
            props: {
              page: {
                id,
                name,
                props: {
                  actions: [],
                },
              },
            },
          };

          onSelect(newAction);
          handleCloseAll();
          return;
        }

        onSelect(action);
        handleCloseAll();
        return;
      }

      setActiveAnchorEl(anchorEl);
      setCurrentChildren(action.children);
    },
    [onSelect, handleCloseAll, createPage, pages.length]
  );

  const handleCloseActive = React.useCallback(() => {
    setActiveAnchorEl(null);
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
              }}
              onClick={(e) =>
                handleOpenActive(e.currentTarget as HTMLElement, item)
              }
            >
              <ListItemIcon>
                <ChevronDownIcon sx={{ rotate: "90deg", fontSize: "18px" }} />
              </ListItemIcon>
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
        <ActionPopup
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
