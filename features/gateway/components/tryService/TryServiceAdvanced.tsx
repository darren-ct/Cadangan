import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { blue, lightBlue } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Scrollbars from "rc-scrollbars";
import * as React from "react";
import { FormProvider } from "react-hook-form";

import { CopyIcon } from "@/assets/icons";
import { AddCircleIcon } from "@/assets/icons/AddCircle";
import { Loading } from "@/components/Loading";

import { useTryServiceAdvanced } from "../../hooks/useTryServiceAdvanced";
import type { TryServiceModeProps } from "../../types";
import { ListHeadersEntry } from "./actions/headers/ListHeadersEntry";
import { InputAttachment } from "./actions/InputAttachment";
import { InputString } from "./actions/InputString";
import { ListAdvancedParamsEntry } from "./actions/params/ListAdvancedParamsEntry";
import { TryServiceResponse } from "./TryServiceResponse";

export const TryServiceAdvanced = React.memo(function TryServiceAdvanced({
  database,
  method,
  service,
}: TryServiceModeProps) {
  const {
    advancedParamsFields,
    headersFields,
    isCopy,
    loadingGet,
    loadingSendRequest,
    methods,
    records,
    responseURL,
    urlParams,
    handleAddAdvancedParam,
    handleAddHeader,
    handleAttachFile,
    handleCopyResponseURL,
    handleRemoveAdvancedParam,
    handleRemoveHeader,
    handleSendRequest,
    handleSubmit,
  } = useTryServiceAdvanced({ database, method, service });

  return (
    <FormProvider {...methods}>
      {loadingGet ? (
        <Loading />
      ) : (
        <>
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
                  // flexDir="row"
                  // borderRadius="md"
                  // alignItems="center"
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
          <Stack
            sx={{
              overflow: "hidden",
            }}
            direction="row"
            flex="1"
          >
            <Scrollbars autoHide style={{ flex: "1" }}>
              <Stack
                sx={{
                  p: 2,
                }}
                spacing={2}
              >
                {method.id.includes("register") && !records.length && (
                  <Stack
                    sx={{
                      p: 1,
                      background: lightBlue[50],
                    }}
                  >
                    <Typography fontSize="0.875em" fontWeight={500}>
                      Info
                    </Typography>
                    <Typography fontSize="0.875em">
                      First registered User will be authorized as the Admin of
                      project. Make sure to input desired email address for the
                      role.
                    </Typography>
                  </Stack>
                )}
                <Stack spacing={1}>
                  <Typography fontSize="0.875em" fontWeight={500}>
                    Headers
                  </Typography>
                  {headersFields.map((item, index) => {
                    return (
                      <ListHeadersEntry
                        key={item.id}
                        index={index}
                        param={item}
                        onRemove={handleRemoveHeader}
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
                    onClick={handleAddHeader}
                  >
                    New Property
                  </Button>
                </Stack>
                <Stack spacing={1}>
                  <Typography fontSize="0.875em" fontWeight={500}>
                    Params
                  </Typography>
                  {advancedParamsFields.map((item, index) => {
                    return (
                      <ListAdvancedParamsEntry
                        key={item.id}
                        index={index}
                        param={item}
                        onRemove={handleRemoveAdvancedParam}
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
                    onClick={handleAddAdvancedParam}
                  >
                    New Query
                  </Button>
                </Stack>
                {(method.label === "PATCH" ||
                  method.label === "DELETE" ||
                  method.label === "LINK" ||
                  method.label === "UNLINK" ||
                  method.type === "get") &&
                  method.type !== "external" && (
                    <Stack spacing={1}>
                      <Typography fontSize="0.875em" fontWeight={500}>
                        id
                      </Typography>
                      <InputString placeholder="id" name="body.id" />
                    </Stack>
                  )}
                {method.type === "external" &&
                  urlParams.map((item) => (
                    <Stack key={item} spacing={1}>
                      <Typography fontSize="0.875em" fontWeight={500}>
                        {item}
                      </Typography>
                      <InputString placeholder={item} name={`body.${item}`} />
                    </Stack>
                  ))}
                {(method.label === "POST" ||
                  method.label === "PUT" ||
                  method.label === "PATCH" ||
                  method.label === "LINK" ||
                  method.label === "UNLINK") &&
                  !method.isFile && (
                    <Stack spacing={1}>
                      <Typography fontSize="0.875em" fontWeight={500}>
                        Body
                      </Typography>
                      <InputString
                        placeholder="Input the request body..."
                        multiline
                        name="advancedBody"
                      />
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
              </Stack>
            </Scrollbars>

            <Divider orientation="vertical" />
            <TryServiceResponse />
          </Stack>
        </>
      )}
    </FormProvider>
  );
});
