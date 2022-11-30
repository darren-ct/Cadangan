import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { Action, MenuLink } from "@/features/editor";
import { ActionCard, ActionPopup } from "@/features/editor";

interface Props {
  menuLinkData: MenuLink;
  updateMenuLinkProps: (name: string, body: unknown) => void;
  actions: Action[];
  actionsAnchorEl: HTMLElement;
  onActionsOpen: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onActionsClose: () => void;
  onActionsSelect: (action: Action) => void;
}

export const SideMenuActions = React.memo(function SideMenuActions({
  menuLinkData,
  updateMenuLinkProps,
  actions,
  actionsAnchorEl,
  onActionsOpen,
  onActionsClose,
  onActionsSelect,
}: Props) {
  return (
    <Stack direction="column">
      <Typography
        sx={(theme) => ({
          fontWeight: 600,
          fontSize: theme.typography.fontSize,
          marginBottom: "12px",
        })}
      >
        Actions
      </Typography>
      <Stack direction="column">
        {!menuLinkData.actions || menuLinkData.actions.length < 1 ? (
          <Box
            sx={(theme) => ({
              fontSize: theme.typography.fontSize,
              width: "100%",
              textAlign: "center",
              border: "1px dotted rgba(0,0,0,.4)",
              color: "rgba(0,0,0,.4)",
              borderRadius: 4,
              padding: "4px 24px",
            })}
          >
            No Actions
          </Box>
        ) : (
          menuLinkData.actions.map((action) => (
            <ActionCard
              bgColor="white"
              key={action.id}
              action={action}
              item={menuLinkData}
              updateNavLinkProps={updateMenuLinkProps}
            />
          ))
        )}
        <Button
          size="small"
          onClick={onActionsOpen}
          variant="text"
          startIcon={<AddIcon />}
          sx={(theme) => ({
            fontSize: theme.typography.fontSize - 1,
            marginTop: 2,
            color: "#130F40",
            width: "115px",
          })}
        >
          ADD ACTIONS
        </Button>
        <ActionPopup
          actions={actions}
          anchorEl={actionsAnchorEl}
          onClose={onActionsClose}
          onCloseAll={onActionsClose}
          onSelect={onActionsSelect}
        />
      </Stack>
    </Stack>
  );
});
