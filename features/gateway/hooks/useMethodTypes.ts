import { blue, green, orange, purple, red } from "@mui/material/colors";

import type { Method } from "@/types";

const methods: Method[] = [
  {
    id: "find",
    label: "GET",
    name: "Find Records",
    bgColor: blue[500],
    color: "white",
    type: "find",
  },
  {
    id: "get",
    label: "GET",
    name: "Get Record",
    bgColor: blue[500],
    color: "white",
    type: "get",
  },
  {
    id: "count",
    label: "GET",
    name: "Count Records",
    bgColor: blue[500],
    color: "white",
    type: "count",
  },
  {
    id: "create",
    label: "POST",
    name: "Create Record",
    bgColor: green[500],
    color: "white",
    type: "create",
  },
  {
    id: "update-patch",
    label: "PATCH",
    name: "Update Record",
    bgColor: orange[500],
    color: "black",
    type: "update",
  },
  {
    id: "delete",
    label: "DELETE",
    name: "Delete Record",
    bgColor: red[500],
    color: "white",
    type: "delete",
  },
  {
    id: "link",
    label: "LINK",
    name: "Link Record",
    bgColor: purple[500],
    color: "white",
    type: "link",
  },
  {
    id: "unlink",
    label: "UNLINK",
    name: "Unlink Record",
    bgColor: purple[500],
    color: "white",
    type: "unlink",
  },
];
const customMethods: Method[] = [
  {
    id: "find",
    label: "GET",
    name: "Get info about the REST API",
    bgColor: blue[500],
    color: "white",
    type: "find",
  },
  {
    id: "create",
    label: "POST",
    name: "Create a REST API",
    bgColor: green[500],
    color: "white",
    type: "create",
  },
  {
    id: "update-put",
    label: "PUT",
    name: "Update a REST API",
    bgColor: orange[500],
    color: "black",
    type: "update",
  },
  {
    id: "update-patch",
    label: "PATCH",
    name: "Update a REST API",
    bgColor: orange[500],
    color: "black",
    type: "update",
  },
  {
    id: "delete",
    label: "DELETE",
    name: "Delete a REST API",
    bgColor: red[500],
    color: "white",
    type: "delete",
  },
];

export const useMethodTypes = () => {
  return { customMethods, methods };
};
