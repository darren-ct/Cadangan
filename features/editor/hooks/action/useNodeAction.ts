import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";

import { addRecord, deleteRecord, updateRecord } from "@/api";
import { usePreviewPageStore, User } from "@/features/preview";
import { ExplorerParams, Row, WidgetChangeEvent } from "@/widgets/types";

import {
  Action,
  CreateRecordActionProps,
  DeleteLoggedInUserActionProps,
  DeleteRecordActionProps,
  Draggable,
  LinkActionProps,
  LoginActionProps,
  NewRecordSubProps,
  SharedMutateRecordActionProps,
  SignUpActionProps,
  TableItemProps,
  TextContent,
  UpdateLoggedInUserActionProps,
  UpdateRecordActionProps,
} from "../../types";
import { useMagicResult } from "../index";
import { useEditorDraggableStore } from "../useEditorDraggableStore";
import { useSubMenuGlobalEvent } from "../useSubMenuGlobalEvent";

interface Props {
  actions: Action[];
  item?: Draggable;
}
export const useNodeAction = ({ actions, item }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { databaseId } = router.query as ExplorerParams;

  const { onRowChange } = useSubMenuGlobalEvent();
  const { findDraggableByType, updateDraggableProps } =
    useEditorDraggableStore();
  const { setLoggedUser, loggedUser } = usePreviewPageStore((state) => state);
  const { getCombinedString } = useMagicResult();

  // STATES
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isCreated, setIsCreated] = React.useState<boolean>(false);

  // MEMOS
  const dependentActions = React.useMemo(() => {
    return (
      actions?.filter((action) => {
        if (
          action.type === "DELETE_RECORD" ||
          action.type === "UPDATE_RECORD"
        ) {
          return true;
        } else {
          return false;
        }
      }) ?? []
    );
  }, [actions]);

  const isPreviewMode = React.useMemo(
    () => router.route.includes("/databases/[databaseId]/preview"),
    [router.route]
  );

  // FUNCTIONS
  // Link related
  const handleEqualOperator = React.useCallback(
    (action: Action) => {
      const props = action?.props as LinkActionProps;

      switch (action?.advancedProps?.type) {
        case "LOGGED_IN_USER":
          if (!action?.advancedProps?.value && loggedUser) return;

          router.push(`/databases/${databaseId}/preview/${props?.page?.id}`);

          break;

        default:
          break;
      }
    },
    [loggedUser, router, databaseId]
  );

  const handleLinkAction = React.useCallback(
    async (action: Action) => {
      try {
        const props = action?.props as LinkActionProps;

        if (action?.subType === "PAGE") {
          if (action?.isAdvanced) {
            switch (action?.advancedProps?.operator) {
              case "equal":
                handleEqualOperator(action);
                break;

              default:
                break;
            }
            return;
          }

          router.push(
            `/databases/${databaseId}/${isPreviewMode ? "preview" : "editor"}/${
              props?.page?.id
            }`
          );
        }

        if (action?.subType === "WEBSITE") {
          window.open(props?.url);
        }

        if (action?.subType === "BACK") {
          router.back();
        }
      } catch (error) {
        console.trace("handleLinkAction err", error);
      }
    },
    [router, databaseId, isPreviewMode, handleEqualOperator]
  );

  const handleLinkWithParam = React.useCallback(
    async (action: Action) => {
      const params = action.params;

      const extensionArr = await Promise.all(
        params.map(async (param, index) => {
          const pair = await Promise.all([
            await getCombinedString(param.key),
            await getCombinedString(param.value),
          ]);

          const key = pair[0];
          const value = pair[1];

          return `${key}=${value}${index !== params.length - 1 ? "&" : ""}`;
        })
      );

      const extension = extensionArr.join("");

      return {
        result: {
          action: {
            ...action,
            props: {
              page: {
                ...(action.props as LinkActionProps).page,
                id: (action.props as LinkActionProps).page.id + "?" + extension,
              },
            } as LinkActionProps,
          },
        },
      };
    },
    [getCombinedString]
  );

  // Record related
  const handleUpdateRelatedActions = React.useCallback(
    (recordId: string, tableId: string) => {
      const newActions: Action[] = [];

      actions.forEach((action) => {
        const currentAction = action;

        // Only record types need to be checked
        if (
          currentAction.type !== "CREATE_RECORD" &&
          currentAction.type !== "UPDATE_RECORD" &&
          currentAction.type !== "DELETE_RECORD"
        ) {
          newActions.push(currentAction);
          return;
        }

        // Start to check
        const currentActionProps =
          currentAction.props as SharedMutateRecordActionProps;

        // UPDATE RECORD ID
        if (currentActionProps.table.id === tableId) {
          (currentAction.props as SharedMutateRecordActionProps).recordId =
            recordId;
        }

        if (currentAction.type === "DELETE_RECORD") {
          newActions.push(currentAction);
          return;
        }

        // UPDATE REQUIRED FIELDS
        const fieldsArray = Object.entries(currentActionProps.fields);

        fieldsArray.forEach((fieldArray) => {
          const textContents = fieldArray[1] as TextContent[];

          if (!Array.isArray(textContents)) {
            return;
          }

          textContents.forEach((textContent) => {
            if (
              textContent.type === "NEW_RECORD" &&
              (textContent.subProps as NewRecordSubProps).tableId === tableId
            ) {
              (textContent.subProps as NewRecordSubProps).recordId = recordId;
            }
          });

          (currentAction.props as SharedMutateRecordActionProps).fields[
            fieldArray[0]
          ] = textContents;
        });

        newActions.push(currentAction);
      });

      updateDraggableProps(item?.id, "actions", newActions);
    },
    [actions, item?.id, updateDraggableProps]
  );

  const handleRawMutateRecordAction = React.useCallback(
    async (body: Row, action: Action) => {
      try {
        const table = (action.props as SharedMutateRecordActionProps)?.table;

        const data = await onRowChange(table, {
          body,
          event: action.type as unknown as WidgetChangeEvent,
        });

        const tableDraggables = findDraggableByType("table").filter(
          (item) => (item.props as TableItemProps)?.table?.id === table.id
        );

        tableDraggables.forEach((table) => {
          queryClient.invalidateQueries([`getInfiniteRecords-${table.id}`]);
        });

        return { result: { action, data } };
      } catch (error) {
        return { result: null, error: error.message };
      }
    },
    [onRowChange, findDraggableByType, queryClient]
  );

  const handleCreateRecordAction = React.useCallback(
    async (action: Action) => {
      // Table
      const tableId = (action.props as CreateRecordActionProps).table.id;

      // Get string value
      const output = {};
      const records = (action.props as CreateRecordActionProps).fields;

      if (!records) return {};

      const recordsPairArray: [string, unknown][] = Object.entries(records);

      try {
        await Promise.all(
          recordsPairArray.map(async (recordPairArray) => {
            const textContents = recordPairArray[1] as TextContent[];

            // IF EMPTY
            if (!textContents || textContents.length === 0) {
              return;
            }

            // If value singular, not textContents
            if (!Array.isArray(textContents)) {
              output[recordPairArray[0]] = textContents;
              return;
            }

            const combinedTextContents = await getCombinedString(textContents);

            // OR NUMBERED THE LAST VALUE AFTER JOINED HERE
            output[recordPairArray[0]] = combinedTextContents;
          })
        );

        // ADD RECORD
        const data = await addRecord({
          dbId: databaseId,
          tableId,
          variables: {
            body: output,
          },
        });

        const recordId = data._id;
        handleUpdateRelatedActions(recordId, tableId);

        // Return
        return { result: { action, data } };
      } catch (err) {
        console.log(err);
      }
    },
    [databaseId, getCombinedString, handleUpdateRelatedActions]
  );

  const handleUpdateRecordAction = React.useCallback(
    async (action: Action) => {
      const toBeUpdatedRecordId: string = (
        action.props as UpdateRecordActionProps
      ).recordId;

      if (!toBeUpdatedRecordId) {
        return;
      }

      // Table
      const tableId = (action.props as CreateRecordActionProps).table.id;

      // Get string value
      const output = {};
      const records = (action.props as CreateRecordActionProps).fields;
      if (!records) return {};

      const recordsPairArray: [string, unknown][] = Object.entries(records);
      try {
        // Loop
        await Promise.all(
          recordsPairArray.map(async (recordPairArray) => {
            const textContents = recordPairArray[1] as TextContent[];

            // IF EMPTY
            if (!textContents || textContents.length === 0) {
              return;
            }

            // IF SINGULAR VALUE
            if (
              !Array.isArray(textContents) ||
              (textContents.length !== 0 && !textContents[0].subProps)
            ) {
              output[recordPairArray[0]] = textContents;
              return;
            }

            const combinedTextContents = await getCombinedString(textContents);

            output[recordPairArray[0]] = combinedTextContents;
          })
        );

        // UPDATE RECORD
        await updateRecord({
          dbId: databaseId,
          tableId,
          variables: {
            id: toBeUpdatedRecordId,
            body: output,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [databaseId, getCombinedString]
  );

  const handleDeleteRecordAction = React.useCallback(
    async (action: Action) => {
      const toBeDeletedRecordId: string = (
        action.props as DeleteRecordActionProps
      ).recordId;

      if (!toBeDeletedRecordId) {
        return;
      }

      // Table
      const tableId = (action.props as DeleteRecordActionProps).table.id;

      // Delete
      try {
        await deleteRecord({
          dbId: databaseId,
          tableId,
          variables: {
            ids: [toBeDeletedRecordId],
          },
        });
      } catch (err) {
        console.log(err.message);
      }
    },
    [databaseId]
  );

  // Logged-in User related
  const handleUpdateLoggedInUser = React.useCallback(
    async (action: Action) => {
      if (!loggedUser) {
        return;
      }

      const body = (action.props as UpdateLoggedInUserActionProps).fields;

      const newBody = {};

      // Looping
      const keyValuePairsArray = Object.entries(body);

      try {
        await Promise.all(
          keyValuePairsArray.map(async (keyValuePair) => {
            const key = keyValuePair[0];
            const values = keyValuePair[1];

            // IF EMPTY
            if (!values || values.length === 0) {
              return;
            }

            const textContentValues = await getCombinedString(values);
            newBody[key] = textContentValues;

            return [key, textContentValues];
          })
        );

        // Update
        const data = await updateRecord({
          dbId: databaseId,
          tableId: (action.props as UpdateLoggedInUserActionProps).tableId,
          variables: {
            id: loggedUser._id,
            body: newBody as unknown as Partial<Row>,
          },
        });

        return { result: { action, data } };
      } catch (err) {
        console.log(err);
      }
    },
    [databaseId, getCombinedString, loggedUser]
  );

  const handleDeleteLoggedInUser = React.useCallback(
    async (action: Action) => {
      if (!loggedUser) {
        return;
      }

      const userTableId = (action.props as DeleteLoggedInUserActionProps)
        .tableId;

      try {
        const data = await deleteRecord({
          dbId: databaseId,
          tableId: userTableId,
          variables: {
            ids: [loggedUser._id],
          },
        });

        return { result: { action, data } };
      } catch (err) {
        console.log(err);
      }
    },
    [databaseId, loggedUser]
  );

  // Auth Related
  const handleRawAuthAction = React.useCallback(
    async (body: Row, action: Action) => {
      try {
        const table = (action.props as SharedMutateRecordActionProps)?.table;

        const data = await onRowChange(table, {
          body,
          event: action.subType as unknown as WidgetChangeEvent,
        });

        return {
          result: {
            action,
            data,
          },
        };
      } catch (error) {
        console.log(error);
        return { result: null, error: error.message };
      }
    },
    [onRowChange]
  );

  const handleAuthAction = React.useCallback(
    async (action: Action) => {
      const fields = (action.props as SignUpActionProps | LoginActionProps)
        .fields;
      const newFields = {};

      // Looping
      const keyValuePairsArray = Object.entries(fields);

      try {
        await Promise.all(
          keyValuePairsArray.map(async (keyValuePair) => {
            const key = keyValuePair[0];
            const values = keyValuePair[1];

            // IF EMPTY
            if (!values || values.length === 0) {
              return;
            }

            const textContentValues = await getCombinedString(values);
            newFields[key] = textContentValues;

            return [key, textContentValues];
          })
        );

        return { _id: undefined, ...newFields };
      } catch (err) {
        console.log(err);
      }
    },
    [getCombinedString]
  );

  // Final function
  const handleSubmit = React.useCallback(
    async (values?: Row) => {
      setLoading(true);

      try {
        let body: Row = values;

        const actionValues = await Promise.all(
          actions.map(async (action) => {
            switch (action.type) {
              case "AUTH":
                if (action.subType === "AUTH_LOGOUT")
                  return { result: { action, data: undefined } };

                if (!body) {
                  body = await handleAuthAction(action);
                }

                return await handleRawAuthAction(body, action);

              case "CREATE_RECORD":
                if (!body) return await handleCreateRecordAction(action);
                return await handleRawMutateRecordAction(body, action);

                break;

              case "UPDATE_LOGGED_IN_USER":
                return await handleUpdateLoggedInUser(action);
                break;

              case "DELETE_LOGGED_IN_USER":
                return await handleDeleteLoggedInUser(action);
                break;

              case "LINK":
                if (!action.params || action.params.length === 0) {
                  return { result: { action } };
                }

                return await handleLinkWithParam(action);
            }
          })
        );

        actionValues.forEach((item) => {
          switch ((item.result.action as Action)?.type) {
            case "LINK":
              handleLinkAction(item.result.action);
              break;
            case "AUTH":
            case "AUTH_LOGIN":
            case "AUTH_SIGNUP":
              setLoggedUser(item.result.data as User);
              break;
          }
        });
      } catch (error) {
        console.trace("form item handleSubmit err", error);
      } finally {
        setLoading(false);
        setIsCreated(true);
      }
    },
    [
      actions,
      handleRawAuthAction,
      handleCreateRecordAction,
      handleRawMutateRecordAction,
      handleUpdateLoggedInUser,
      handleDeleteLoggedInUser,
      handleLinkWithParam,
      handleAuthAction,
      handleLinkAction,
      setLoggedUser,
    ]
  );

  // useEffect
  React.useEffect(() => {
    if (isCreated && dependentActions.length !== 0) {
      dependentActions.forEach((action) => {
        switch (action.type) {
          case "DELETE_RECORD":
            console.log("Deleted");
            handleDeleteRecordAction(action);
            break;

          case "UPDATE_RECORD":
            console.log("Updated");
            handleUpdateRecordAction(action);
            break;
        }
      });

      setIsCreated(false);
    }
  }, [
    dependentActions,
    handleDeleteRecordAction,
    handleUpdateRecordAction,
    isCreated,
  ]);

  return { loading, handleSubmit, handleLinkAction };
};
