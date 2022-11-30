import { Row } from "@/types";
import { Table } from "@/widgets/types";

import { Draggable, NavLink } from "./draggables";
import { TextContent } from "./magicText";
import { EditorPage } from "./page";

// LOCATION
export type ActionLocation = "NONE" | "PROP" | "NAVLINK" | "PAGE";

// TYPES & SUBTYPES
export type ActionTypes =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CREATE_RECORD"
  | "UPDATE_RECORD"
  | "DELETE_RECORD"
  | "LOGGED_IN_USER"
  | "UPDATE_LOGGED_IN_USER"
  | "DELETE_LOGGED_IN_USER"
  | "AUTH"
  | "AUTH_LOGIN"
  | "AUTH_SIGNUP"
  | "AUTH_LOGOUT"
  | "LINK"
  | "MORE";

export type AdvancedActionTypes = "LOGGED_IN_USER" | "LOGGED_IN_USER_FIELD";

export type LinkActionSubTypes = "BACK" | "NEW_PAGE" | "PAGE" | "WEBSITE";
export type AuthActionSubTypes = "AUTH_LOGIN" | "AUTH_SIGNUP" | "AUTH_LOGOUT";

export type AdvancedActionOperator =
  | "equal"
  | "notEqual"
  | "contains"
  | "notContains"
  | null;

// PROPS
// Link
export interface LinkActionProps {
  url?: string;
  page?: EditorPage;
}

// Login & Signup
export interface UserRecordFields {
  email: TextContent[];
  password: TextContent[];
  firstName: TextContent[];
  lastName: TextContent[];
  phoneNumber: TextContent[];
}

export interface LoginActionProps {
  fields: Partial<UserRecordFields>;
}

export interface SignUpActionProps {
  fields: UserRecordFields;
}

// Update-Logged-In-User
export interface UpdateLoggedInUserActionProps {
  tableId: string;
  fields: UserRecordFields;
}

// Delete-Logged-In-User
export interface DeleteLoggedInUserActionProps {
  tableId: string;
}

// Mutate-Record
export interface SharedMutateRecordActionProps {
  recordId?: string;
  table: Table;
  fields?: Partial<Row> | Row | null;
}

export type CreateRecordActionProps = SharedMutateRecordActionProps;
export type UpdateRecordActionProps = SharedMutateRecordActionProps;

export interface DeleteRecordActionProps {
  recordId?: string;
  table?: Table;
  isLoggedInUser?: boolean;
}

// ADVANCED & NOT ADVANCED
export interface AdvancedActionRecordFieldValue {
  id: string;
  field: string;
  table: Table;
  value: unknown;
}

export interface AdvancedActionLoggedUserFieldValue {
  id: string;
  field: string;
  value: unknown;
}

export type AdvancedActionOperatorList = {
  label: string;
  value: AdvancedActionOperator;
};

export interface AdvancedActionProps {
  id: string;
  type: AdvancedActionTypes;
  operator: AdvancedActionOperator;
  value:
    | AdvancedActionRecordFieldValue
    | AdvancedActionLoggedUserFieldValue
    | null;
  title: string;
}

export type Param = {
  id: string;
  key: TextContent[];
  value: TextContent[];
};

export type StringifiedParam = {
  id: string;
  key: string;
  value: string;
};

export type ActionProps =
  | LinkActionProps
  | CreateRecordActionProps
  | UpdateRecordActionProps
  | UpdateLoggedInUserActionProps
  | DeleteLoggedInUserActionProps
  | DeleteRecordActionProps
  | LoginActionProps
  | SignUpActionProps;

export type Action = {
  id: string;
  title: string;
  children?: Action[];
  icon?: string;
  type: ActionTypes;
  subType?: LinkActionSubTypes | AuthActionSubTypes;
  isDefault?: boolean;
  props?: ActionProps;
  isAdvanced?: boolean;
  advancedProps?: AdvancedActionProps;
  params?: Param[];
};

// ACTION CARD
export interface ActionCardProps {
  bgColor?: string;
  action: Action;
  createActions?: Action[];
  item?: Draggable | EditorPage | NavLink;
  userTableId?: string;
  onUpdate?: (id: string, newAction: Action) => unknown;
  onDelete?: (id: string) => unknown;
  updateNavLinkProps?: (name: string, body: unknown) => void;
}
