import { useQueries, useQuery } from "@tanstack/react-query";
import * as React from "react";

import {
  ClassicSubProps,
  CreateRecordActionProps,
  Draggable,
  MagicTextSubLink,
  MenuLink,
  NavLink,
} from "../../types";
import { magicTextFieldsOption } from "../../utils";
import {
  useEditorDraggableStore,
  useEditorPageStore,
  UseEditorPageStoreState,
  useSubMenuAction,
  useSubMenuGlobalEvent,
} from "../index";

export const useMagicTextAction = (item?: Draggable | NavLink | MenuLink) => {
  const { draggables } = useEditorDraggableStore();
  const { pages, activePage } = useEditorPageStore() as UseEditorPageStoreState;

  const { onGetTables, onGetForeignFields } = useSubMenuGlobalEvent();
  const { createActions } = useSubMenuAction(item);

  const { data: rawTables } = useQuery(
    ["subMenuActionGetTables"],
    () => onGetTables(),
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const tables = React.useMemo(() => {
    if (!rawTables) return [];

    return rawTables.filter((table) => table.name !== "Roles");
  }, [rawTables]);

  const rawTableFields = useQueries({
    queries: (tables ?? []).map((table) => {
      return {
        queryKey: ["magicTextForeignFields", table],
        queryFn: () => onGetForeignFields(table),
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
      };
    }),
  });

  const activePageData = React.useMemo(() => {
    return pages.find((page) => page.id === activePage);
  }, [activePage, pages]);

  const pageParams = React.useMemo(() => {
    return activePageData?.props?.params ?? [];
  }, [activePageData?.props?.params]);

  // Memos
  const tableFields = React.useMemo(() => {
    if (!rawTableFields) return [];

    return rawTableFields
      .filter((field) => !!field.data)
      .map((field) => field.data);
  }, [rawTableFields]);

  // Callback
  const handleOtherComponentActions = React.useCallback(() => {
    if (!draggables) return [];

    const textInputDraggables = draggables.filter(
      (item) => item.type === "textInput"
    );

    return textInputDraggables.map((item) => ({
      id: `OTHER_COMPONENTS-${item.name}-${item.id}`,
      title: item.name,
      icon: "Text",
    }));
  }, [draggables]);

  const handleTableActions = React.useCallback(() => {
    if (!tables) return [];

    return tables.map((table, index) => {
      const sublinks: MagicTextSubLink[] = [];
      const countSubLink: MagicTextSubLink = {
        id: `TABLE-COUNT-${table.id}`,
        title: "Count",
        icon: "Number",
      };

      const foreignField = tableFields.find(
        (item) => item.table.id === table.id
      );

      if (!foreignField) {
        sublinks.push(countSubLink);
      }

      if (foreignField) {
        const filteredFields =
          foreignField.fields?.filter(
            (field) =>
              field.type === "number" ||
              field.type === "currency" ||
              field.type === "percent"
          ) ?? [];

        const fieldSublinks: MagicTextSubLink[] = filteredFields.map(
          (field) => ({
            id: field.id,
            title: field.name,
            icon: "Arrow",
            sublinks: magicTextFieldsOption.map((option) => ({
              id: `FIELD-${option}-${table.id}-${field.id}`,
              title: option,
              icon: "Number",
            })),
          })
        );

        sublinks.push(...fieldSublinks, countSubLink);
      }

      return {
        id: table.id,
        title: table.name,
        icon: "Arrow",
        isBorderTopped: index === 0,
        sublinks,
      };
    });
  }, [tables, tableFields]);

  const handleNewRecordActions = React.useCallback(() => {
    return createActions.map((createAction) => {
      // Find fields that match table id
      const foreignField = tableFields.find(
        (item) =>
          item.table.id ===
          (createAction.props as CreateRecordActionProps).table.id
      );

      const filteredFields =
        foreignField?.fields.filter((field) => field.name !== "Roles") ??
        undefined;

      // Make sublinks
      const fieldSublinks = !filteredFields
        ? undefined
        : filteredFields.map((field) => ({
            id: `NEW_RECORD-${
              (createAction.props as CreateRecordActionProps).table.id
            }-${(createAction.props as CreateRecordActionProps).recordId}-${
              field.name
            }`,
            title: field.name,
          }));

      return {
        title: `New ${createAction.title}`,
        icon: "Arrow",
        sublinks: fieldSublinks,
      };
    });
  }, [createActions, tableFields]);

  const actions = React.useMemo(() => {
    const loggedInUserActions: MagicTextSubLink = {
      title: "Logged In User's",
      icon: "Arrow",
      sublinks: [
        {
          id: "USER-EMAIL",
          title: "Email",
          icon: "Text",
        },
        {
          id: "USER-FIRST_NAME",
          title: "First Name",
          icon: "Text",
        },
        { id: "USER-LAST_NAME", title: "Last Name", icon: "Text" },
        { id: "USER-PHONE_NUMBER", title: "Phone Number", icon: "Text" },
      ],
    };

    const ParamsActions: MagicTextSubLink = {
      title: "Page Params",
      icon: "Arrow",
      sublinks: pageParams.map((param) => ({
        id: `PARAM-${(param.key[0].subProps as ClassicSubProps).text}`,
        title: (param.key[0].subProps as ClassicSubProps).text as string,
        icon: "Key",
      })),
    };

    const newRecordActions: MagicTextSubLink[] = item
      ? handleNewRecordActions()
      : [];

    const dateTimeActions: MagicTextSubLink = {
      title: "Date & Time",
      icon: "Arrow",
      isBorderTopped: true,
      sublinks: [
        {
          id: "DATE_TIME-NONE",
          title: "None",
          icon: "Date",
        },
        {
          id: "DATE_TIME-CURRENT_TIME",
          title: "Current Time",
          icon: "Date",
        },
        {
          id: "DATE_TIME-START_OF_TODAY",
          title: "Start of Today",
          icon: "Date",
        },
        {
          title: "More",
          icon: "Arrow",
          isBorderTopped: true,
          sublinks: [
            {
              id: "DATE_TIME-1_YEAR_AGO",
              title: "1 year ago",
              icon: "Date",
            },
          ],
        },
      ],
    };

    const otherComponentActions: MagicTextSubLink = {
      title: "Other Components",
      icon: "Arrow",
      isBorderTopped: true,
      sublinks: handleOtherComponentActions(),
    };

    const tableActions: MagicTextSubLink[] = handleTableActions();

    return [
      loggedInUserActions,
      ParamsActions,
      ...newRecordActions,
      dateTimeActions,
      otherComponentActions,
      ...tableActions,
    ];
  }, [
    handleNewRecordActions,
    handleOtherComponentActions,
    handleTableActions,
    item,
    pageParams,
  ]);

  return { actions };
};
