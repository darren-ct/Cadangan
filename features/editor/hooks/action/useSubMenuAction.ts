import { useQueries, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";

import { ExplorerParams } from "@/types";

import type {
  Action,
  CreateRecordActionProps,
  Draggable,
  DraggablePropsWithActions,
  EditorPage,
  MenuLink,
  NavLink,
} from "../..";
import {
  useActionsData,
  useEditorPageStore,
  useSubMenuGlobalEvent,
} from "../..";

export const useSubMenuAction = (
  item?: Draggable | EditorPage | NavLink | MenuLink
) => {
  const router = useRouter();
  const { editorPageId } = router.query as ExplorerParams;
  const { onGetTables, onGetFields } = useSubMenuGlobalEvent();

  const { pages } = useEditorPageStore();

  const { memoizedActionLocation } = useActionsData();

  const { data: rawTables } = useQuery(
    ["subMenuActionGetTables"],
    () => onGetTables(),
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const tables = React.useMemo(() => {
    if (!rawTables) return [];

    return rawTables.filter((table) => table.name !== "Roles");
  }, [rawTables]);

  const userTableId = React.useMemo(() => {
    return tables.find((table) => table.name === "Users")?.id;
  }, [tables]);

  const rawTableFields = useQueries({
    queries: (tables ?? []).map((table) => {
      return {
        queryKey: ["getForeignFields", table],
        queryFn: () => onGetFields(table),
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
      };
    }),
  });

  const tableFields = React.useMemo(() => {
    if (!rawTableFields) return [];

    return rawTableFields
      .filter((field) => !!field.data)
      .map((field) => field.data);
  }, [rawTableFields]);

  const createActions = React.useMemo(() => {
    let actions: Action[];

    // Actions Value
    switch (memoizedActionLocation) {
      case "PAGE":
      case "PROP":
        actions =
          ((item as Draggable | EditorPage)?.props as DraggablePropsWithActions)
            ?.actions ?? [];
        break;

      case "NAVLINK":
        actions = (item as NavLink)?.actions ?? [];
        break;
    }

    const filteredActions: Action[] = actions?.reduce(
      (prev: Action[], current: Action) => {
        if (
          current.type === "CREATE_RECORD" &&
          prev.findIndex(
            (item) =>
              (item.props as CreateRecordActionProps).table.id ===
              (current.props as CreateRecordActionProps).table.id
          ) === -1
        ) {
          return [...prev, current];
        }

        return prev;
      },
      []
    );

    return filteredActions ?? [];
  }, [item, memoizedActionLocation]);

  const handleLinkActions = React.useCallback((): Action[] => {
    let actions: Action[] = [];

    actions.push({
      id: "LINK-BACK",
      title: "New Screen",
      type: "LINK",
      subType: "NEW_PAGE",
    });

    actions.push({
      id: "LINK-BACK",
      title: "Back",
      type: "LINK",
      subType: "BACK",
    });

    actions = [
      ...actions,
      ...(pages
        .filter((page) => page.id !== editorPageId)
        .map((page) => ({
          id: `LINK-PAGE-${page.id}`,
          title: page.name,
          type: "LINK",
          subType: "PAGE",
          props: {
            page,
          },
        })) as Action[]),
    ];

    actions.push({
      id: "LINK-WEBSITE",
      title: "Website",
      type: "LINK",
      subType: "WEBSITE",
      props: {
        url: "",
      },
    });

    return actions;
  }, [pages, editorPageId]);

  const handleCreateActions = React.useCallback((): Action[] => {
    if (!tables) return [];

    return tables.map((table) => ({
      id: `CREATE-CREATE_RECORD-${table.id}-${table.name}`,
      title: table.name,
      type: "CREATE_RECORD",
      props: {
        table,
      },
    }));
  }, [tables]);

  const handleUpdateActions = React.useCallback((): Action[] => {
    if (!tables) return [];

    const updateLoggedInUserAction: Action = {
      id: "UPDATE-UPDATE_LOGGED_IN_USER",
      title: "Logged In User",
      type: "UPDATE_LOGGED_IN_USER",
      props: {
        tableId: userTableId,
        fields: {
          email: [],
          password: [],
          firstName: [],
          lastName: [],
          phoneNumber: [],
        },
      },
    };

    const updateTablesActions: Action[] = createActions.map((action) => ({
      id: `UPDATE-UPDATE_RECORD-${
        (action.props as CreateRecordActionProps).table.id
      }-${(action.props as CreateRecordActionProps).table.name}`,
      title: `New ${action.title}`,
      type: "UPDATE_RECORD",
      props: {
        table: (action.props as CreateRecordActionProps).table,
      },
    }));

    return [updateLoggedInUserAction, ...updateTablesActions];
  }, [createActions, tables, userTableId]);

  const handleDeleteActions = React.useCallback((): Action[] => {
    if (!tables) return [];

    const deleteLoggedInUserAction: Action = {
      id: "DELETE-DELETE_LOGGED_IN_USER",
      title: "Logged In User",
      type: "DELETE_LOGGED_IN_USER",
      props: {
        tableId: userTableId,
      },
    };

    const deleteTablesActions: Action[] = createActions.map((action) => ({
      id: `DELETE-DELETE_RECORD-${
        (action.props as CreateRecordActionProps).table.id
      }-${(action.props as CreateRecordActionProps).table.name}`,
      title: `New ${action.title}`,
      type: "DELETE_RECORD",
      props: {
        table: (action.props as CreateRecordActionProps).table,
      },
    }));

    return [deleteLoggedInUserAction, ...deleteTablesActions];
  }, [createActions, tables, userTableId]);

  const handleMoreActions = React.useCallback((): Action[] => {
    const loginAction: Action = {
      id: "LOGIN",
      title: "Login",
      type: "AUTH",
      subType: "AUTH_LOGIN",
      props: {
        fields: {
          email: [],
          password: [],
        },
      },
    };

    const signUpAction: Action = {
      id: "SIGNUP",
      title: "Signup",
      type: "AUTH",
      subType: "AUTH_SIGNUP",
      props: {
        fields: {
          email: [],
          password: [],
          firstName: [],
          lastName: [],
          phoneNumber: [],
        },
      },
    };

    const logOutAction: Action = {
      id: "LOGOUT",
      title: "Logout",
      type: "AUTH",
      subType: "AUTH_LOGOUT",
    };

    return [loginAction, logOutAction, signUpAction];
  }, []);

  const actions: Action[] = React.useMemo(() => {
    const linkActions: Action = {
      id: "LINK",
      title: "Link",
      type: "LINK",
      children: handleLinkActions(),
    };

    const createActions: Action = {
      id: "CREATE",
      title: "Create",
      type: "CREATE",
      children: handleCreateActions(),
    };

    const updateActions: Action = {
      id: "UPDATE",
      title: "Update",
      type: "UPDATE",
      children: handleUpdateActions(),
    };

    const deleteActions: Action = {
      id: "DELETE",
      title: "Delete",
      type: "DELETE",
      children: handleDeleteActions(),
    };

    const moreActions: Action = {
      id: "MORE",
      title: "More",
      type: "MORE",
      children: [
        {
          id: "MORE",
          type: "MORE",
          title: "User Login",
          children: handleMoreActions(),
        },
      ],
    };

    return [
      linkActions,
      createActions,
      updateActions,
      deleteActions,
      moreActions,
    ];
  }, [
    handleLinkActions,
    handleCreateActions,
    handleUpdateActions,
    handleDeleteActions,
    handleMoreActions,
  ]);

  return {
    tableFields,
    createActions,
    actions,
    handleLinkActions,
    handleCreateActions,
    handleUpdateActions,
    handleDeleteActions,
    userTableId,
  };
};
