import { RoleType } from "@/types";

export type SchemeType = "http" | "ws";

export interface FormAuthorization {
  selectedRoleId: RoleType;
  selectedServiceId: string;
}

export interface Role {
  id: RoleType;
  name: string;
}

export interface Scheme {
  id: SchemeType;
  name: string;
}
