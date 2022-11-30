import { ChartData } from "chart.js";

import {
  ClassicSubProps,
  Draggable,
  DraggableProps,
  DraggableTypes,
  FormProps,
  FormTodoAction,
  LayoutItem,
  MagicTextSubLink,
  MenuLink,
  NavLink,
  NavProps,
  SideMenuProps,
  TextProps,
  UserRecordFields,
} from "../types";

// Lists
export const widgetList: Record<DraggableTypes, DraggableProps | undefined> = {
  button: undefined,
  text: undefined,
  form: undefined,
  table: undefined,
  nav: undefined,
  textInput: undefined,
  chart: undefined,
  container: undefined,
  filter: undefined,
  sideMenu: undefined,
  tabContainer: undefined,
};

export const todoActionList: Record<string, FormTodoAction[]> = {
  USER_COLLECTION: [
    {
      label: "Log the User In",
      value: "AUTH_LOGIN",
    },
    {
      label: "Sign the User Up",
      value: "AUTH_SIGNUP",
    },
  ],
  REGULAR_COLLECTION: [
    {
      label: "Create new record",
      value: "CREATE_RECORD",
    },
  ],
};

// Font-Related
export const fontTypes = ["Title", "Subtitle", "Body"];
export const fontWeights = [
  "Light",
  "Normal",
  "Medium",
  "Semi Bold",
  "Bold",
  "Extra Bold",
  "Extra Black",
];
export const fontAlignments = ["Left", "Center", "Right"];

// MagicText SubLinks-Related
export const magicTextLinks: MagicTextSubLink[] = [
  {
    title: "Logged In User's",
    icon: "Arrow",
    sublinks: [
      {
        id: "USER-EMAIL",
        title: "Email",
        icon: "Text",
      },
      {
        id: "USER-FIRST_NAME",
        title: "First Name",
        icon: "Text",
      },
      { id: "USER-LAST_NAME", title: "Last Name", icon: "Text" },
    ],
  },
  {
    title: "Date & Time",
    icon: "Arrow",
    isBorderTopped: true,
    sublinks: [
      {
        id: "DATE_TIME-NONE",
        title: "None",
        icon: "Date",
      },
      {
        id: "DATE_TIME-CURRENT_TIME",
        title: "Current Time",
        icon: "Date",
      },
      {
        id: "DATE_TIME-START_OF_TODAY",
        title: "Start of Today",
        icon: "Date",
      },
      {
        title: "More",
        icon: "Arrow",
        isBorderTopped: true,
        sublinks: [
          {
            id: "DATE_TIME-1_YEAR_AGO",
            title: "1 year ago",
            icon: "Date",
          },
        ],
      },
    ],
  },
  {
    title: "Other Components",
    icon: "Arrow",
    isBorderTopped: true,
    sublinks: [],
  },
];

export const magicNumberTextLinks: MagicTextSubLink[] = [
  {
    title: "Logged In User's",
    icon: "Arrow",
    sublinks: [],
  },
  {
    title: "Date & Time",
    icon: "Arrow",
    isBorderTopped: true,
    sublinks: [
      {
        id: "DATE_TIME-NONE",
        title: "None",
        icon: "Date",
      },
      {
        id: "DATE_TIME-CURRENT_TIME",
        title: "Current Time",
        icon: "Date",
      },
      {
        id: "DATE_TIME-START_OF_TODAY",
        title: "Start of Today",
        icon: "Date",
      },
      {
        title: "More",
        icon: "Arrow",
        isBorderTopped: true,
        sublinks: [
          {
            id: "DATE_TIME-1_YEAR_AGO",
            title: "1 year ago",
            icon: "Date",
          },
        ],
      },
    ],
  },
  {
    title: "Other Components",
    icon: "Arrow",
    isBorderTopped: true,
    sublinks: [],
  },
];

export const magicTextFieldsOption: string[] = [
  "SUM",
  "AVERAGE",
  "MINIMUM",
  "MAXIMUM",
  "MIN_MAX",
];

// Actions-Related
export const loggedInUserDefaultProps: UserRecordFields = {
  email: [],
  password: [],
  firstName: [],
  lastName: [],
  phoneNumber: [],
};

// Chart-Related
export const chartPlaceholderData: ChartData = {
  labels: ["January", "February", "March", "April"],
  datasets: [
    {
      label: "Month",
      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)"],
      borderWidth: 1,
      data: [13, 16, 18, 50],
    },
  ],
};

export const chartMultiColorLabelPlaceholderData: ChartData = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      fill: true,
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const chartTypes: string[] = [
  "bar",
  "doughnut",
  "pie",
  "polarArea",
  "radar",
];

export const chartTypesTitle: Record<string, string> = {
  bar: "Bar",
  doughnut: "Doughnut",
  pie: "Pie",
  polarArea: "Polar",
  radar: "Radar",
};

