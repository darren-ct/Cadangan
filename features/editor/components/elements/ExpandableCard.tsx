import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { DeleteIcon, EditIcon } from "@/assets/icons";

interface Props extends React.PropsWithChildren {
  title: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
  backgroundColor?: string;
  subTitle?: string;
}

export const ExpandableCard = React.memo(function ExpandableCard({
  active,
  backgroundColor,
  onRemove,
  onClick,
  title,
  children,
  subTitle,
}: Props) {
  return (
    <Stack marginBottom={1} borderRadius={2} sx={{ overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        paddingY="8px"
        paddingX="10px"
        sx={(theme) => ({
          cursor: "pointer",
          borderRadius: !active ? "4px" : "0px",
          color: active ? "white" : "rgba(0,0,0,.75)",
          backgroundColor: active
            ? theme.palette.primary[500]
            : backgroundColor
            ? backgroundColor
            : "rgba(0,0,0,.05)",
          "&:hover": {
            backgroundColor: active
              ? theme.palette.primary[500]
              : backgroundColor
              ? backgroundColor
              : "rgba(0,0,0,.1)",
          },
          transition: "150ms linear",
        })}
        onClick={onClick}
      >
        <Stack direction="column" sx={{ flex: 1 }}>
          <Typography
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: theme.typography.fontSize,
            })}
          >
            {title}
          </Typography>
          {subTitle && (
            <Typography
              sx={(theme) => ({ fontSize: theme.typography.fontSize - 1 })}
            >
              {subTitle}
            </Typography>
          )}
        </Stack>
        {onRemove && (
          <IconButton onClick={onRemove}>
            <DeleteIcon
              sx={{
                color: active ? "white" : "rgba(0,0,0,.75)",
                fontSize: "16px",
              }}
            />
          </IconButton>
        )}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <EditIcon
            sx={{
              color: active ? "white" : "rgba(0,0,0,.75)",
              fontSize: "16px",
            }}
          />
        </IconButton>
      </Stack>

      <Stack
        paddingX="12px"
        paddingY="12px"
        alignItems="flex-end"
        display={!active ? "none" : undefined}
        sx={() => ({ backgroundColor: "rgba(0,0,0,.05)" })}
      >
        {children}
      </Stack>
    </Stack>
  );
});
