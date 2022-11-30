import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type {
  ActionCardProps,
  Draggable,
  LinkActionProps,
} from "@/features/editor";
import {
  ActionPopup,
  ExpandableCard,
  useDraggableLinkAction,
  useSubMenuAction,
} from "@/features/editor";

import { AdvancedAction } from "./AdvancedAction";
import { ParamFields } from "./helpers";

export const LinkActionCard = React.memo(function LinkActionCard({
  bgColor,
  action,
  onUpdate,
  onDelete,
  item,
}: ActionCardProps) {
  const { handleLinkActions } = useSubMenuAction();

  const {
    anchorEl,
    handleOpenPopup,
    handleClosePopup,
    handleWebsiteChange,
    isOpen,
    isParamsOpen,
    onToggle,
    onParamsToggle,
    websiteUrl,
    handleWebsiteKeyDown,
    isAdvancedOpen,
    handleAdvancedToggle,
    onIsAdvancedToggle,
    handleAddParam,
    updatePageParams,
  } = useDraggableLinkAction({ action, handleActionUpdate: onUpdate });

  const actions = React.useMemo(() => handleLinkActions(), [handleLinkActions]);

  const screenName = React.useMemo(() => {
    if (action?.subType === "BACK") return "Back";

    return (action?.props as LinkActionProps)?.page?.name;
  }, [action?.subType, action?.props]);

  const isScreenRelated = React.useMemo(
    () => ["BACK", "PAGE"].includes(action?.subType),
    [action?.subType]
  );

  const isWebsite = React.useMemo(
    () => action?.subType === "WEBSITE",
    [action?.subType]
  );

  return (
    <ExpandableCard
      backgroundColor={bgColor}
      active={isOpen}
      title="Link"
      subTitle={screenName}
      onClick={onToggle}
      onRemove={() => onDelete(action.id)}
    >
      {isScreenRelated && (
        <>
          <Stack direction="column" sx={{ width: "100%" }}>
            <Button
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
                textTransform: "none",
                justifyContent: "start",
              }}
              onClick={(e) => handleOpenPopup(e.currentTarget as HTMLElement)}
            >
              <Stack direction="column" justifyContent="start">
                <Typography
                  sx={(theme) => ({
                    color: theme.palette.grey[500],
                    fontSize: "12px",
                  })}
                >
                  Screen
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>{screenName}</Typography>
              </Stack>
            </Button>

            {/* Advance */}
            {isAdvancedOpen && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {/* Params */}
                <Stack
                  alignItems="center"
                  justifyContent="space-between"
                  direction="row"
                  sx={{ mb: 1 }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Show Params
                  </Typography>
                  <Switch
                    size="small"
                    name="isUppercase"
                    checked={isParamsOpen}
                    onChange={onParamsToggle}
                  />
                </Stack>

                {isParamsOpen && (
                  <React.Fragment>
                    <Stack direction="column" spacing={1}>
                      {/* Empty Text */}
                      {(!action.params || action.params.length === 0) && (
                        <Typography
                          sx={(theme) => ({
                            textAlign: "center",
                            fontSize: theme.typography.fontSize - 2,
                          })}
                        >
                          No Params yet..
                        </Typography>
                      )}

                      {/* Fields List */}
                      {action.params?.map((param) => (
                        <ParamFields
                          param={param}
                          item={item as Draggable}
                          action={action}
                          onUpdate={onUpdate}
                          updatePageParams={updatePageParams}
                        />
                      ))}
                    </Stack>
                    {/* Add Field Button */}
                    <Button
                      size="small"
                      onClick={handleAddParam}
                      variant="text"
                      startIcon={<AddIcon />}
                      sx={(theme) => ({
                        marginTop: 0.8,
                        marginBottom: 2,
                        marginLeft: "-16px",
                        color: "#130F40",
                        width: "115px",
                        fontSize: theme.typography.fontSize - 1,
                      })}
                    >
                      Add Param
                    </Button>
                  </React.Fragment>
                )}

                {/* Occasion */}
                <Typography
                  fontWeight={500}
                  sx={{ fontSize: "12px", marginBottom: "4px" }}
                >
                  When does this happen?
                </Typography>
                <Select
                  size="small"
                  value={!action?.isAdvanced ? "false" : "true"}
                  onChange={(e) =>
                    handleAdvancedToggle(e.target.value as string)
                  }
                  sx={(theme) => ({
                    fontSize: 12,
                    fontWeight: "500",
                    color: theme.palette.primary[500],
                  })}
                >
                  <MenuItem value="false" sx={{ fontSize: 12 }}>
                    Always
                  </MenuItem>
                  <MenuItem value="true" sx={{ fontSize: 12 }}>
                    Sometimes
                  </MenuItem>
                </Select>
              </Stack>
            )}
            {action?.isAdvanced && isAdvancedOpen && (
              <AdvancedAction action={action} onUpdate={onUpdate} />
            )}
          </Stack>
          <ActionPopup
            actions={actions}
            anchorEl={anchorEl}
            onClose={handleClosePopup}
            onCloseAll={handleClosePopup}
            onSelect={(newAction) => onUpdate(action.id, newAction)}
          />
        </>
      )}
      {isWebsite && (
        <>
          <TextField
            size="small"
            onChange={handleWebsiteChange}
            onKeyDown={
              handleWebsiteKeyDown as React.KeyboardEventHandler<HTMLDivElement>
            }
            value={websiteUrl}
            placeholder="Website URL"
            fullWidth
          />
        </>
      )}
      <Stack direction="row" sx={{ mt: 1 }} gap={1}>
        <Button
          onClick={onIsAdvancedToggle}
          size="small"
          sx={{ fontSize: "11px" }}
        >
          {isAdvancedOpen ? "Hide" : "Show"} Advanced
        </Button>
        <Button
          sx={{ fontSize: "11px" }}
          size="small"
          variant="contained"
          disableElevation
          onClick={
            handleWebsiteKeyDown as React.MouseEventHandler<HTMLButtonElement>
          }
        >
          Done
        </Button>
      </Stack>
    </ExpandableCard>
  );
});
