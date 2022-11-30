import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Method } from "@/types";

interface Props {
  method: Method;
  index?: number;
  permissions: string[];
  serviceId: string;
  onToggle: (method: Method) => void;
}

export const ListMethodsItem = React.memo(function ListMethodsItem({
  method,
  permissions,
  serviceId,
  onToggle,
}: Props) {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    setIsChecked(!isChecked);
    onToggle(method);
  }, [isChecked, method, onToggle]);

  let methodId = method.id;

  if (method.isFile) {
    methodId = method.id.replace("File", "");
  }

  React.useEffect(() => {
    if (permissions) {
      setIsChecked(permissions.includes(`${serviceId}:${methodId}`));
    }
  }, [methodId, permissions, serviceId]);

  return (
    <Stack
      direction="row"
      flex="1"
      justifyContent="space-between"
      alignItems="center"
    >
      {method.isRule ? (
        <Typography>{method.label}</Typography>
      ) : (
        <Chip
          size="medium"
          label={method.label}
          sx={{
            backgroundColor: method.bgColor,
            color: method.color,
            borderRadius: 1,
          }}
        />
      )}

      {method.isRule ? (
        <Checkbox
          size="medium"
          aria-label={`Select value of rule ${methodId}`}
          checked={isChecked}
          onChange={handleToggle}
        />
      ) : (
        <Switch checked={isChecked} onChange={handleToggle} />
      )}
    </Stack>
  );
});
