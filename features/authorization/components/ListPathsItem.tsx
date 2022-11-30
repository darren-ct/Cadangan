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
  onToggle: (method: Method, isRule?: boolean) => void;
}

const typeWithRule = [
  {
    type: "find",
    text: "Only find their own data?",
  },
  {
    type: "update",
    text: "Prevent updating others' data?",
  },
  {
    type: "delete",
    text: "Prevent deleting others' data?",
  },
];

export const ListPathsItem = React.memo(function ListPathsItem({
  method,
  permissions,
  serviceId,
  onToggle,
}: Props) {
  const [isChecked, setIsChecked] = React.useState(false);
  const [isRuleChecked, setIsRuleChecked] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    setIsChecked(!isChecked);
    onToggle(method);
  }, [isChecked, method, onToggle]);

  const handleToggleRule = React.useCallback(() => {
    setIsRuleChecked(!isChecked);
    onToggle(method, true);
  }, [isChecked, method, onToggle]);

  let methodId = method.id;

  if (method.isFile) {
    methodId = method.id.replace("File", "");
  }

  const ruleType = typeWithRule.find((item) => item.type === method.type);

  React.useEffect(() => {
    if (permissions) {
      setIsChecked(
        permissions.includes(`${serviceId}:${methodId}:${method.type}`)
      );
      if (ruleType) {
        setIsRuleChecked(
          permissions.includes(`${serviceId}:${methodId}:${method.type}Own`)
        );
      }
    }
  }, [method, methodId, permissions, ruleType, serviceId]);

  return (
    <Stack spacing={0.25}>
      <Stack
        direction="row"
        flex="1"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            size="medium"
            label={method.method}
            sx={{
              backgroundColor: method.bgColor,
              color: method.color,
              borderRadius: 1,
            }}
          />
          <Typography>{method.path}</Typography>
        </Stack>

        <Switch checked={isChecked} onChange={handleToggle} />
      </Stack>
      {isChecked && ruleType && (
        <Stack
          sx={{
            ml: "32px !important",
          }}
          direction="row"
          flex="1"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>{ruleType.text}</Typography>

          <Checkbox
            size="medium"
            aria-label={`Select value of rule ${methodId}`}
            checked={isRuleChecked}
            onChange={handleToggleRule}
          />
        </Stack>
      )}
    </Stack>
  );
});
