import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";

import type {
  Action,
  Draggable,
  FormProps,
  FormTodoAction,
} from "@/features/editor";
import {
  todoActionList,
  useEditorDraggableStore,
  useSubMenuGlobalEvent,
} from "@/features/editor";
import { getSDK } from "@/lib";
import type { DatabasesParams, SDKClient } from "@/types";
import { useGetTable } from "@/widgets/api";
import { useDisclose } from "@/widgets/hooks";
import { Field, FormSubmitButtonProps, Table } from "@/widgets/types";

interface Props {
  item: Draggable;
}

export const useFormSubMenu = ({ item }: Props) => {
  const router = useRouter();
  const { databaseId: dbId } = router.query as DatabasesParams;
  const { setDraggables, updateDraggable, updateDraggableProps } =
    useEditorDraggableStore();

  const { onGetFields } = useSubMenuGlobalEvent();

  // Item Props
  const currentProps = React.useMemo(() => {
    if (item.props) {
      return item.props as FormProps;
    }

    return null;
  }, [item]);

  const formTodo = React.useMemo(
    () => currentProps?.formTodo,
    [currentProps?.formTodo]
  );

  const table = React.useMemo(() => currentProps?.table, [currentProps?.table]);

  const sdk = React.useCallback((): void | Promise<SDKClient> => {
    if (!dbId) {
      return;
    }

    return getSDK({ projectId: dbId });
  }, [dbId]);

  // Get Collections & Fields
  const { data: tables } = useGetTable({
    getTables: async () => {
      const connector = await sdk();

      if (!connector) {
        return;
      }

      const { data, error } = await connector.table.find();

      if (error) throw new Error(error.message);

      return data as Table[];
    },
  });

  const isFieldsEnabled = !!currentProps?.table;

  useQuery(["getFieldsFormSubMenu", table], () => onGetFields(table), {
    enabled: isFieldsEnabled,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onSuccess: (fields) => {
      let inputProps = currentProps;

      let newFields = fields.map((field) => ({
        ...field,
        label: field.name,
        placeholder: `Enter your ${field.name}`,
      }));

      if (table?.name === "Users") {
        if (["AUTH_LOGIN", "AUTH_SIGNUP"].includes(formTodo?.value)) {
          newFields = newFields.filter(
            (item) => !["role", "isEmailVerified"].includes(item?.name)
          );
        }
        if (formTodo?.value === "AUTH_LOGIN") {
          setExcludedFields(
            newFields.filter(
              (item) => !["email", "password"].includes(item.name)
            )
          );
          newFields = newFields.filter((item) =>
            ["email", "password"].includes(item.name)
          );
        }
      }

      inputProps = { ...inputProps, includes: newFields };

      updateDraggable(item.id, { props: inputProps });
    },
    refetchOnMount: false,
  });

  // States
  const { isOpen: isFormOpen, onToggle: toggleForm } = useDisclose(false);
  const { isOpen: isFieldsOpen, onToggle: toggleFields } = useDisclose(false);
  const { isOpen: isExcludedOpen, onToggle: toggleExcluded } =
    useDisclose(false);
  const { isOpen: isButtonOpen, onToggle: toggleButton } = useDisclose(false);
  const { isOpen: isActionsOpen, onToggle: toggleActions } = useDisclose(false);

  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [excludedFields, setExcludedFields] = React.useState<Field[]>([]);

  const [actionAnchorEl, setActionAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const getFormTodoAction = React.useCallback((name: string) => {
    if (name === "Users") return todoActionList["USER_COLLECTION"];

    return todoActionList["REGULAR_COLLECTION"];
  }, []);

  const memoizedFormTodoAction = React.useMemo(() => {
    if (!currentProps?.table) return [];

    return getFormTodoAction(currentProps?.table?.name);
  }, [currentProps, getFormTodoAction]);

  // Functions
  const getField = React.useCallback(
    (id: string) => {
      return currentProps?.includes?.filter((include) => include.id === id)[0];
    },
    [currentProps?.includes]
  );

  const changeActive = React.useCallback(
    (id: string) => {
      if (id !== activeTab) {
        return setActiveTab(id);
      }

      setActiveTab(null);
    },
    [activeTab, setActiveTab]
  );

  const handleChangeButtonTitle = React.useCallback(
    (newValue: string) => {
      updateDraggableProps(item.id, "submitBtnProps", {
        isPositionFixed: false,
        text: newValue,
      } as FormSubmitButtonProps);
    },
    [item.id, updateDraggableProps]
  );

  const handleExcludeField = React.useCallback(
    (field: Field) => {
      setExcludedFields((prev) => [...prev, field]);

      setDraggables((prev) => {
        const newDraggables = prev.map((draggable) => {
          if (draggable.id === item.id) {
            return {
              ...draggable,
              props: {
                ...draggable.props,
                includes: (draggable.props as FormProps)?.includes.filter(
                  (subItem) => subItem.id !== field.id
                ),
              },
            };
          } else {
            return draggable;
          }
        });

        return newDraggables;
      });
    },
    [item.id, setDraggables]
  );

  const handleIncludeField = React.useCallback(
    (field: Field) => {
      setExcludedFields((prev) => prev.filter((item) => item.id !== field.id));

      setDraggables((prev) => {
        const newDraggables = prev.map((draggable) => {
          if (draggable.id === item.id) {
            return {
              ...draggable,
              props: {
                ...draggable.props,
                includes: [...(draggable.props as FormProps).includes, field],
              },
            };
          } else {
            return draggable;
          }
        });

        return newDraggables;
      });
    },
    [item.id, setDraggables]
  );

  const handleTableSelect = React.useCallback(
    (table: Table) => {
      let inputProps = currentProps;

      const formTodo = getFormTodoAction(table.name)[0];

      inputProps = {
        ...inputProps,
        table,
        formTodo,
        submitBtnProps: {
          isPositionFixed: false,
          text: table.name !== "Users" ? `Create New ${table.name}` : `Login`,
        },
        actions: [
          {
            id: String(Date.now()),
            title: table.name === "Users" ? "Log In" : "Create",
            type: formTodo.value === "AUTH_LOGIN" ? "AUTH" : formTodo.value,
            subType: formTodo.value === "AUTH_LOGIN" ? "AUTH_LOGIN" : undefined,
            isDefault: true,
            props: { table },
          },
        ],
      };

      updateDraggable(item.id, { props: inputProps });
    },
    [updateDraggable, currentProps, item.id, getFormTodoAction]
  );

  const handleFieldUpdate = React.useCallback(
    (field: Field) => {
      let inputProps = currentProps;

      const newIncludes = (inputProps.includes ?? []).map((item) => {
        if (item.id !== field.id) return item;

        return {
          ...item,
          ...field,
        };
      });

      inputProps = { ...inputProps, includes: newIncludes };

      updateDraggable(item.id, { props: inputProps });
    },
    [item, updateDraggable, currentProps]
  );

  const handleFormTodoSelect = React.useCallback(
    (formTodo: FormTodoAction) => {
      let inputProps = currentProps;

      let includes = inputProps?.includes || [];

      const actions: Action[] = [];

      if (formTodo?.value === "AUTH_LOGIN") {
        setExcludedFields(
          includes.filter((item) => !["email", "password"].includes(item.name))
        );

        includes = includes.filter((item) =>
          ["email", "password"].includes(item.name)
        );

        actions.push({
          id: `AUTH-AUTH_LOGIN-${String(Date.now())}`,
          title: "Log In",
          type: "AUTH",
          subType: "AUTH_LOGIN",
          isDefault: true,
          props: { table },
        });
      }

      if (formTodo?.value === "AUTH_SIGNUP") {
        includes = [...includes, ...excludedFields];

        actions.push({
          id: `AUTH-AUTH_SIGNUP-${String(Date.now())}`,
          title: "Sign Up",
          type: "AUTH",
          subType: "AUTH_SIGNUP",
          isDefault: true,
          props: { table },
        });
      }

      inputProps = {
        ...inputProps,
        submitBtnProps: {
          isPositionFixed: false,
          text: formTodo?.value === "AUTH_SIGNUP" ? "Sign up" : "Login",
        },
        formTodo,
        includes,
        actions,
      };

      updateDraggable(item.id, { props: inputProps });
    },
    [currentProps, updateDraggable, item.id, table, excludedFields]
  );

  const handleOpenAction = React.useCallback((anchorEl: HTMLElement) => {
    setActionAnchorEl(anchorEl);
  }, []);

  const handleCloseAction = React.useCallback(() => {
    setActionAnchorEl(null);
  }, []);

  return {
    currentProps,
    tables,
    getField,
    isFormOpen,
    toggleForm,
    isFieldsOpen,
    toggleFields,
    isExcludedOpen,
    toggleExcluded,
    isButtonOpen,
    toggleButton,
    isActionsOpen,
    toggleActions,
    activeTab,
    changeActive,
    setActiveTab,
    excludedFields,
    handleExcludeField,
    handleIncludeField,
    handleChangeButtonTitle,
    setDraggables,
    handleTableSelect,
    handleFieldUpdate,
    actionAnchorEl,
    handleCloseAction,
    handleOpenAction,
    memoizedFormTodoAction,
    handleFormTodoSelect,
  };
};
