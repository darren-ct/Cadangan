/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiResponse,
  Block,
  Database,
  Field,
  FieldType,
  Method,
  SelectOption,
} from "@/types";

export interface InputType {
  stringInput: FieldType[];
  numberInput: FieldType[];
  unsupportedInput: FieldType[];
  automatedInput: FieldType[];
}

export interface Condition {
  id: string;
  name:
    | "equal"
    | "not equal"
    | "contains"
    | "not contains"
    | "include"
    | "not include"
    | "greater than"
    | "greater than equal"
    | "lower than"
    | "lower than equal";
  qs?: string;
}

export interface SortCondition {
  id: string;
  name: "ascending" | "descending";
}

export interface SortParam {
  key: string;
  value: number;
}

export interface Pagination {
  skip: number;
  limit: number;
}

export interface ModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export interface FormApi {
  externalUrl: string;
  serviceName: string;
  selectedService: Block;
  selectedDatabase: Database;
}

export interface FormMethod {
  methodType: "url" | "function" | "internal";
  methodPath: string;
  methodUrl: string;
  selectedMethod: Method;
  selectedReqMethod: Method;
  selectedService: Block;
}

export interface MethodService {
  methodId: string;
  serviceId: string;
}

export type TryServiceType = "simple" | "advanced";

export interface TryServiceMode {
  id: TryServiceType;
  name: string;
}

export interface TryServiceModeProps {
  database?: Database;
  service: Block;
  method: Method;
}

export interface TryServiceProps {
  database?: Database;
  activeService?: Block;
  services: Block[];
  handleSelectActiveService: (service?: Block) => void;
}

export interface TryServiceParam {
  key: string;
  value: string | SelectOption | Date | string[] | SelectOption[];
  qs?: string;
}

export type QueryFieldType = "lookup" | "select";
export type DateTimeMode = "date" | "datetime";

export interface FormTryServiceAdvanced {
  headers: TryServiceParam[];
  advancedParams: TryServiceParam[];
  body: any;
  advancedBody: string;
}

export interface TryServiceAdvancedStates {
  id: string;
  apiResponse: ApiResponse | null;
  formData: FormTryServiceAdvanced;
}

export interface FormTryServiceSimple {
  params: TryServiceParam[];
  selectedFields: Field[];
  selectedConditions: Condition[];
  selectedLinkRecordBody: any;
  selectedLinkRecordBodyPrimary: any;
  body: any;
  sorts: SortParam[];
  selectedSortFields: Field[];
  selectedSortConditions: SortCondition[];
  pagination: Pagination;
  lookups: Field[];
  selects: Field[];
  selectedLinkRecordParams: any[];
  selectedLinkRecordParamsPrimary: any[];
}

export interface TryServiceSimpleStates {
  id: string;
  apiResponse: ApiResponse | null;
  formData: FormTryServiceSimple;
  selectedLinkFieldName: string;
}

export interface AttachmentResponse {
  fileName: string;
  url: string;
}

export type LookupOption = "all" | "id";
export interface ListProps {
  index?: number;
}

export interface ListQueryFieldsProps extends ListProps {
  item: Field;
}
