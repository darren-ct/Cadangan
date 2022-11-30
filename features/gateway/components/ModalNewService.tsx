import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { Form } from "@/components/Elements";
import { useFocusableInput } from "@/hooks/useFocusableInput";
import { Database } from "@/types";

import { FormApi } from "../types";

interface Props {
  databases: Database[];
  isLoading: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormApi) => void;
}

export const ModalNewService = React.memo(function ModalNewService({
  // databases,
  isLoading,
  open,
  onClose,
  onSubmit,
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    // setValue,
  } = useFormContext<FormApi>();
  const { setInputRef } = useFocusableInput(open);
  const {
    field: { onChange: onChangeName, onBlur: onBlurName },
  } = useController({
    control,
    name: "serviceName",
    rules: {
      required: "Name is required",
      pattern: {
        value: /^(?!.*\b(authentication|storage|roles|users)\b).*/i,
        message:
          "This name already reserved by system. Create a private service to view all system generated services.",
      },
    },
  });

  // const apiType = useWatch({ control, name: "apiType" });

  // const {
  //   field: { onChange: onChangeExternalUrl, onBlur: onBlurExternalUrl },
  // } = useController({
  //   control,
  //   name: "externalUrl",
  //   rules: {
  //     required: apiType === "external" ? "External URL is required" : undefined,
  //   },
  // });

  // const { field: serviceFactorField } = useController({
  //   control,
  //   name: "serviceFactor",
  // });

  // const selectedDatabase = useWatch({ control, name: "selectedDatabase" });

  // const handleSelectDatabase = React.useCallback(
  //   (event: SelectChangeEvent<string>) => {
  //     const database = databases.find((item) => item.id === event.target.value);
  //     setValue("selectedDatabase", database, { shouldTouch: true });
  //   },
  //   [databases, setValue]
  // );

  const handleClose = React.useCallback(() => {
    if (isLoading) {
      return;
    }

    onClose();
  }, [isLoading, onClose]);

  return (
    <Modal
      open={open}
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
            Create New Custom Service
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
            <TextField
              size="small"
              label="Name"
              placeholder="e.g. Movies"
              name="serviceName"
              inputRef={setInputRef}
              required
              helperText={!!errors.serviceName && errors.serviceName.message}
              error={!!errors.serviceName}
              onChange={onChangeName}
              onBlur={onBlurName}
            />
            {/* <FormControl component="fieldset">
              <RadioGroup {...serviceFactorField} row>
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Private"
                />
                {/* <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="Custom"
                /> 
              </RadioGroup>
            </FormControl> */}
            {/* <FormControl component="fieldset">
              <FormLabel>API type</FormLabel>
              <RadioGroup {...apiTypeField} row>
                <FormControlLabel
                  value="database"
                  control={<Radio />}
                  label="Database"
                />
                {/* <FormControlLabel
                  value="function"
                  control={<Radio />}
                  label="Functions"
                /> 
                <FormControlLabel
                  value="external"
                  control={<Radio />}
                  label="Custom"
                />
              </RadioGroup>
            </FormControl> */}
            {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                value={selectedDatabase?.id ?? ""}
                onChange={handleSelectDatabase}
              >
                {databases.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            {/* {apiType === "external" && (
              <TextField
                size="small"
                label="Extarnal Url"
                placeholder="e.g. jsonplaceholder.typicode.com"
                required={apiType === "external"}
                name="externalUrl"
                helperText={!!errors.apiType && errors.apiType.message}
                error={!!errors.apiType}
                onChange={onChangeExternalUrl}
                onBlur={onBlurExternalUrl}
              />
            )} */}
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
            <Button disabled={isLoading} onClick={onClose}>
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
