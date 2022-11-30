import * as React from "react";

import type { FormProps } from "@/features/editor";
import { useNodeAction } from "@/features/editor";
import { Field, Row } from "@/widgets/types";
import { handleFieldRawValue } from "@/widgets/utils/helper";

export const useFormItem = ({ includes, actions }: FormProps) => {
  const { handleSubmit: nodeHandleSubmit, loading } = useNodeAction({
    actions,
  });

  const includedFieldNames = React.useMemo(() => {
    if (!includes) return [];

    return includes.map((item) => item.name);
  }, [includes]);

  const handleSubmit = React.useCallback(
    async (values: Row, fields: Field[]) => {
      try {
        const body: Row = {
          _id: values._id,
        };

        Object.entries(values).forEach(([key, value]) => {
          if (!includedFieldNames.includes(key) || !value) return;

          const field = fields.find((field) => field.name === key);

          const parsedValue = handleFieldRawValue(value, field);

          body[key] = parsedValue;
        });

        nodeHandleSubmit(body);
      } catch (error) {
        console.trace("form item handleSubmit err", error);
      }
    },
    [includedFieldNames, nodeHandleSubmit]
  );

  return { handleSubmit, loading };
};
