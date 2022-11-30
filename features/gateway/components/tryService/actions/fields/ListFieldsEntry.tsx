import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { useDisclose } from "@/hooks";
import type {
  Field,
  FieldOptionsCurrency,
  FieldOptionsDuration,
  FieldOptionsNumber,
  FieldOptionsPercent,
  FieldOptionsRating,
  RoleType,
  Row,
  SelectOption,
} from "@/types";

import type { DateTimeMode, InputType } from "../../../../types";
import { InputAttachment } from "../InputAttachment";
import { InputCheckbox } from "../InputCheckbox";
import { InputDate } from "../InputDate";
import { InputDuration } from "../InputDuration";
import { InputLinkToRecord } from "../InputLinkToRecord";
import { InputMultiSelect } from "../InputMultiSelect";
import { InputNumber } from "../InputNumber";
import { InputPassword } from "../InputPassword";
import { InputRating } from "../InputRating";
import { InputRole } from "../InputRole";
import { InputSingleSelect } from "../InputSingleSelect";
import { InputString } from "../InputString";
import { ListLinkToRecords } from "../ListLinkToRecords";

interface Props {
  field: Field;
  index?: number;
  inputType: InputType;
  loadingGetLinkToRecord: boolean;
  primaryFieldName: string;
  records: Row[];
  selectedOptions?: SelectOption[];
  zIndex: number;
  onSearchRecord: (text: string) => void;
  onSelectAttach: (file: FileList, fieldName: string) => void;
  onSelectDate: (date: Date, mode: DateTimeMode) => void;
  onSelectLinkToRecord: (record: Row) => void;
  onSelectOption: (option: SelectOption, isMultiSelect: boolean) => void;
  onSelectRole: (type: RoleType, isMultiSelect: boolean) => void;
  onShowDatePicker: (fieldName: string) => void;
  onShowLinkToRecord: (field: Field) => void;
  onShowSelectOption: (field: Field) => void;
}

export const ListFieldsEntry = React.memo(function ListFieldsEntry({
  field,
  inputType,
  loadingGetLinkToRecord,
  primaryFieldName,
  records,
  selectedOptions,
  zIndex,
  onSearchRecord,
  onSelectAttach,
  onSelectDate,
  onSelectLinkToRecord,
  onSelectOption,
  onSelectRole,
  onShowDatePicker,
  onShowLinkToRecord,
  onShowSelectOption,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclose();

  const handlePressOption = React.useCallback(() => {
    onShowSelectOption(field);
  }, [field, onShowSelectOption]);

  const handlePressDate = React.useCallback(() => {
    onShowDatePicker(field.name);
  }, [field.name, onShowDatePicker]);

  const handlePressLinkToRecord = React.useCallback(() => {
    onShowLinkToRecord(field);
  }, [field, onShowLinkToRecord]);

  const numberLeftIcon = React.useMemo(() => {
    if (field.type === "currency") {
      return (
        <Typography>
          {(field.options as FieldOptionsCurrency).currencySymbol}
        </Typography>
      );
    }

    return undefined;
  }, [field.options, field.type]);

  const numberRightIcon = React.useMemo(() => {
    if (field.type === "percent") {
      return <Typography>%</Typography>;
    }

    return undefined;
  }, [field.type]);

  return (
    <Stack
      sx={{
        zIndex,
      }}
      spacing={1}
    >
      <Typography fontSize="0.875em" fontWeight={500}>
        {field.name}
      </Typography>
      {inputType.stringInput.some((item) => item === field.type) && (
        <InputString placeholder={field.name} name={`body.${field.name}`} />
      )}
      {inputType.numberInput.some((item) => item === field.type) && (
        <InputNumber
          options={
            field.options as FieldOptionsNumber &
              FieldOptionsCurrency &
              FieldOptionsPercent
          }
          placeholder={field.name}
          leftIcon={numberLeftIcon}
          rightIcon={numberRightIcon}
          name={`body.${field.name}`}
        />
      )}
      {inputType.unsupportedInput.some((item) => item === field.type) && (
        <Typography
          sx={(theme) => ({
            color: theme.palette.grey[500],
          })}
          fontSize="0.875em"
        >
          This field type currently is not supported.
        </Typography>
      )}
      {field.type === "longText" && (
        <InputString
          placeholder={field.name}
          multiline
          name={`body.${field.name}`}
        />
      )}
      {field.type === "singleSelect" && (
        <InputSingleSelect
          fieldName={field.name}
          options={selectedOptions}
          onSelect={onSelectOption}
          onOpen={handlePressOption}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "multiSelect" && (
        <InputMultiSelect
          fieldName={field.name}
          options={selectedOptions}
          onSelect={onSelectOption}
          onOpen={handlePressOption}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "checkBox" && (
        <InputCheckbox
          fieldName={field.name}
          fieldStyle={field.style}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "rating" && (
        <InputRating
          fieldName={field.name}
          fieldStyle={field.style}
          max={(field.options as FieldOptionsRating).max}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "duration" && (
        <InputDuration
          fieldOptions={field.options as FieldOptionsDuration}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "password" && (
        <InputPassword placeholder={field.name} name={`body.${field.name}`} />
      )}
      {field.type === "date" && (
        <InputDate
          fieldName={field.name}
          fieldOptions={field.options}
          fieldType={field.type}
          onSelect={onSelectDate}
          onShow={handlePressDate}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "attachment" && (
        <InputAttachment
          fieldName={field.name}
          isMultiple
          onSelect={onSelectAttach}
          name={`body.${field.name}`}
        />
      )}
      {field.type === "linkToRecord" && (
        <>
          {isOpen ? (
            <ListLinkToRecords
              fieldName={field.name}
              loadingGet={loadingGetLinkToRecord}
              primaryFieldName={primaryFieldName}
              records={records}
              onClose={onClose}
              onOpen={handlePressLinkToRecord}
              onSearch={onSearchRecord}
              onSelect={onSelectLinkToRecord}
            />
          ) : (
            <InputLinkToRecord field={field} onPress={onOpen} />
          )}
        </>
      )}
      {field.type === "role" && (
        <InputRole
          fieldName={field.name}
          onSelect={onSelectRole}
          onOpen={handlePressOption}
          name={`body.${field.name}`}
        />
      )}
    </Stack>
  );
});
