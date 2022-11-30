import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import {
  CheckboxIcon,
  FavoriteIcon,
  FlagIcon,
  StarCheckIcon,
  ThumbUpIcon,
} from "@/assets/icons";
import type { Field } from "@/widgets/types";

interface Props {
  field: Field;
  name: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  error?: string;
  hideLabel?: boolean;
}

export const CheckboxField = React.memo(function CheckboxField({
  field,
  name,
  value,
  onChange,
  error,
  hideLabel,
}: Props) {
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const checkedIcon = React.useMemo(() => {
    const type = field.style?.type;

    if (type === "checklist") {
      return (
        <CheckboxIcon
          sx={{
            color: field.style?.color,
            cursor: "pointer",
            width: "18px",
          }}
        />
      );
    }

    if (type === "heart") {
      return (
        <FavoriteIcon
          sx={{
            color: field.style.color,
            cursor: "pointer",
            width: "16px",
          }}
        />
      );
    }

    if (type === "flag") {
      return (
        <FlagIcon
          sx={{
            color: field.style.color,
            cursor: "pointer",
            width: "16px",
          }}
        />
      );
    }

    if (type === "star") {
      return (
        <StarCheckIcon
          sx={{
            color: field.style.color,
            cursor: "pointer",
            width: "16px",
          }}
        />
      );
    }

    if (type === "like") {
      return (
        <ThumbUpIcon
          sx={{
            color: field.style.color,
            cursor: "pointer",
            width: "16px",
          }}
        />
      );
    }
  }, [field.style]);

  const handleChange = React.useCallback(() => {
    if (onChange) {
      if (value === undefined || value === false) {
        return onChange(true);
      }

      return onChange(false);
    }
  }, [onChange, value]);

  const focusHandler = React.useCallback(() => {
    setIsActive(true);
  }, []);

  const blurHandler = React.useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <Stack alignItems="flex-start">
      {!hideLabel && (
        <Typography
          fontWeight="500"
          variant="subtitle1"
          sx={(theme) => ({ mb: "2px", fontSize: theme.typography.fontSize })}
        >
          {name}
        </Typography>
      )}
      <Checkbox
        onChange={handleChange}
        onFocus={focusHandler}
        onBlur={blurHandler}
        checked={value ? true : false}
        disableRipple
        sx={{
          border: `1px solid ${
            isActive ? "rgb(25, 118, 210)" : "rgba(0,0,0,.1)"
          }`,
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        checkedIcon={checkedIcon}
        icon={<React.Fragment />}
      />
      <Typography sx={{ color: "error.main", fontSize: "10px" }}>
        {error}
      </Typography>
    </Stack>
  );
});
