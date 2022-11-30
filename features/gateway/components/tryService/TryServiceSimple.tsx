import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { blue, lightBlue } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Scrollbars from "rc-scrollbars";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import {
  CopyIcon,
  FilterIcon,
  LinkIcon,
  PaginationIcon,
  QueryLookupIcon,
  QuerySelectIcon,
  SortIcon,
} from "@/assets/icons";
import { AccountIcon } from "@/assets/icons/Account";
import { AddCircleIcon } from "@/assets/icons/AddCircle";
import { Loading } from "@/components/Loading";

import { useTryServiceSimple } from "../../hooks/useTryServiceSimple";
import { TryServiceModeProps } from "../../types";
import { ListFieldsEntry } from "./actions/fields/ListFieldsEntry";
import { InputAttachment } from "./actions/InputAttachment";
import { InputAuth } from "./actions/InputAuth";
import { InputString } from "./actions/InputString";
import { InputLinkField } from "./actions/linking/InputLinkField";
import { InputLinkRecord } from "./actions/linking/InputLinkRecord";
import { ListAuths } from "./actions/ListAuths";
import { ListLinkToRecords } from "./actions/ListLinkToRecords";
import { InputPagination } from "./actions/params/InputPagination";
import { InputQueryField } from "./actions/params/InputQueryField";
import { ListParamsEntry } from "./actions/params/ListParamsEntry";
import { ListSortsEntry } from "./actions/params/ListSortsEntry";
import { TryServiceResponse } from "./TryServiceResponse";

