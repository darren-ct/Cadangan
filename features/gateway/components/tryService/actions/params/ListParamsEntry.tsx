import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { RemoveIcon } from "@/assets/icons";
import { FieldIcon } from "@/components/FieldIcon";
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

import type { Condition, DateTimeMode, InputType } from "../../../../types";
import { InputCheckbox } from "../InputCheckbox";
import { InputDate } from "../InputDate";
import { InputDuration } from "../InputDuration";
import { InputLinkToRecord } from "../InputLinkToRecord";
import { InputMultiSelect } from "../InputMultiSelect";
import { InputNumber } from "../InputNumber";
import { InputRating } from "../InputRating";
import { InputRole } from "../InputRole";
import { InputSingleSelect } from "../InputSingleSelect";
import { InputString } from "../InputString";
import { ListLinkToRecords } from "../ListLinkToRecords";

interface Props {
  condition?: Condition;
  conditions: Condition[];
  field?: Field;
  fields: Field[];
  index: number;
  inputType: InputType;
  loadingGetLinkToRecord: boolean;
  primaryFieldName: string;
  records: Row[];
  selectedOptions?: SelectOption[];
  zIndex: number;
  onOpenParam: (index: number) => void;
  onRemoveParam: (index: number) => void;
  onSearchRecord: (text: string) => void;
  onSelectCondition: (condition: Condition) => void;
  onSelectDate: (date: Date, mode: DateTimeMode) => void;
  onSelectField: (field: Field) => void;
  onSelectLinkToRecord: (record: Row) => void;
  onSelectOption: (option: SelectOption, isMultiSelect: boolean) => void;
  onSelectRole: (type: RoleType, isMultiSelect: boolean) => void;
  onShowDatePicker: (fieldName: string, index?: number) => void;
  onShowLinkToRecord: (field: Field, index?: number) => void;
  onShowSelectOption: (field: Field, index?: number) => void;
}

