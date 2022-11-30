import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";

import { Form } from "@/components/Elements";
import { useFocusableInput } from "@/hooks/useFocusableInput";
import { Block, Method } from "@/types";

import type { FormMethod, ModalProps } from "../types";
import { InputSelectMethod } from "./InputSelectMethod";

export interface Props extends ModalProps {
  activeService?: Block;
  isLoading: boolean;
  onSubmit: (data: FormMethod) => void;
}

export const ModalNewMethod = React.memo(function ModalNewMethod({
  isModalOpen,
  isLoading,
  onCloseModal,
  onSubmit,
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useFormContext<FormMethod>();
  const { setInputRef } = useFocusableInput(isModalOpen);
  const selectedService = useWatch({ control, name: "selectedService" });
  const {
    field: { value: methodPath, onChange: onChangePath, onBlur: onBlurPath },
  } = useController({
    control,
    name: "methodPath",
    rules: {
      required: "Path is required",
      pattern: {
        value: /^\//i,
        message: "Path must be start with '/'",
      },
    },
  });
  const { field: methodTypeField } = useController({
    control,
    name: "methodType",
  });

  const { value: methodType } = methodTypeField;

  const {
    field: { onChange: onChangeUrl, onBlur: onBlurUrl },
  } = useController({
    control,
    name: "methodUrl",
    rules: {
      required: methodType === "url" && "URL is required",
      pattern: {
        value:
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&=]*)/g,
        message: "Incorrect URL format",
      },
    },
  });
  const {
    field: { value: selectedReqMethod },
  } = useController({
    control,
    name: "selectedReqMethod",
  });

  const isInternalService = selectedService?.blockType === "table";

  const handleSelectReqMethod = React.useCallback(
    (method: Method) => {
      setValue("selectedReqMethod", method, { shouldTouch: true });
    },
    [setValue]
  );

  const handleClose = React.useCallback(() => {
    if (isLoading) {
      return;
    }

    onCloseModal();
  }, [isLoading, onCloseModal]);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Form>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
          }}
        >
          <Typography
            sx={{
              p: 2,
            }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Create New Method
          </Typography>
          <Divider />
          <Stack
            sx={{
              py: 2,
              px: 3,
            }}
            alignItems="stretch"
            spacing={2}
          >
            {isInternalService && (
              <FormControl component="fieldset">
                <RadioGroup {...methodTypeField} row>
                  <FormControlLabel
                    value="url"
                    control={<Radio />}
                    label="External URL"
                  />
                  <FormControlLabel
                    value="internal"
                    control={<Radio />}
                    label="Existing Method"
                  />
                </RadioGroup>
              </FormControl>
            )}
            {methodType === "url" && (
              <TextField
                size="small"
                label="Url"
                placeholder="e.g. https://jsonplaceholder.typicode.com"
                name="methodUrl"
                required
                inputRef={methodType === "url" ? setInputRef : undefined}
                helperText={!!errors.methodUrl && errors.methodUrl.message}
                error={!!errors.methodUrl}
                onChange={onChangeUrl}
                onBlur={onBlurUrl}
              />
            )}
            <TextField
              size="small"
              label="Path"
              placeholder="e.g. /posts"
              name="methodPath"
              required
              inputRef={methodType !== "url" ? setInputRef : undefined}
              defaultValue={methodPath}
              helperText={!!errors.methodPath && errors.methodPath.message}
              error={!!errors.methodPath}
              onChange={onChangePath}
              onBlur={onBlurPath}
            />
            <InputSelectMethod
              isInternal={methodType === "internal"}
              selectedMehod={selectedReqMethod}
              onChange={handleSelectReqMethod}
            />
          </Stack>
          <Divider />
          <Stack
            sx={{
              p: 2,
            }}
            justifyContent="flex-end"
            direction="row"
            spacing={2}
          >
            <Button disabled={isLoading} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              startIcon={
                isLoading && <CircularProgress size={12} color="inherit" />
              }
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Form>
    </Modal>
  );
});