//Default Layout & Draggable Related
export const dummyLayout: LayoutItem = {
  i: "DUMMY_DRAGGABLE",
  x: 0,
  y: 200,
  w: 24,
  h: 1,
  isResizable: false,
  isDraggable: false,
  item: null,
};

export const dummyContainerLayout: LayoutItem = {
  i: "DUMMY_DRAGGABLE",
  x: 0,
  y: 48,
  w: 48,
  h: 1,
  isResizable: false,
  isDraggable: false,
  item: null,
};

export const dummyArticleLayouts: LayoutItem[] = [
  { i: "0", x: 5, y: 2, w: 6, h: 2 },
  { i: "1", x: 5, y: 4, w: 12, h: 20 },
];

export const dummyNavLayout: LayoutItem = {
  i: "0",
  x: 0,
  y: 0,
  w: 24,
  h: 3,
};

export const dummyFormLayout: LayoutItem = {
  i: "0",
  x: 5,
  y: 7,
  w: 14,
  h: 20,
};

export const dummyArticleDraggables: Draggable[] = [
  {
    id: "0",
    name: "title",
    type: "text",
    props: {
      type: "Title",
      textAlign: "center",
      fontSize: 24,
      content: [
        {
          id: String(Date.now()),
          type: "CLASSIC",
          subProps: {
            text: "Title",
          },
        },
      ],
    } as TextProps,
  },
  {
    id: "1",
    name: "content",
    type: "text",
    props: {
      content: [
        {
          id: String(Date.now()),
          type: "CLASSIC",
          subProps: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut justo nisl, vehicula et convallis sit amet, convallis ac massa. Proin placerat nisl eget nibh tristique dictum. Suspendisse egestas leo a ante dapibus egestas. Vestibulum bibendum, metus tincidunt dapibus euismod, lectus elit ultricies augue, id rhoncus augue quam in massa. Duis euismod arcu mauris, non sollicitudin lorem varius nec. Maecenas aliquet mauris vitae odio elementum, quis blandit augue varius. Nulla facilisi. Phasellus in volutpat elit, porta sagittis lorem. Maecenas pretium eu tellus non dictum. Nulla ut nisi tincidunt, viverra nulla et, pellentesque erat. ",
          },
        },
      ],
    } as TextProps,
  },
];

export const dummyNavDraggable: Draggable = {
  id: "0",
  name: "Nav 1",
  type: "nav",
};

export const dummyFormDraggable: Draggable = {
  id: "0",
  name: "Form 1",
  type: "form",
  props: {
    table: null,
    formTodo: { label: "", value: "AUTH_LOGIN" },
    includes: [],
    submitBtnProps: {
      isPositionFixed: false,
      text: "",
    },
    actions: [],
  } as FormProps,
};

// Default Value Related
export const dummyNavProps: NavProps = {
  type: "classic",
  navLogo: {
    id: String(Date.now()),
    iconName: "polymer",
    text: [
      {
        id: String(Date.now()),
        type: "CLASSIC",
        subProps: {
          text: "My Brand",
        } as ClassicSubProps,
      },
    ],
    subProps: {
      color: "black",
    },
  },
  linkColor: "black",
  backgroundColor: "white",
  paddingX: 40,
  paddingY: 12,
  linkSpacing: 36,
  linkIconSpacing: 2,
};

export const dummyNavLink: NavLink = {
  id: Date.now().toString(),
  text: [
    {
      id: String(Date.now()),
      type: "CLASSIC",
      subProps: {
        text: "New Link",
      },
    },
  ],
  iconName: "",
  links: [],
  actions: [],
  isButton: false,
};

export const dummyMenuProps: SideMenuProps = {
  backgroundColor: "white",
  linkIconSpacing: 2,
  headerLinks: [
    {
      id: String(Date.now()),
      iconName: "polymer",
      text: [
        {
          id: String(Date.now()),
          type: "CLASSIC",
          subProps: { text: "My Brand" } as ClassicSubProps,
        },
      ],
    },
  ],
  links: [
    {
      id: String(Date.now() + 1),
      text: [
        {
          id: String(Date.now()),
          type: "CLASSIC",
          subProps: { text: "Dashboard" } as ClassicSubProps,
        },
      ],
    },
    {
      id: String(Date.now() + 2),
      text: [
        {
          id: String(Date.now()),
          type: "CLASSIC",
          subProps: { text: "My Account" } as ClassicSubProps,
        },
      ],
    },
  ],
};

export const dummyMenuLink: MenuLink = {
  id: Date.now().toString(),
  text: [
    {
      id: String(Date.now()),
      type: "CLASSIC",
      subProps: {
        text: "New Link",
      },
    },
  ],
  iconName: "",
  links: [],
  actions: [],
  isButton: false,
};
