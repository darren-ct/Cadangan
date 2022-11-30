import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import { AddLinkToRecordMenu } from "@/widgets/features/master/menu";
import { RecordItem } from "@/widgets/features/master/menu/linkToRecord/RecordItem";
import type {
  Field,
  FieldOptionsLinkToRecord,
  ForeignField,
  Row,
  WidgetRowOnChangeEvent,
} from "@/widgets/types";

import { useFieldWidgetLinkToRecord } from "../../hooks/useFieldWidgetLinktoRecord";

interface Props {
  name: string;
  error?: string;
  onChange?: (value: Row[]) => void;
  field: Field;
  value?: Row[];
  onRowChange: WidgetRowOnChangeEvent<Row | Row[]>;
  foreignFields: (ForeignField | null)[];
  hideLabel?: boolean;
}

export const LinkToRecord = React.memo(function LinkToRecord({
  name,
  error,
  onChange,
  value,
  field,
  foreignFields,
  onRowChange,
  hideLabel,
}: Props) {
  // Options
  const options = React.useMemo(() => {
    return field?.options as FieldOptionsLinkToRecord;
  }, [field.options]);

  // Get foreign records
  const {
    currentAnchorEl: currentLinkToRecordtAnchorEl,
    currentForeignFields,
    primaryField,
    findValue,
    records,
    isMenuAddLinkToRecordOpen,
    isRecordsLoading,
    handleOpenAddLinkToRecord,
    handleChangeFind,
    handleCloseAddLinkToRecord,
    handleAddLinkToRecord,
    handleRemoveLinkToRecord,
  } = useFieldWidgetLinkToRecord({
    foreignFields,
    onRowChange,
    onChange,
    value,
    field,
  });

  const clickHandler: React.MouseEventHandler<HTMLLabelElement> =
    React.useCallback(
      (e) => {
        handleOpenAddLinkToRecord(null, field, e.currentTarget);
      },
      [field, handleOpenAddLinkToRecord]
    );

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          borderRadius: "6px",
          transition: 150,
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

        <Stack
          direction="row"
          alignItems="center"
          sx={{ flexWrap: "wrap", marginBottom: 1 }}
        >
          {value?.map((item) => (
            <RecordItem
              fields={currentForeignFields}
              key={item._id}
              item={item}
              onClickDelete={handleRemoveLinkToRecord}
              primaryField={primaryField?.name}
            />
          ))}
        </Stack>

        {options?.relationship === "one" && value?.length === 1 ? (
          ""
        ) : (
          <Button
            onClick={clickHandler}
            variant="contained"
            component="label"
            sx={(theme) => ({
              width: "fit-content",
              background: "rgba(0,0,0,.2)",
              "&:hover": {
                background: "rgba(0,0,0,.15)",
              },
              color: theme.palette.grey[800],
            })}
            disableElevation
            size="small"
            startIcon={<AddIcon />}
          >
            Add record
          </Button>
        )}

        <Typography
          sx={{
            color: "error.main",
            fontSize: "10px",
            marginTop: 0.5,
          }}
        >
          {error}
        </Typography>
      </Stack>

      {isMenuAddLinkToRecordOpen && (
        <AddLinkToRecordMenu
          anchorEl={currentLinkToRecordtAnchorEl}
          fields={currentForeignFields}
          findValue={findValue}
          isLoading={isRecordsLoading}
          isOpen={isMenuAddLinkToRecordOpen}
          primaryField={primaryField}
          records={records}
          onAddLinkToRecord={handleAddLinkToRecord}
          onChangeFind={handleChangeFind}
          onClose={handleCloseAddLinkToRecord}
        />
      )}
    </>
  );
});
