import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import * as React from "react";

import { ExplorerParams } from "@/types";
import { useDisclose } from "@/widgets/hooks";

import {
  dummyArticleDraggables,
  dummyArticleLayouts,
  dummyFormDraggable,
  dummyFormLayout,
  dummyLayout,
  dummyNavDraggable,
  dummyNavLayout,
  useDraggableStore,
  UseDraggableStoreState,
  useEditorPageStore,
  UseEditorPageStoreState,
  useEditorView,
  useSubMenuGlobalEvent,
} from "..";
import { DraggableTypes, FormProps } from "../types";

export const useSidebarView = () => {
  const router = useRouter();

  const { databaseId, editorPageId } = router.query as ExplorerParams;
  const { onGetTables, onGetFields } = useSubMenuGlobalEvent();

  // Fetching
  const { data: tables } = useQuery(["getTables"], () => onGetTables(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const userTable = React.useMemo(() => {
    return tables?.find((table) => table.name === "Users");
  }, [tables]);

  const { data: userFields } = useQuery(
    ["getUserFields", userTable],
    () => onGetFields(userTable),
    { refetchOnMount: false, refetchOnWindowFocus: false, enabled: !!userTable }
  );

  const loginFields = React.useMemo(() => {
    return userFields?.filter((field) => {
      if (field.name === "email" || field.name === "password") {
        return true;
      }

      return false;
    });
  }, [userFields]);

  // Hooks
  const { setDefaultLayouts, setDraggables } =
    useDraggableStore() as UseDraggableStoreState;
  const { draggables, handleActiveDraggableChange, setActiveId, activeId } =
    useEditorView();

  const { pages, createPage } = useEditorPageStore() as UseEditorPageStoreState;

  const { isOpen: isPagesOpen, onToggle: togglePage } = useDisclose(true);
  const { isOpen: isWidgetsOpen, onToggle: toggleWidget } = useDisclose(true);

  // State & Memos
  const [pickedPageId, setPickedPageId] = React.useState<string>("");
  const pickedPage = React.useMemo(() => {
    return pages.find((page) => page.id === pickedPageId);
  }, [pages, pickedPageId]);

  const widgets: DraggableTypes[] = React.useMemo(() => {
    return [
      "button",
      "form",
      "text",
      "table",
      "nav",
      "sideMenu",
      "textInput",
      "chart",
      "container",
      "tabContainer",
      "filter",
      "kanban",
    ];
  }, []);

  const pageTypes: string[] = React.useMemo(() => {
    return ["blank", "form", "login", "signup", "navigation", "article"];
  }, []);

  const [filteredWidgets, setFilteredWidgets] =
    React.useState<DraggableTypes[]>(widgets);

  const [filteredPageTypes, setFilteredPageTypes] =
    React.useState<string[]>(pageTypes);

  const [tab, setTab] = React.useState<string>("explorer");

  // Functions
  const onWidgetSearchHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilteredWidgets(
        widgets.filter(
          (widget) =>
            widget
              .toLowerCase()
              .trim()
              .startsWith(e.target.value.toLowerCase().trim()) === true
        )
      );
    },
    [widgets]
  );

  const onPageTypesSearchHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilteredPageTypes(
        pageTypes.filter(
          (option) =>
            option
              .toLowerCase()
              .trim()
              .startsWith(e.target.value.toLowerCase().trim()) === true
        )
      );
    },
    [pageTypes]
  );

  const handleCreatePage = React.useCallback(
    (name: string, type: string) => {
      const id = String(Date.now());

      // Create page
      createPage({ id, name });

      // Create necessary layout and draggables
      const draggableId = String(Date.now());
      const draggableId2 = String(Date.now() + 1);

      switch (type) {
        case "blank":
          setDefaultLayouts(id, () => {
            return {
              xs: [dummyLayout],
              sm: [dummyLayout],
            };
          });
          break;

        case "form":
          setDefaultLayouts(id, () => {
            return {
              xs: [dummyLayout, { ...dummyFormLayout, i: draggableId }],
              sm: [dummyLayout, { ...dummyFormLayout, i: draggableId }],
            };
          });

          setDraggables(id, [{ ...dummyFormDraggable, id: draggableId }]);
          break;

        case "login":
          setDefaultLayouts(id, () => {
            return {
              xs: [dummyLayout, { ...dummyFormLayout, i: draggableId }],
              sm: [dummyLayout, { ...dummyFormLayout, i: draggableId }],
            };
          });

          setDraggables(id, [
            {
              ...dummyFormDraggable,
              id: draggableId,
              props: {
                table: userTable,
                formTodo: {
                  label: "Log the User In",
                  value: "AUTH_LOGIN",
                },
                includes: loginFields ?? [],
                submitBtnProps: {
                  isPositionFixed: false,
                  text: "Login",
                },
              } as FormProps,
            },
          ]);
          break;

        case "signup":
          setDefaultLayouts(id, () => {
            return {
              xs: [dummyLayout, { ...dummyFormLayout, i: draggableId }],
              sm: [dummyLayout, { ...dummyFormLayout, i: draggableId }],
            };
          });

          setDraggables(id, [
            {
              ...dummyFormDraggable,
              id: draggableId,
              props: {
                table: userTable,
                formTodo: {
                  label: "Sign the User Up",
                  value: "AUTH_SIGNUP",
                },
                includes: userFields ?? [],
                submitBtnProps: {
                  isPositionFixed: false,
                  text: "Sign up",
                },
              } as FormProps,
            },
          ]);
          break;

        case "navigation":
          setDefaultLayouts(id, () => {
            return {
              xs: [dummyLayout, { ...dummyNavLayout, i: draggableId }],
              sm: [dummyLayout, { ...dummyNavLayout, i: draggableId }],
            };
          });

          setDraggables(id, [
            {
              ...dummyNavDraggable,
              id: draggableId,
            },
          ]);

          break;

        case "article":
          setDefaultLayouts(id, () => {
            return {
              xs: [
                dummyLayout,
                ...dummyArticleLayouts.map((layout, index) => ({
                  ...layout,
                  i: index === 0 ? draggableId : draggableId2,
                })),
              ],
              sm: [
                dummyLayout,
                ...dummyArticleLayouts.map((layout, index) => ({
                  ...layout,
                  i: index === 0 ? draggableId : draggableId2,
                })),
              ],
            };
          });

          setDraggables(
            id,
            dummyArticleDraggables.map((draggable, index) => {
              if (index === 0) {
                return { ...draggable, id: draggableId };
              } else {
                return { ...draggable, id: draggableId2 };
              }
            })
          );
          break;
        default:
      }

      router.push(`/databases/${databaseId}/editor/${id}`);
    },
    [
      createPage,
      router,
      databaseId,
      setDefaultLayouts,
      setDraggables,
      userTable,
      loginFields,
      userFields,
    ]
  );

  const handlePageClick = React.useCallback(
    (id: string) => {
      router.push(`/databases/${databaseId}/editor/${id}`);
    },
    [router, databaseId]
  );

  return {
    draggables,
    activeId,
    setActiveId,
    handleActiveDraggableChange,
    tab,
    setTab,
    isPagesOpen,
    togglePage,
    isWidgetsOpen,
    toggleWidget,
    onWidgetSearchHandler,
    filteredWidgets,
    onPageTypesSearchHandler,
    filteredPageTypes,
    pages,
    pickedPage,
    setPickedPageId,
    editorPageId,
    handleCreatePage,
    handlePageClick,
  };
};
