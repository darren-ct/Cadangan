import * as React from "react";

import {
  Action,
  AdvancedActionOperator,
  AdvancedActionOperatorList,
  AdvancedActionProps,
} from "../../types";

interface Props {
  action: Action;
  handleActionUpdate: (id: string, action: Action) => unknown;
}

export const useMenuAdvancedAction = ({
  action,
  handleActionUpdate,
}: Props) => {
  const [conditionAnchorEl, setConditionAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const conditionActions: Action[] = React.useMemo(() => {
    const arr: Action[] = [];

    arr.push({
      id: String(Date.now()),
      type: "LOGGED_IN_USER",
      title: "Logged User",
      advancedProps: {
        id: String(Date.now()),
        operator: "equal",
        value: null,
        type: "LOGGED_IN_USER",
        title: "Logged User",
      },
    });

    return arr;
  }, []);

  const currentAdvancedProps: AdvancedActionProps = React.useMemo(
    () => action?.advancedProps,
    [action]
  );

  const operatorActions: AdvancedActionOperatorList[] = React.useMemo(() => {
    if (!currentAdvancedProps) return [];

    const arr: AdvancedActionOperatorList[] = [];

    switch (currentAdvancedProps.type) {
      case "LOGGED_IN_USER":
      case "LOGGED_IN_USER_FIELD":
        arr.push(
          { label: "Equal", value: "equal" },
          { label: "Not Equal", value: "notEqual" }
        );

        break;

      default:
        return [];
    }

    return arr;
  }, [currentAdvancedProps]);

  const handleOpenCondition = React.useCallback((anchorEl: HTMLElement) => {
    setConditionAnchorEl(anchorEl);
  }, []);

  const handleCloseCondition = React.useCallback(() => {
    setConditionAnchorEl(null);
  }, []);

  const handleConditionSelect = React.useCallback(
    (newAction: Action) => {
      handleActionUpdate(action.id, {
        ...action,
        advancedProps: newAction.advancedProps,
      });
    },
    [action, handleActionUpdate]
  );

  const handleOperatorSelect = React.useCallback(
    (operator: AdvancedActionOperator) => {
      const newAdvancedProps: AdvancedActionProps = {
        ...currentAdvancedProps,
        operator,
      };

      handleActionUpdate(action.id, {
        ...action,
        advancedProps: newAdvancedProps,
      });
    },
    [action, currentAdvancedProps, handleActionUpdate]
  );

  return {
    conditionActions,
    conditionAnchorEl,
    handleCloseCondition,
    handleOpenCondition,
    handleConditionSelect,
    handleOperatorSelect,
    currentAdvancedProps,
    operatorActions,
  };
};
