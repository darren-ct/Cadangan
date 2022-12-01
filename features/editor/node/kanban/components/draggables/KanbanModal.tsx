import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import * as React from "react";

import { CloseIcon } from "@/assets/icons";
import { useDataSource } from "@/widgets";
import { Form } from "@/widgets/features/formview/Form";
import type { Row, SelectOption, Table } from "@/widgets/types";

interface Props {
  databaseId: string;
  table: Table;
  option: SelectOption;
  fieldName: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Row) => void;
}

export const KanbanModal = React.memo(function KanbanModal({
  databaseId,
  table,
  option,
  fieldName,
  open,
  onClose,
  onSubmit,
}: Props) {
  const {
    onGetForeignRecords,
    onRowChange,
    onUploadAttachment,
    foreignFields,
    fields,
  } = useDataSource(databaseId, table);

  // Functions
  const handleSubmit = React.useCallback(
    (values: Row) => {
      onSubmit(values);
      onClose();
    },
    [onClose, onSubmit]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        position="relative"
        sx={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: "12px", top: "12px", zIndex: 2 }}
        >
          <CloseIcon sx={(theme) => ({ color: theme.palette.primary[500] })} />
        </IconButton>
        <Box sx={{ height: 480, marginTop: "-40px" }}>
          <Form
            title=""
            isDisabled={false}
            defaultValues={{ [fieldName]: option }}
            include="*"
            fields={fields}
            foreignFields={foreignFields}
            onUploadAttachment={onUploadAttachment}
            submitBtnProps={{
              isPositionFixed: false,
              text: "Create Record",
            }}
            onGetForeignRecords={onGetForeignRecords}
            onRowChange={onRowChange}
            onSubmit={handleSubmit}
          />
        </Box>
      </Box>
    </Modal>
  );
});
