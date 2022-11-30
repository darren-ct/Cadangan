import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import {
  FavoriteIcon,
  FlagIcon,
  StarCheckIcon,
  ThumbUpIcon,
} from "@/assets/icons";
import type { Field, FieldOptionsRating } from "@/widgets/types";

interface Props {
  field: Field;
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  error?: string;
  hideLabel?: boolean;
}

export const Ratings = React.memo(function Ratings({
  field,
  name,
  value,
  onChange,
  error,
  hideLabel,
}: Props) {
  const renderIcon = React.useMemo(() => {
    const { type } = field.style;

    if (type === "heart") {
      return (
        <FavoriteIcon
          fontSize="inherit"
          sx={{ marginRight: "4px", width: "18px" }}
        />
      );
    }

    if (type === "flag") {
      return (
        <FlagIcon
          fontSize="inherit"
          sx={{ marginRight: "4px", width: "18px" }}
        />
      );
    }

    if (type === "star") {
      return (
        <StarCheckIcon
          fontSize="inherit"
          sx={{ marginRight: "4px", width: "18px" }}
        />
      );
    }

    if (type === "like") {
      return (
        <ThumbUpIcon
          fontSize="inherit"
          sx={{ marginRight: "4px", width: "18px" }}
        />
      );
    }
  }, [field.style]);

  const changeHandler = React.useCallback(
    (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <Stack
      alignItems="flex-start"
      sx={{
        width: "100%",
      }}
    >
      {!hideLabel && (
        <Typography
          fontWeight="500"
          variant="subtitle1"
          sx={(theme) => ({ mb: "2px", fontSize: theme.typography.fontSize })}
        >
          {name}
        </Typography>
      )}
      <Box
        sx={(theme) => ({
          display: "flex",
          width: "100%",
          border: `1px solid ${theme.palette.grey[400]}`,
          ":hover": {
            borderColor: theme.palette.grey[800],
          },
          borderRadius: 1.2,
          padding: "8.5px 14px",
        })}
      >
        <Rating
          name="simple-controlled"
          value={value ? value : 0}
          emptyIcon={renderIcon}
          icon={renderIcon}
          onChange={changeHandler}
          sx={{
            color: field.style.color,
          }}
          max={(field.options as FieldOptionsRating).max}
        />
      </Box>
      <Typography sx={{ color: "error.main", fontSize: "10px" }}>
        {error}
      </Typography>
    </Stack>
  );
});
