import { Action, Param } from "./actions";

export type PageStylingProps = {
  maxWidth: number;
  height: number;
  backgroundColor: string;
};

export interface EditorPageProps {
  stylingProps?: PageStylingProps;
  actions?: Action[];
  params?: Param[];
}

export interface EditorPage {
  id: string;
  name: string;
  props?: EditorPageProps;
}
