import * as React from "react";

import {
  AccountIcon,
  AddCircleIcon,
  AddIcon,
  ArticleIcon,
  BarChartIcon,
  BlankIcon,
  ButtonIcon,
  ChevronDownIcon,
  ContainerIcon,
  FilterIcon,
  FlagIcon,
  FormIcon,
  KanbanIcon,
  LoginIcon,
  LogoutIcon,
  NavigationIcon,
  PageIcon,
  PolymerIcon,
  ReloadIcon,
  RemoveIcon,
  SidebarIcon,
  SignupIcon,
  StarIcon,
  TabContainerIcon,
  TableIcon,
  TextIcon,
  TextInputIcon,
} from "@/assets/icons";

interface Props {
  name: string;
  color?: string;
  fontSize?: number;
}

export const IconDisplay = React.memo(function IconDisplay({
  name,
  color = "#828282",
  fontSize = 16,
}: Props) {
  const getIcon = React.useCallback(
    (name: string) => {
      switch (name) {
        case "account":
          return <AccountIcon sx={{ color, fontSize }} />;

        case "polymer":
          return <PolymerIcon sx={{ color, fontSize }} />;

        case "down-arrow":
          return <ChevronDownIcon sx={{ color, fontSize }} />;

        case "add-circle":
          return <AddCircleIcon sx={{ color, fontSize }} />;

        case "add":
          return <AddIcon sx={{ color, fontSize }} />;

        case "container":
          return <ContainerIcon sx={{ color, fontSize }} />;

        case "flag":
          return <FlagIcon sx={{ color, fontSize }} />;

        case "reload":
          return <ReloadIcon sx={{ color, fontSize }} />;

        case "remove":
          return <RemoveIcon sx={{ color, fontSize }} />;

        case "star":
          return <StarIcon sx={{ color, fontSize }} />;

        case "table":
          return <TableIcon sx={{ color, fontSize }} />;

        case "button":
          return <ButtonIcon sx={{ color, fontSize }} />;

        case "text":
          return <TextIcon sx={{ color, fontSize }} />;

        case "navigation":
        case "nav":
          return <NavigationIcon sx={{ color, fontSize }} />;

        case "sideMenu":
          return <SidebarIcon sx={{ color, fontSize }} />;

        case "filter":
          return <FilterIcon sx={{ color, fontSize }} />;

        case "form":
          return <FormIcon sx={{ color, fontSize }} />;

        case "tabContainer":
          return <TabContainerIcon sx={{ color, fontSize }} />;

        case "textInput":
          return <TextInputIcon sx={{ color, fontSize }} />;

        case "chart":
          return <BarChartIcon sx={{ color, fontSize }} />;

        case "page":
          return <PageIcon sx={{ color, fontSize }} />;

        case "blank":
          return <BlankIcon sx={{ color, fontSize }} />;

        case "login":
          return <LoginIcon sx={{ color, fontSize }} />;

        case "logout":
          return <LogoutIcon sx={{ color, fontSize }} />;

        case "signup":
          return <SignupIcon sx={{ color, fontSize }} />;

        case "article":
          return <ArticleIcon sx={{ color, fontSize }} />;

        case "kanban":
          return <KanbanIcon sx={{ color, fontSize }} />;

        default:
          return <React.Fragment />;
      }
    },
    [color, fontSize]
  );

  return <>{getIcon(name)}</>;
});
