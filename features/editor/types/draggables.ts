import { ChartTypeRegistry } from "chart.js";

import {
  Field,
  FormSubmitButtonProps,
  Table,
  ToolbarFilterValue,
  ToolbarGroupValue,
  ToolbarHiddenFieldsValue,
  ToolbarSortValue,
} from "@/widgets/types";

import { Action, ActionTypes } from "./actions";
import { DefaultLayouts } from "./layouts";
import { TextContent } from "./magicText";
import { EditorPage } from "./page";

// Nav
export type NavTypes = "classic" | "search";

export interface NavLinkButtonProps {
  buttonType: "contained" | "outlined";
  buttonColor?: string;
  borderRadius?: number;
  isShadow?: boolean;
  isUppercase?: boolean;
}

export interface NavLinkAnimationProps {
  transition: number;
  animationType: string;
}

export interface NavLinkSubProps {
  color?: string;
  labelPosition?: "left-right" | "right-left" | "top-bottom";
  iconSize?: number;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderlined?: boolean;
}

export interface NavLink {
  id: string;
  text?: TextContent[];
  iconName?: string;
  isImage?: boolean;
  imageSrc?: string;
  isButton?: boolean;
  buttonProps?: NavLinkButtonProps;
  subProps?: NavLinkSubProps;
  animationProps?: NavLinkAnimationProps;
  links?: NavLink[];
  actions?: Action[];
  onEdit?: boolean;
}

// SideMenu
export interface MenuLinkButtonProps {
  buttonType: "contained" | "outlined";
  buttonColor?: string;
  borderRadius?: number;
  isShadow?: boolean;
  isUppercase?: boolean;
}

export interface MenuLinkSubProps {
  color?: string;
  labelPosition?: "left-right" | "right-left" | "top-bottom";
  iconSize?: number;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderlined?: boolean;
}

export interface MenuLink {
  id: string;
  text?: TextContent[];
  iconName?: string;
  isImage?: boolean;
  imageSrc?: string;
  isButton?: boolean;
  buttonProps?: MenuLinkButtonProps;
  subProps?: MenuLinkSubProps;
  links?: MenuLink[];
  actions?: Action[];
  onEdit?: boolean;
}

// tabContainer
export interface TabLink {
  id: string;
  iconName?: string;
  text?: TextContent[];
  defaultLayouts?: DefaultLayouts;
}

export type TabContainerStylingProps = {
  color?: string;
  activeColor?: string;
  fontSize?: string;
  iconSize?: string;
  linkSpacing?: number;
};

// Form
export type FormTodoAction = { label: string; value: ActionTypes };

//////////////////////////////////////////

// PROPS
export interface ButtonProps {
  type: string;
  content: TextContent[];
  icon: string | null;
  buttonColor: string;
  contentColor?: string;
  rounding: number;
  isShadow: boolean;
  isUppercase: boolean;
  actions: Action[] | null;
}

export interface ContainerProps {
  defaultLayouts: DefaultLayouts;
}

export interface TabContainerProps {
  tabLinks: TabLink[];
  stylingProps?: TabContainerStylingProps;
}

export interface TextProps {
  content: TextContent[];
  type: "Title" | "Subtitle" | "Body";
  fontWeight: string;
  textAlign: string;
  fontSize: number;
  color: string;
  actions: Action[] | null;
}

export interface FormProps {
  table: Table | null;
  formTodo: FormTodoAction;
  includes: Field[];
  submitBtnProps: FormSubmitButtonProps;
  actions: Action[];
}

export interface NavProps {
  type: NavTypes;
  navLogo: NavLink;
  isSticky?: boolean;
  linkColor: string;
  backgroundColor: string;
  paddingX: number;
  paddingY: number;
  linkSpacing: number;
  linkIconSpacing: number;
  links?: NavLink[];
}

export interface SideMenuProps {
  backgroundColor: string;
  linkColor?: string;
  paddingY?: number;

  linkPaddingX?: number;
  linkPaddingY?: number;
  linkIconSpacing?: number;

  listIcon?: string;

  headerLinks?: MenuLink[];
  links?: MenuLink[];
}

export interface TableItemProps {
  id: string;
  table: Table;
  filter?: ToolbarFilterValue[];
  sort?: ToolbarSortValue[];
  group?: ToolbarGroupValue[];
  hiddenFields?: ToolbarHiddenFieldsValue[];
}

export interface FormItemProps {
  table: Table;
}

export interface TextInputProps {
  type: "NORMAL" | "LOWERCASE" | "PASSWORD" | "EMAIL" | "NUMBER";
  placeholder: string;
  defaultValue: TextContent[];
  value: string;
}

export interface ChartAxis {
  id: string;
  type?: "bar" | "line";
  field?: Field;
  colors?: string[];
  label?: string;
}

export type ChartAxisContents = "field" | "color" | "displayAs";

export interface ChartItemAxisProps {
  x: ChartAxis;
  y: ChartAxis[];
}

export interface ChartItemProps {
  type: keyof ChartTypeRegistry;
  table?: Table;
  title?: string;
  axis?: ChartItemAxisProps;
}

export interface KanbanProps {
  table: Table;
  filter?: ToolbarFilterValue[];
  sort?: ToolbarSortValue[];
  group?: ToolbarGroupValue[];
  hiddenFields?: ToolbarHiddenFieldsValue[];
  stackingField?: Field;
}

export type DraggableTypes =
  | "button"
  | "text"
  | "table"
  | "form"
  | "nav"
  | "sideMenu"
  | "textInput"
  | "chart"
  | "container"
  | "filter"
  | "tabContainer"
  | "kanban";

export type DraggableProps =
  | ButtonProps
  | ContainerProps
  | TabContainerProps
  | TextProps
  | FormProps
  | TableItemProps
  | NavProps
  | SideMenuProps
  | TextInputProps
  | ChartItemProps
  | KanbanProps;

export type DraggablePropsWithActions = ButtonProps | TextProps | FormProps;

// Draggable
export interface Draggable {
  id: string;
  type: DraggableTypes;
  name: string;
  props?: DraggableProps | DraggablePropsWithActions;
  isHidden?: boolean;
  containerId?: string;
}

export interface SharedSubMenuProps {
  onRemove?: () => void;
  item?: Draggable;
  onRemovePage?: () => void;
  page?: EditorPage;
}
