import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { Block, Database, Method } from "@/types";

import type {
  MethodService,
  TryServiceMode,
  TryServiceType,
} from "../../types";
import { ListTryServiceModeItem } from "./ListTryServiceModeItem";
import { TryServiceAdvanced } from "./TryServiceAdvanced";
import { TryServiceSimple } from "./TryServiceSimple";
import { TryServiceTab } from "./TryServiceTab";

const tryServiceModes: TryServiceMode[] = [
  { id: "simple", name: "Simple" },
  { id: "advanced", name: "Advanced" },
];

interface Props {
  activeMethod: Method;
  activeTryServiceType: TryServiceType;
  databases: Database[];
  methodTabList: Method[];
  methodTabServiceIds: MethodService[];
  services: Block[];
  onCloseTryServiceTab: (method: Method, index: number) => void;
  onOpenTryServiceTab: (method: Method) => void;
  onSelectTryServiceType: (tryServiceType: TryServiceType) => void;
}

export const TryService = React.memo(function TryService({
  activeMethod,
  activeTryServiceType,
  databases,
  methodTabList,
  methodTabServiceIds,
  services,
  onCloseTryServiceTab,
  onOpenTryServiceTab,
  onSelectTryServiceType,
}: Props) {
  const activeTabMethodService = methodTabServiceIds.find(
    (item) => item.methodId === activeMethod.id
  );
  const selectedService = services.find(
    (item) => item.id === activeTabMethodService?.serviceId
  );
  const service = selectedService?.id.includes("auth")
    ? (selectedService.parent as Block)
    : selectedService;
  const database = databases?.find((item) =>
    service?.parentId.includes(item.id)
  );
  const isExternal = activeMethod.type === "external";

  let methodName = "";

  if (activeMethod.isUser && activeMethod.name) {
    methodName = activeMethod.name;
  } else if (isExternal && activeMethod.path) {
    methodName = activeMethod.path;
  } else {
    methodName = service?.title?.[0]?.[0] ?? "Unknown Service";
  }

  return (
    <Stack
      sx={{
        width: "100%",
      }}
      flex="2"
    >
      <TryServiceTab
        activeMethod={activeMethod}
        methodTabList={methodTabList}
        onCloseTryServiceTab={onCloseTryServiceTab}
        onOpenTryServiceTab={onOpenTryServiceTab}
      />
      <Stack
        sx={(theme) => ({
          background: theme.palette.grey[100],
          overflow: "hidden",
        })}
        flex="1"
      >
        <Stack
          sx={{ px: 2, height: "53px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" flex="1" alignItems="center" spacing={1}>
            <Chip
              size="small"
              label={activeMethod.label}
              sx={{
                backgroundColor: activeMethod.bgColor,
                color: activeMethod.color,
                marginRight: 1,
                borderRadius: 1,
              }}
            />
            <Typography fontWeight="600">{methodName}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={5}>
            {!isExternal && (
              <Stack direction="row">
                {tryServiceModes.map((item) => {
                  const isActive = item.id === activeTryServiceType;

                  return (
                    <ListTryServiceModeItem
                      key={item.id}
                      isActive={isActive}
                      tryServiceMode={item}
                      onSelect={onSelectTryServiceType}
                    />
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Stack>
        {service && (
          <>
            {isExternal || activeTryServiceType === "advanced" ? (
              <TryServiceAdvanced
                database={database}
                method={activeMethod}
                service={service}
              />
            ) : (
              <>
                <TryServiceSimple
                  database={database}
                  method={activeMethod}
                  service={service}
                />
              </>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
});
