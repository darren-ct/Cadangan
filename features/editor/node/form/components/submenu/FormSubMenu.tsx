import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { AddIcon } from "@/assets/icons";
import type { Draggable } from "@/features/editor";
import {
  ActionCard,
  ActionPopup,
  SelectCollections,
  SubMenuSection,
  useDraggableAction,
  useSubMenuAction,
} from "@/features/editor";

import { useFormSubMenu } from "../../hooks";
import { FormFields } from "./FormFields";
import { SelectFormTodo } from "./FormTodo";

interface Props {
  item: Draggable;
}

export const FormSubMenu = React.memo(function FormSubMenu({ item }: Props) {
  const {
    actionAnchorEl,
    activeTab,
    changeActive,
    currentProps,
    excludedFields,
    handleChangeButtonTitle,
    handleCloseAction,
    handleExcludeField,
    handleFieldUpdate,
    handleFormTodoSelect,
    handleIncludeField,
    handleTableSelect,
    handleOpenAction,
    isFormOpen,
    isFieldsOpen,
    isExcludedOpen,
    isButtonOpen,
    memoizedFormTodoAction,
    toggleButton,
    toggleExcluded,
    toggleFields,
    toggleForm,
  } = useFormSubMenu({ item });

  const { actions: subMenuActions } = useSubMenuAction(item);
  const { handleActionSelect } = useDraggableAction({ item });

  return (
    <Stack direction="column">
      {/* Form drawer */}
      <SubMenuSection title="Form" isOpen={isFormOpen} onToggle={toggleForm}>
        {/* Choose collections */}
        <SelectCollections
          value={currentProps?.table}
          onSelect={handleTableSelect}
        />
        {currentProps?.table && (
          <SelectFormTodo
            actions={memoizedFormTodoAction}
            value={currentProps?.formTodo}
            onSelect={handleFormTodoSelect}
          />
        )}
      </SubMenuSection>

      {/* Others */}
      {currentProps && (
        <React.Fragment>
          {/* Fields drawer */}
          <SubMenuSection
            title="Fields"
            isOpen={isFieldsOpen}
            onToggle={toggleFields}
          >
            <FormFields
              activeField={activeTab}
              includes={currentProps?.includes}
              excludes={excludedFields}
              isAddVisibleFieldOpen={isExcludedOpen}
              onAddField={handleIncludeField}
              onRemoveField={handleExcludeField}
              onAddVisibleFieldToggle={toggleExcluded}
              onFieldChangeSubmit={handleFieldUpdate}
              onSelectField={changeActive}
            />
          </SubMenuSection>

          <SubMenuSection
            title="Submit Button"
            isOpen={isButtonOpen}
            onToggle={toggleButton}
          >
            {/* Buttons options */}
            <Stack direction="column" spacing={3}>
              <Stack spacing={0.25}>
                {/* Text */}
                <Typography
                  sx={(theme) => ({
                    paddingLeft: "6px",
                    fontWeight: 500,
                    fontSize: theme.typography.fontSize,
                    color: "#828282",
                  })}
                >
                  Text
                </Typography>
                <TextField
                  size="small"
                  placeholder="Enter your text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeButtonTitle(e.target.value)
                  }
                  value={currentProps?.submitBtnProps?.text ?? ""}
                  inputProps={{ style: { fontSize: 12 } }}
                />
              </Stack>

              {/* Actions */}
              <Stack position="relative">
                <Typography
                  sx={(theme) => ({
                    paddingLeft: "6px",
                    marginBottom: "12px",
                    fontWeight: 500,
                    fontSize: theme.typography.fontSize,
                    color: "#828282",
                  })}
                >
                  Click Actions
                </Typography>
                {currentProps?.actions?.map((action) => (
                  <ActionCard key={action.id} action={action} item={item} />
                ))}
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={(theme) => ({
                    color: " #130F40",
                    marginTop: 1,
                    fontSize: theme.typography.fontSize,
                  })}
                  onClick={(e) =>
                    handleOpenAction(e.currentTarget as HTMLElement)
                  }
                >
                  ADD ACTION
                </Button>

                <ActionPopup
                  actions={subMenuActions}
                  anchorEl={actionAnchorEl}
                  onClose={handleCloseAction}
                  onCloseAll={handleCloseAction}
                  onSelect={handleActionSelect}
                />
              </Stack>
            </Stack>
          </SubMenuSection>
        </React.Fragment>
      )}
    </Stack>
  );
});