export const ListParamsEntry = React.memo(function ListParamsEntry({
  condition,
  conditions,
  field,
  fields,
  index,
  inputType,
  loadingGetLinkToRecord,
  primaryFieldName,
  records,
  selectedOptions,
  zIndex,
  onOpenParam,
  onRemoveParam,
  onSearchRecord,
  onSelectCondition,
  onSelectDate,
  onSelectField,
  onSelectLinkToRecord,
  onSelectOption,
  onSelectRole,
  onShowDatePicker,
  onShowLinkToRecord,
  onShowSelectOption,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclose();

  const handlePressOpen = React.useCallback(() => {
    onOpenParam(index);
  }, [index, onOpenParam]);

  const handleSelect = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedField = fields.find(
        (item) => item.id === event.target.value
      );

      onSelectField(selectedField);
    },
    [fields, onSelectField]
  );

  const handleSelectCondition = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedCondition = conditions.find(
        (item) => item.id === event.target.value
      );

      onSelectCondition(selectedCondition);
    },
    [conditions, onSelectCondition]
  );

  const handlePressRemove = React.useCallback(() => {
    onRemoveParam(index);
  }, [index, onRemoveParam]);

  const handlePressOption = React.useCallback(() => {
    if (field) {
      onShowSelectOption(field, index);
    }
  }, [field, index, onShowSelectOption]);

  const handlePressDate = React.useCallback(() => {
    if (field?.name) {
      onShowDatePicker(field.name, index);
    }
  }, [field?.name, index, onShowDatePicker]);

  const handlePressLinkToRecord = React.useCallback(() => {
    if (field) {
      onShowLinkToRecord(field, index);
    }
  }, [field, index, onShowLinkToRecord]);

  return (
    <Stack
      sx={{
        zIndex,
      }}
      spacing={1}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack
          sx={{
            border: "1px solid transparent",
            px: "2",
          }}
          direction="row"
          flex="1"
        >
          <Typography sx={{ width: "50%" }} fontSize="0.875em">
            {index ? "And" : "Where"}
          </Typography>
        </Stack>
        <FormControl sx={{ flex: 1 }} size="small">
          <Select
            onOpen={handlePressOpen}
            value={field?.id ?? ""}
            placeholder="Select field"
            onChange={handleSelect}
          >
            {fields.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FieldIcon sx={{ color: "black" }} type={item.type} />
                  <Typography fontSize="0.875em">{item.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton onClick={handlePressRemove}>
          <RemoveIcon
            sx={(theme) => ({
              color: theme.palette.grey[600],
              fontSize: "18px",
            })}
          />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={1}>
        <FormControl sx={{ width: "50%" }} size="small">
          <Select
            onOpen={handlePressOpen}
            value={condition?.id ?? ""}
            placeholder="Unknown Filter"
            onChange={handleSelectCondition}
          >
            {conditions.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!field?.name ? (
          <Box sx={{ width: "50%" }} />
        ) : (
          <>
            {inputType.stringInput.some((item) => item === field.type) && (
              <InputString
                w="50%"
                placeholder="Enter a value"
                name={`params.${index}.value`}
              />
            )}
            {inputType.numberInput.some((item) => item === field.type) && (
              <InputNumber
                w="50%"
                options={
                  field.options as FieldOptionsNumber &
                    FieldOptionsCurrency &
                    FieldOptionsPercent
                }
                placeholder="Enter a value"
                name={`params.${index}.value`}
              />
            )}
            {inputType.unsupportedInput
              .concat(["password", "attachment", "createdBy", "updatedBy"])
              .some((item) => item === field.type) && (
              <Typography
                sx={(theme) => ({
                  width: "50%",
                  color: theme.palette.grey[400],
                })}
                fontSize="0.875em"
              >
                Unavailable
              </Typography>
            )}
            {field.type === "longText" && (
              <InputString
                w="50%"
                placeholder="Enter a value"
                multiline
                name={`params.${index}.value`}
              />
            )}
            {field.type === "singleSelect" && (
              <InputSingleSelect
                w="50%"
                fieldName={field.name}
                options={selectedOptions}
                onOpen={handlePressOption}
                onSelect={onSelectOption}
                name={`params.${index}.value`}
              />
            )}
            {field.type === "multiSelect" && (
              <InputMultiSelect
                w="50%"
                fieldName={field.name}
                options={selectedOptions}
                onSelect={onSelectOption}
                onOpen={handlePressOption}
                name={`params.${index}.value`}
              />
            )}
            {field.type === "checkBox" && (
              <InputCheckbox
                w="50%"
                fieldName={field.name}
                fieldStyle={field.style}
                name={`params.${index}.value`}
              />
            )}
            {field.type === "rating" && (
              <InputRating
                w="50%"
                fieldName={field.name}
                fieldStyle={field.style}
                max={(field.options as FieldOptionsRating).max}
                name={`params.${index}.value`}
              />
            )}
            {field.type === "duration" && (
              <InputDuration
                w="50%"
                fieldOptions={field.options as FieldOptionsDuration}
                name={`params.${index}.value`}
              />
            )}
            {(field.type === "date" ||
              field.type === "createdAt" ||
              field.type === "updatedAt") && (
              <InputDate
                w="50%"
                fieldName="Enter a date"
                fieldOptions={field.options}
                fieldType={field.type}
                onSelect={onSelectDate}
                onShow={handlePressDate}
                name={`params.${index}.value`}
              />
            )}
            {field.type === "linkToRecord" && (
              <>
                {isOpen ? (
                  <ListLinkToRecords
                    w="50%"
                    fieldName={field.name}
                    idx={index}
                    loadingGet={loadingGetLinkToRecord}
                    primaryFieldName={primaryFieldName}
                    records={records}
                    onClose={onClose}
                    onOpen={handlePressLinkToRecord}
                    onSearch={onSearchRecord}
                    onSelect={onSelectLinkToRecord}
                  />
                ) : (
                  <InputLinkToRecord
                    w="50%"
                    field={field}
                    index={index}
                    onPress={onOpen}
                  />
                )}
              </>
            )}
            {field.type === "role" && (
              <InputRole
                w="50%"
                fieldName={field.name}
                onOpen={handlePressOption}
                onSelect={onSelectRole}
                name={`params.${index}.value`}
              />
            )}
          </>
        )}
        <Box sx={{ width: "20px" }} />
      </Stack>
    </Stack>
  );
});
