import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { Action, NavLink } from "@/features/editor";
import { ActionCard, ActionPopup } from "@/features/editor";

interface Props {
  navLinkData: NavLink;
  updateNavLinkProps: (name: string, body: unknown) => void;
  actions: Action[];
  actionsAnchorEl: HTMLElement;
  onActionsOpen: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onActionsClose: () => void;
  onActionsSelect: (action: Action) => void;
}

export const FormActions = React.memo(function FormActions({
  navLinkData,
  updateNavLinkProps,
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
          marginBottom: "4px",
        })}
      >
        Actions
      </Typography>
      <Stack direction="column">
        {!navLinkData.actions || navLinkData.actions.length < 1 ? (
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
          navLinkData.actions.map((action) => (
            <ActionCard
              bgColor="white"
              key={action.id}
              action={action}
              item={navLinkData}
              updateNavLinkProps={updateNavLinkProps}
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
            marginTop: 1,
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
