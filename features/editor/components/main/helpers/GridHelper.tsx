import Box from "@mui/material/Box";
import * as React from "react";

type Props = {
  depth: number;
  rowHeight: number;
  cols: number;
  margins: unknown;
};

export const GridHelper = React.memo(function GridHelper(props: Props) {
  const blockQty: number = React.useMemo(() => {
    return props.cols * props.depth;
  }, [props.cols, props.depth]);

  const renderArray: string[] = React.useMemo(() => {
    const array = [];

    for (let i = 0; i < blockQty; i++) {
      array.push(" ");
    }

    return array;
  }, [blockQty]);

  return (
    <Box
      sx={{
        position: "absolute",
        left: "0px",
        top: "0px",
        width: "100%",
        height: "100%",
        display: "grid",
        zIndex: "-1",
        gridTemplateColumns: `repeat(${props.cols},1fr)`,
        gridTemplateRows: `repeat(${props.depth}, ${props.rowHeight}px)`,
        rowGap: `${props.margins[1]}px`,
        columnGap: `${props.margins[0]}px`,
        opacity: 0.2,
        backgroundColor: "white",
      }}
    >
      {blockQty
        ? renderArray.map((_item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid rgba(0,0,0,.3)",
                backgroundColor: "white",
              }}
            ></div>
          ))
        : ""}
    </Box>
  );
});
