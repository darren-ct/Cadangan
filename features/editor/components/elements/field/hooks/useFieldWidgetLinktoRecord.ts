import type { CalculatedColumn } from "@kontenbase/data-grid";
import * as React from "react";

import { useGetForeignRecords } from "@/widgets/api";
import type { TableInputParams } from "@/widgets/api/types";
import { useDisclose, useGlobalEventStore } from "@/widgets/hooks";
import type {
  Field,
  FieldOptionsLinkToRecord,
  ForeignField,
  Row,
  WidgetOnGetForeignRecords,
  WidgetRowOnChangeEvent,
} from "@/widgets/types";

interface Props {
  foreignFields?: (ForeignField | null)[];
  field: Field;
  onRowChange?: WidgetRowOnChangeEvent<Row | Row[]>;
  onChange: (value: Row[]) => void;
  value: Row[];
}

export const useFieldWidgetLinkToRecord = ({
  foreignFields,
  onChange,
  value,
  field,
}: Props) => {
  const onGetForeignRecords = useGlobalEventStore(
    (state) => state.onGetForeignRecords
  );

  // CLOSE OPEN STATE      V
  const {
    isOpen: isMenuAddLinkToRecordOpen,
    onOpen: onOpenMenuAddLinkToRecord,
    onClose: onCloseMenuAddLinkToRecord,
  } = useDisclose();
  const {
    isOpen: isMenuExpandLinkToRecordOpen,
    onOpen: onOpenMenuExpandLinkToRecord,
    onClose: onCloseMenuExpandLinkToRecord,
  } = useDisclose();

  // Current anchor  V
  const [currentAnchorEl, setCurrentAnchorEl] =
    React.useState<HTMLElement | null>(null);

  // Current Foreign Fields V
  const currentForeignFields = React.useMemo(() => {
    if (!foreignFields || !field) return [];

    return (
      foreignFields?.find(
        (item) =>
          item?.table.id ===
          (field.options as FieldOptionsLinkToRecord).foreignTableId
      )?.fields ?? []
    );
  }, [foreignFields, field]);

  // Current Field Options V
  const currentFieldOptions = React.useMemo(
    () => field.options as FieldOptionsLinkToRecord,
    [field]
  );
  // Current recordIds  X
  // const [currentRecordIds, setCurrentRecordIds] = React.useState<string[]>([]);
  const currentRecordIds = React.useMemo(() => {
    if (!value) return [];

    return value.map((item) => item._id);
  }, [value]);

  // Find Value V
  const [findValue, setFindValue] = React.useState<string>("");

  // TABLE ({foreigntableid, foreigntablename}) V
  const table: TableInputParams = React.useMemo(
    () => ({
      id: currentFieldOptions?.foreignTableId as string,
      name: currentFieldOptions?.foreignTableName as string,
    }),
    [currentFieldOptions]
  );

  // V
  const isEnabled = !!currentFieldOptions && !!onGetForeignRecords;

  // Fetch V
  const { data: dataRecords, isLoading: isRecordsLoading } =
    useGetForeignRecords({
      query: {},
      table,
      enabled: isEnabled,
      getForeignRecords: onGetForeignRecords as WidgetOnGetForeignRecords,
    });

  //  Reset V
  const resetStates = React.useCallback(() => {
    setCurrentAnchorEl(null);
    setFindValue("");
  }, []);

  // OPEN V
  const handleOpenAddLinkToRecord = React.useCallback(
    (
      row?: Row,
      column?: CalculatedColumn<Row | unknown> | Field,
      anchorEl?: HTMLElement | null
    ) => {
      if (anchorEl) {
        setCurrentAnchorEl(anchorEl);
      }

      onCloseMenuExpandLinkToRecord();
      onOpenMenuAddLinkToRecord();
    },
    [onCloseMenuExpandLinkToRecord, onOpenMenuAddLinkToRecord]
  );

  // FIND V
  const handleChangeFind = React.useCallback((value: string) => {
    setFindValue(value);
  }, []);

  // ga dipake XXXXX
  const handleSubmitCreateRecord = React.useCallback(() => {
    setFindValue(findValue);
  }, [findValue]);

  // CLOSE V
  const handleCloseAddLinkToRecord = React.useCallback(() => {
    onCloseMenuAddLinkToRecord();
    resetStates();
  }, [onCloseMenuAddLinkToRecord, resetStates]);

  // ga dipake XXXXX
  const handleCloseExpandLinkToRecord = React.useCallback(() => {
    onCloseMenuExpandLinkToRecord();
    resetStates();
  }, [onCloseMenuExpandLinkToRecord, resetStates]);

  // Mine
  const handleRemoveLinkToRecord = React.useCallback(
    (item: Row) => {
      const newArray = value.filter((content) => content._id !== item._id);
      onChange(newArray);
      onCloseMenuAddLinkToRecord();
      onCloseMenuExpandLinkToRecord();
    },
    [value, onChange, onCloseMenuAddLinkToRecord, onCloseMenuExpandLinkToRecord]
  );

  const handleAddLinkToRecord = React.useCallback(
    (row: Row) => {
      if (value !== undefined) {
        const newArray = [...value, row];
        onChange(newArray);
        onCloseMenuAddLinkToRecord();
        return onCloseMenuExpandLinkToRecord();
      }

      const newArray = [row];
      onChange(newArray);
      onCloseMenuAddLinkToRecord();
      onCloseMenuExpandLinkToRecord();
    },
    [value, onChange, onCloseMenuAddLinkToRecord, onCloseMenuExpandLinkToRecord]
  );

  // primary Field
  const primaryField = React.useMemo(
    () => currentForeignFields.find((item) => item.isPrimary),
    [currentForeignFields]
  );

  //  records
  const records = React.useMemo(() => {
    if (dataRecords) {
      if (isMenuAddLinkToRecordOpen && value) {
        return dataRecords.filter(
          (item) =>
            !currentRecordIds.find(
              (currentRecordItem) => currentRecordItem === item._id
            )
        );
      }

      return dataRecords;
    }

    return [];
  }, [value, dataRecords, isMenuAddLinkToRecordOpen, currentRecordIds]);

  return {
    currentAnchorEl,
    currentForeignFields,
    currentRecordIds,
    isMenuAddLinkToRecordOpen,
    isMenuExpandLinkToRecordOpen,
    isRecordsLoading,
    findValue,
    primaryField,
    records,
    onOpenMenuAddLinkToRecord,
    onCloseMenuAddLinkToRecord,
    onOpenMenuExpandLinkToRecord,
    onCloseMenuExpandLinkToRecord,
    handleOpenAddLinkToRecord,
    handleChangeFind,
    handleSubmitCreateRecord,
    handleCloseAddLinkToRecord,
    handleCloseExpandLinkToRecord,
    handleAddLinkToRecord,
    handleRemoveLinkToRecord,
  };
};
