import { useRouter } from "next/router";
import * as React from "react";

import type { FormProps } from "@/features/editor";
import { useDataSource } from "@/widgets";
import { Form } from "@/widgets/features/formview/Form";
import { ExplorerParams } from "@/widgets/types";

import { useFormItem } from "../../hooks";
import { FormPlaceholder } from "./FormPlaceholder";

export const FormItem = React.memo(function FormItem({
  isDisabled = false,
  itemProps = {
    actions: [],
    includes: [],
    formTodo: undefined,
    table: undefined,
    submitBtnProps: undefined,
  },
}: {
  itemProps: FormProps;
  isDisabled?: boolean;
}) {
  const router = useRouter();

  const { databaseId } = router.query as ExplorerParams;

  const { handleSubmit, loading } = useFormItem(itemProps);

  const include = React.useMemo(() => {
    const isExist = itemProps && itemProps?.includes;

    if (!isExist || itemProps?.includes?.length === 0) {
      return "*";
    }

    return itemProps.includes.map((item) => item.id);
  }, [itemProps]);

  const table = React.useMemo(() => itemProps?.table, [itemProps?.table]);
  const fields = React.useMemo(
    () => itemProps?.includes ?? [],
    [itemProps?.includes]
  );

  const {
    onGetForeignRecords,
    onRowChange,
    onUploadAttachment,
    foreignFields,
  } = useDataSource(databaseId, table);

  console;

  return (
    <React.Fragment>
      {!itemProps.table && <FormPlaceholder />}
      {itemProps.table && (
        <Form
          title=""
          isDisabled={isDisabled}
          include={include}
          fields={fields}
          onGetForeignRecords={onGetForeignRecords}
          onRowChange={onRowChange}
          onUploadAttachment={onUploadAttachment}
          foreignFields={foreignFields}
          submitBtnProps={{
            isPositionFixed: false,
            text: itemProps.submitBtnProps?.text ?? "Click Me",
          }}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </React.Fragment>
  );
});
