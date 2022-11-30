import * as React from "react";

import type {
  Action,
  LoginActionProps,
  SignUpActionProps,
  UserRecordFields,
} from "@/features/editor";
import { useDisclose } from "@/hooks";

interface Props {
  action: Action;
  handleActionUpdate: (id: string, action: Action) => unknown;
  handleActionDelete: (id: string) => unknown;
}

export const useDraggableAuthAction = ({
  action,
  handleActionUpdate,
  handleActionDelete,
}: Props) => {
  const [form, setForm] = React.useState<
    UserRecordFields | Partial<UserRecordFields> | null
  >((action.props as LoginActionProps | SignUpActionProps)?.fields);

  const { isOpen, onToggle } = useDisclose();

  //   Functions
  const onRemoveAction = React.useCallback(
    (id: string) => {
      handleActionDelete(id);
    },
    [handleActionDelete]
  );

  const onSubmitAction = React.useCallback(() => {
    const newAction: Action = {
      ...action,
      props: { ...action.props, fields: form },
    };

    handleActionUpdate(action.id, newAction);
    onToggle();
  }, [action, form, handleActionUpdate, onToggle]);

  return {
    form,
    setForm,
    isOpen,
    onToggle,
    onRemoveAction,
    onSubmitAction,
  };
};
