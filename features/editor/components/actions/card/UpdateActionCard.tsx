import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import type {
  ActionCardProps,
  ClassicSubProps,
  CreateRecordActionProps,
  Draggable,
} from "@/features/editor";
import {
  ExpandableCard,
  Form,
  loggedInUserDefaultProps,
  useDraggableUpdateAction,
} from "@/features/editor";

import { FormFields } from "./helpers/FormFields";

export const UpdateActionCard = React.memo(function UpdateActionCard({
  bgColor,
  action,
  onDelete,
  onUpdate,
  createActions,
  item,
  userTableId,
}: ActionCardProps) {
  const {
    pickedTable,
    actionFields,
    dataSource,
    form,
    setForm,
    isOpen,
    onToggle,
    onSelectItem,
    onRemoveAction,
    handleUpdateFieldsSubmit,
    onSubmitUserFields,
  } = useDraggableUpdateAction({
    action,
    handleActionUpdate: onUpdate,
    handleActionDelete: onDelete,
    createActions,
    userTableId,
  });

  const onChangeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: [
          {
            id: Date.now().toString(),
            type: "CLASSIC",
            subProps: {
              text: e.target.value,
            },
          },
        ],
      }));
    },
    [setForm]
  );

  return (
    <ExpandableCard
      backgroundColor={bgColor}
      active={isOpen}
      title="Update"
      subTitle={action.title}
      onClick={onToggle}
      onRemove={() => onRemoveAction(action.id)}
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        <FormControl fullWidth sx={{ marginTop: 1 }}>
          <InputLabel id="collection-label">Collection</InputLabel>
          <Select
            size="small"
            labelId="collection-label"
            id="collection-label"
            value={pickedTable ? JSON.stringify(pickedTable) : "LOGGED_IN_USER"}
            label="Collection"
            onChange={(e) => onSelectItem(e.target.value)}
            sx={{ fontSize: "12px" }}
          >
            <MenuItem value="LOGGED_IN_USER" sx={{ fontSize: "12px" }}>
              Logged In User
            </MenuItem>
            {createActions?.map((actionItem) => (
              <MenuItem
                key={actionItem.id}
                value={JSON.stringify(
                  (actionItem.props as CreateRecordActionProps).table
                )}
                sx={{ fontSize: "12px" }}
              >
                {"New " + actionItem.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            marginY: "16px",
            width: "100%",
            height: "1px",
            background: "rgba(0,0,0,.2)",
          }}
        ></Box>
        {action.type !== "UPDATE_LOGGED_IN_USER" && (
          <Form
            item={item as Draggable}
            onSubmit={handleUpdateFieldsSubmit}
            buttonText="Done"
            fields={actionFields}
            foreignFields={dataSource.foreignFields}
            onGetForeignRecords={dataSource.onGetForeignRecords}
            onRowChange={dataSource.onRowChange}
            onUploadAttachment={dataSource.onUploadAttachment}
          />
        )}
        {action.type === "UPDATE_LOGGED_IN_USER" && (
          <Stack direction="column" spacing={1}>
            {Object.keys(loggedInUserDefaultProps)
              .filter(
                (field) => field !== "password" && field !== "phoneNumber"
              )
              .map((field) => (
                <FormFields
                  item={item as Draggable}
                  field={field}
                  form={form}
                  setForm={setForm}
                />
              ))}

            <Stack>
              <Typography sx={{ marginBottom: "2px", fontSize: "12px" }}>
                Password
              </Typography>
              <TextField
                name="password"
                placeholder="Enter new text"
                size="small"
                variant="standard"
                type="password"
                onChange={onChangeHandler}
                value={
                  form.password?.length !== 0
                    ? (form.password[0].subProps as ClassicSubProps).text
                    : ""
                }
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  paddingX: 1,
                  paddingY: 0.6,
                  backgroundColor: "white",
                  fontSize: "12px",
                }}
              />
            </Stack>

            <Stack>
              <Typography sx={{ marginBottom: "2px", fontSize: "12px" }}>
                Phone Number
              </Typography>
              <TextField
                name="phoneNumber"
                placeholder="Enter new text"
                size="small"
                variant="standard"
                type="text"
                onChange={onChangeHandler}
                value={
                  form.phoneNumber?.length !== 0
                    ? (form.phoneNumber[0].subProps as ClassicSubProps).text
                    : ""
                }
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  paddingX: 1,
                  paddingY: 0.6,
                  marginBottom: 3,
                  backgroundColor: "white",
                }}
              />
            </Stack>

            <Button
              size="small"
              onClick={onSubmitUserFields}
              variant="contained"
              sx={{ fontSize: "12px" }}
            >
              Done
            </Button>
          </Stack>
        )}
      </Stack>
    </ExpandableCard>
  );
});
