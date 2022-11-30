import * as React from "react";

import { getSDK } from "@/lib";
import type { SDKClient } from "@/types";
import {
  Field,
  Table,
  WidgetOnGetFields,
  WidgetOnGetTables,
} from "@/widgets/types";

import { useEditorDraggableStore } from "../hooks/useEditorDraggableStore";
import { Draggable } from "../types";

interface Props {
  dbId: string;
}

export const usePropsBar = ({ dbId }: Props) => {
  const { draggables, activeId } = useEditorDraggableStore();
  const sdk = React.useCallback((): void | Promise<SDKClient> => {
    if (!dbId) {
      return;
    }

    return getSDK({ projectId: dbId });
  }, [dbId]);

  const memoizedDraggable: Draggable | undefined = React.useMemo(() => {
    return draggables.find((item) => item.id === activeId);
  }, [draggables, activeId]);

  const onGetTables: WidgetOnGetTables = React.useCallback(async () => {
    const connector = await sdk();

    if (!connector) {
      return;
    }

    const { data, error } = await connector.table.find();

    if (error) throw new Error(error.message);

    return data as Table[];
  }, [sdk]);

  const onGetFields: WidgetOnGetFields = React.useCallback(
    async (table) => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector.service(table.id).field.find();

      if (error) throw new Error(error.message);

      return data as unknown as Field[];
    },
    [sdk]
  );

  return {
    memoizedDraggable,
    onGetTables,
    onGetFields,
  };
};