export const TryServiceSimple = React.memo(function TryServiceSimple({
  database,
  method,
  service,
}: TryServiceModeProps) {
  const {
    autoLookup,
    fields,
    inputType,
    isCopy,
    isLinkToRecordOpen,
    isListAuthsOpen,
    linkToRecords,
    loadingGet,
    loadingGetLinkToRecord,
    loadingSendRequest,
    lookupFields,
    lookupOption,
    memoizedAuths,
    methods,
    paramsFields,
    primaryFieldName,
    recordsLength,
    responseURL,
    selectedAuth,
    selectedConditions,
    selectedFields,
    selectedLinkFieldName,
    selectedOptionValue,
    selectedParamConditions,
    selectedSortConditions,
    selectedSortFields,
    selectFields,
    sortsFields,
    sortConditions,
    handleAddParam,
    handleAddSort,
    handleAttachFile,
    handleCopyResponseURL,
    handleOpenListAuths,
    handleOpenParam,
    handleOpenSort,
    handleRemoveParam,
    handleRemoveSort,
    handleSelectAuth,
    handleSelectCondition,
    handleSelectDate,
    handleSelectField,
    handleSelectLinkField,
    handleSelectLinkRecord,
    handleSelectLinkToRecord,
    handleSelectLookupOption,
    handleSelectOption,
    handleSelectQueryField,
    handleSelectRole,
    handleSelectSortCondition,
    handleSelectSortField,
    handleSearchAuth,
    handleSearchRecord,
    handleSendRequest,
    handleShowDatePicker,
    handleShowLinkRecord,
    handleShowLinkToRecord,
    handleShowSelectOption,
    handleSubmit,
    handleToggleAutoLookup,
    onCloseListAuths,
    onCloseLinkToRecord,
    onOpenLinkToRecord,
  } = useTryServiceSimple({ database, method, service });

  return (
    <>
      <FormProvider {...methods}>
        {loadingGet ? (
          <Loading />
        ) : (
          <Stack flex="1">
            <Stack
              sx={{
                height: "53px",
                px: 2,
              }}
              justifyContent="center"
            >
              <Stack direction="row" spacing={1}>
                <Stack
                  direction="row"
                  sx={(theme) => ({
                    background: "white",
                    pr: "2",
                    border: `1px solid ${theme.palette.grey[500]}`,
                    borderRadius: "6px",
                    position: "relative",
                  })}
                  flex="1"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    sx={{
                      padding: 1,
                    }}
                    fontSize="0.875em"
                  >
                    {responseURL}
                  </Typography>
                  <Button
                    sx={{
                      bg: "white",
                      position: "absolute",
                      top: "0",
                      bottom: "0",
                      right: "2px",
                      pl: 2,
                      textTransform: "none",
                    }}
                    startIcon={<CopyIcon />}
                    onClick={handleCopyResponseURL}
                  >
                    <Typography
                      sx={{
                        ml: "1",
                        color: "black",
                      }}
                      fontSize="0.875em"
                      fontWeight={500}
                    >
                      {isCopy ? "Copied" : "Copy"}
                    </Typography>
                  </Button>
                </Stack>
                <Button
                  sx={{
                    fontWeight: 500,
                  }}
                  size="small"
                  variant="contained"
                  disabled={loadingSendRequest}
                  startIcon={
                    loadingSendRequest ? <CircularProgress size={14} /> : null
                  }
                  onClick={handleSubmit(handleSendRequest)}
                >
                  {loadingSendRequest ? "Sending..." : "Send"}
                </Button>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" flex="1">
              <Scrollbars autoHide style={{ flex: "1" }}>
                <Stack
                  sx={{
                    p: 2,
                  }}
                  spacing={2}
                  flex="1"
                >
                  {method.id.includes("register") && !recordsLength && (
                    <Stack
                      sx={{
                        p: 2,
                        background: lightBlue[50],
                      }}
                    >
                      <Typography fontSize="1em" fontWeight={600}>
                        Info
                      </Typography>
                      <Typography fontSize="0.875em">
                        First registered User will be authorized as the Admin of
                        project. Make sure to input desired email address for
                        the role.
                      </Typography>
                    </Stack>
                  )}
                  {!method.ignoreAuthToken && (
                    <Stack spacing={1} zIndex="10">
                      {isListAuthsOpen ? (
                        <ListAuths
                          auths={memoizedAuths}
                          onCloseAuth={onCloseListAuths}
                          onSearchAuth={handleSearchAuth}
                          onSelectAuth={handleSelectAuth}
                        />
                      ) : (
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <AccountIcon />
                            <Typography fontSize="0.875em" fontWeight={500}>
                              Authenticated as
                            </Typography>
                          </Stack>
                          <InputAuth
                            auth={selectedAuth}
                            onPress={handleOpenListAuths}
                          />
                        </Stack>
                      )}
                    </Stack>
                  )}
                  {(method.label === "PATCH" ||
                    method.label === "DELETE" ||
                    method.label === "LINK" ||
                    method.label === "UNLINK" ||
                    method.type === "get") &&
                    !method.isUser && (
                      <Stack spacing={1}>
                        <Typography fontSize="0.875em" fontWeight={400}>
                          id
                        </Typography>
                        <InputString placeholder="id" name="body.id" />
                      </Stack>
                    )}

                  {(method.id.includes("reset-password") ||
                    method.id.includes("verify-email")) && (
                    <Stack spacing={1}>
                      <Typography fontSize="0.875em" fontWeight={400}>
                        token
                      </Typography>
                      <InputString placeholder="token" name="body.token" />
                    </Stack>
                  )}
                  {method.label === "GET" && !method.isFile && (
                    <Stack spacing={2}>
                      {!method.isUser && method.type !== "get" && (
                        <Stack spacing={2}>
                          <Stack spacing={1} zIndex="1">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <FilterIcon />
                              <Typography fontSize="0.875em" fontWeight={500}>
                                Filter
                              </Typography>
                            </Stack>

                            {paramsFields.map((item, index) => {
                              const zIndex = paramsFields.length - index;

                              return (
                                <ListParamsEntry
                                  key={item.id}
                                  condition={selectedConditions[index]}
                                  conditions={selectedParamConditions}
                                  field={selectedFields[index]}
                                  fields={fields}
                                  index={index}
                                  inputType={inputType}
                                  loadingGetLinkToRecord={
                                    loadingGetLinkToRecord
                                  }
                                  primaryFieldName={primaryFieldName}
                                  records={linkToRecords}
                                  selectedOptions={selectedOptionValue}
                                  zIndex={zIndex}
                                  onOpenParam={handleOpenParam}
                                  onRemoveParam={handleRemoveParam}
                                  onSearchRecord={handleSearchRecord}
                                  onSelectCondition={handleSelectCondition}
                                  onSelectDate={handleSelectDate}
                                  onSelectField={handleSelectField}
                                  onSelectLinkToRecord={
                                    handleSelectLinkToRecord
                                  }
                                  onSelectOption={handleSelectOption}
                                  onSelectRole={handleSelectRole}
                                  onShowDatePicker={handleShowDatePicker}
                                  onShowLinkToRecord={handleShowLinkToRecord}
                                  onShowSelectOption={handleShowSelectOption}
                                />
                              );
                            })}
                            <Button
                              sx={{
                                textTransform: "none",
                                color: blue[600],
                                fontSize: "0.875em",
                                fontWeight: 500,
                                ml: 1,
                                alignSelf: "flex-start",
                              }}
                              startIcon={<AddCircleIcon />}
                              onClick={handleAddParam}
                            >
                              New Condition
                            </Button>
                          </Stack>
                          {method.type !== "count" && (
                            <Stack spacing={2} zIndex="0">
                              <Stack spacing={1}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <SortIcon />
                                  <Typography
                                    fontSize="0.875em"
                                    fontWeight={500}
                                  >
                                    Sort
                                  </Typography>
                                </Stack>
                                {sortsFields.map((item, index) => {
                                  return (
                                    <ListSortsEntry
                                      key={item.id}
                                      condition={selectedSortConditions[index]}
                                      conditions={sortConditions}
                                      field={selectedSortFields[index]}
                                      fields={fields}
                                      index={index}
                                      onOpen={handleOpenSort}
                                      onRemove={handleRemoveSort}
                                      onSelectCondition={
                                        handleSelectSortCondition
                                      }
                                      onSelectField={handleSelectSortField}
                                    />
                                  );
                                })}
                                <Button
                                  sx={{
                                    textTransform: "none",
                                    color: blue[600],
                                    fontSize: "0.875em",
                                    fontWeight: 500,
                                    ml: 1,
                                    alignSelf: "flex-start",
                                  }}
                                  startIcon={<AddCircleIcon />}
                                  onClick={handleAddSort}
                                >
                                  New Sort
                                </Button>
                              </Stack>
                              <Stack spacing={1}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <PaginationIcon />

                                  <Typography
                                    fontSize="0.875em"
                                    fontWeight={500}
                                  >
                                    Pagination
                                  </Typography>
                                </Stack>
                                <InputPagination />
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      )}
                      {method.type !== "count" && (
                        <Stack spacing={2}>
                          {lookupFields.length > 0 && (
                            <Stack
                              sx={{
                                zIndex: 1,
                              }}
                              spacing={1}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <QueryLookupIcon />
                                <Typography fontSize="0.875em" fontWeight={500}>
                                  Lookup
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Typography fontSize="0.875em">
                                  Allow auto lookup to all link to record fields
                                </Typography>
                                <Switch
                                  checked={autoLookup}
                                  size="small"
                                  onChange={handleToggleAutoLookup}
                                />
                              </Stack>
                              {!autoLookup && (
                                <Stack
                                  sx={{
                                    mb: 0.5,
                                  }}
                                >
                                  <InputQueryField
                                    fields={lookupFields}
                                    type="lookup"
                                    name="lookups"
                                    onSelect={handleSelectQueryField}
                                  />
                                </Stack>
                              )}

                              <Stack sx={{ zIndex: "-1" }}>
                                <FormControl size="small">
                                  <RadioGroup
                                    name="lookupOptionRG"
                                    value={lookupOption}
                                    onChange={handleSelectLookupOption}
                                  >
                                    <FormControlLabel
                                      value="all"
                                      control={<Radio size="small" />}
                                      label={
                                        <Typography fontSize="0.875em">
                                          Show all field data
                                        </Typography>
                                      }
                                    />
                                    <FormControlLabel
                                      value="id"
                                      control={<Radio size="small" />}
                                      label={
                                        <Typography fontSize="0.875em">
                                          Only show the field id
                                        </Typography>
                                      }
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Stack>
                            </Stack>
                          )}
                          {!method.isUser && (
                            <Stack spacing={1}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <QuerySelectIcon />
                                <Typography fontSize="0.875em" fontWeight={500}>
                                  Select
                                </Typography>
                              </Stack>

                              <InputQueryField
                                fields={selectFields}
                                type="select"
                                name="selects"
                                onSelect={handleSelectQueryField}
                              />
                            </Stack>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  )}

                  {(method.label === "POST" || method.label === "PATCH") &&
                    !method.isFile &&
                    fields.length > 0 && (
                      <Stack spacing={1} zIndex="0">
                        {fields
                          .filter(
                            (item) =>
                              !inputType.automatedInput.includes(item.type)
                          )
                          .map((item, index) => {
                            const zIndex = fields.length - index;

                            return (
                              <ListFieldsEntry
                                key={item.id}
                                field={item}
                                inputType={inputType}
                                loadingGetLinkToRecord={loadingGetLinkToRecord}
                                primaryFieldName={primaryFieldName}
                                records={linkToRecords}
                                selectedOptions={selectedOptionValue}
                                zIndex={zIndex}
                                onSearchRecord={handleSearchRecord}
                                onSelectAttach={handleAttachFile}
                                onSelectDate={handleSelectDate}
                                onSelectLinkToRecord={handleSelectLinkToRecord}
                                onSelectOption={handleSelectOption}
                                onSelectRole={handleSelectRole}
                                onShowDatePicker={handleShowDatePicker}
                                onShowLinkToRecord={handleShowLinkToRecord}
                                onShowSelectOption={handleShowSelectOption}
                              />
                            );
                          })}
                      </Stack>
                    )}
                  {method.label === "POST" && method.isFile && (
                    <Stack spacing={1}>
                      <Typography fontSize="0.875em" fontWeight={500}>
                        File
                      </Typography>
                      <InputAttachment
                        fieldName="file"
                        onSelect={handleAttachFile}
                        name="body.file"
                      />
                    </Stack>
                  )}
                  {(method.label === "LINK" || method.label === "UNLINK") && (
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LinkIcon />
                        <Typography fontSize="0.875em" fontWeight={500}>
                          {method.label === "LINK" ? "Linking" : "Unlinking"}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <InputLinkField
                          fieldName={selectedLinkFieldName}
                          fields={lookupFields}
                          onSelect={handleSelectLinkField}
                        />
                        {!!selectedLinkFieldName && (
                          <>
                            {isLinkToRecordOpen ? (
                              <ListLinkToRecords
                                w="50%"
                                fieldName={selectedLinkFieldName}
                                loadingGet={loadingGetLinkToRecord}
                                primaryFieldName={primaryFieldName}
                                records={linkToRecords}
                                onClose={onCloseLinkToRecord}
                                onOpen={handleShowLinkRecord}
                                onSearch={handleSearchRecord}
                                onSelect={handleSelectLinkRecord}
                              />
                            ) : (
                              <InputLinkRecord
                                w="50%"
                                fieldName={selectedLinkFieldName}
                                primaryFieldName={primaryFieldName}
                                onPress={onOpenLinkToRecord}
                              />
                            )}
                          </>
                        )}
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </Scrollbars>
              <Divider orientation="vertical" />
              <TryServiceResponse />
            </Stack>
          </Stack>
        )}
      </FormProvider>
    </>
  );
});
