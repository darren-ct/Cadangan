import * as React from "react";

import type { DraggableTypes, LayoutItem } from "@/features/editor";

export const useFixedLayout = () => {
  const handleFixedDrop = React.useCallback(
    (type: DraggableTypes, layout: LayoutItem[]) => {
      if (type === "sideMenu") {
        return {
          sm: layout.map((item) => {
            if (item.i.split("-")[0] === "side") {
              return { ...item, x: 0, y: 0 };
            } else {
              return item;
            }
          }),
          xs: layout.map((item) => {
            if (item.i.split("-")[0] === "side") {
              return { ...item, x: 0, y: 0 };
            } else {
              return item;
            }
          }),
        };
      }

      if (type === "nav") {
        return {
          sm: layout.map((item) => {
            if (item.i.split("-")[0] === "nav") {
              return { ...item, x: 0, y: 0 };
            } else {
              return item;
            }
          }),
          xs: layout.map((item) => {
            if (item.i.split("-")[0] === "nav") {
              return { ...item, x: 0, y: 0 };
            } else {
              return item;
            }
          }),
        };
      }

      return {
        xs: layout,
        sm: layout,
      };
    },
    []
  );

  const handleFixedDragStop = React.useCallback((layout: LayoutItem[]) => {
    return {
      sm: layout.map((item) => {
        if (item.i.split("-")[0] === "nav" || item.i.split("-")[0] === "side") {
          return { ...item, x: 0, y: 0 };
        } else {
          return item;
        }
      }),
      xs: layout.map((item) => {
        if (item.i.split("-")[0] === "nav" || item.i.split("-")[0] === "side") {
          return { ...item, x: 0, y: 0 };
        } else {
          return item;
        }
      }),
    };
  }, []);

  return { handleFixedDrop, handleFixedDragStop };
};
