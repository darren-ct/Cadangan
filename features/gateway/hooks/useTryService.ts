import * as React from "react";

import { Block, Method } from "@/types";

import type { MethodService, TryServiceType } from "../types";

export const useTryService = () => {
  const [methodTabList, setMethodTabList] = React.useState<Method[]>([]);
  const [methodTabServiceIds, setMethodTabServiceIds] = React.useState<
    MethodService[]
  >([]);
  const [activeMethod, setActiveMethod] = React.useState<Method | undefined>(
    undefined
  );
  const [activeTryServiceType, setActiveTryServiceType] =
    React.useState<TryServiceType>("simple");

  const handleOpenTryService = React.useCallback(
    (method?: Method, service?: Block) => {
      setActiveMethod(method);

      if (method) {
        if (!methodTabList.find((item) => item.id === method.id)) {
          setMethodTabList([...methodTabList, method]);
          setMethodTabServiceIds([
            ...methodTabServiceIds,
            { methodId: method.id, serviceId: service?.id ?? "" },
          ]);
        }
      }
    },
    [methodTabList, methodTabServiceIds]
  );

  const handleCloseTryService = React.useCallback(() => {
    setActiveMethod(undefined);
  }, []);
  const handleOpenTryServiceTab = React.useCallback((method: Method) => {
    setActiveMethod(method);
  }, []);

  const handleCloseTryServiceTab = React.useCallback(
    (method: Method, index: number) => {
      if (methodTabList.length <= 1) {
        handleCloseTryService();
      } else if (method.id === activeMethod?.id) {
        if (index === 0) {
          setActiveMethod(methodTabList[1]);
        } else {
          setActiveMethod(methodTabList[index - 1]);
        }
      }

      const newMethodTabList = methodTabList.slice();
      const newMethodTabServiceIds = methodTabServiceIds.slice();
      const selectedMethodTabServiceIdsIndex = methodTabServiceIds.findIndex(
        (item) => item.methodId === method.id
      );

      newMethodTabList.splice(index, 1);
      newMethodTabServiceIds.splice(selectedMethodTabServiceIdsIndex, 1);
      setMethodTabList(newMethodTabList);
      setMethodTabServiceIds(newMethodTabServiceIds);
    },
    [activeMethod, handleCloseTryService, methodTabList, methodTabServiceIds]
  );
  const handleCloseTryServiceTabsByService = React.useCallback(
    (service: Block) => {
      const newMethodTabList = methodTabList.filter(
        (item) => item.tableId !== service.properties.tableId
      );
      const newMethodTabServiceIds = methodTabServiceIds.filter((item) =>
        newMethodTabList.find((methodTab) => methodTab.id === item.methodId)
      );

      if (newMethodTabList.length <= 0) {
        handleCloseTryService();
      } else if (
        !newMethodTabList.find((item) => item.id === activeMethod.id)
      ) {
        setActiveMethod(methodTabList[0]);
      }

      setMethodTabList(newMethodTabList);
      setMethodTabServiceIds(newMethodTabServiceIds);
    },
    [activeMethod, handleCloseTryService, methodTabList, methodTabServiceIds]
  );

  const handleSelectTryServiceType = React.useCallback(
    (tryServiceType: TryServiceType) => {
      setActiveTryServiceType(tryServiceType);
    },
    []
  );

  return {
    activeMethod,
    activeTryServiceType,
    methodTabList,
    methodTabServiceIds,
    handleCloseTryService,
    handleCloseTryServiceTab,
    handleCloseTryServiceTabsByService,
    handleOpenTryService,
    handleOpenTryServiceTab,
    handleSelectTryServiceType,
  };
};
