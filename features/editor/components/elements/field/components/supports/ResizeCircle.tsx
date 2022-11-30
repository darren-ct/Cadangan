import * as React from "react";

export const ResizeCircle = React.memo(function ResizeCircle() {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "100vw",
        backgroundColor: "blue",
      }}
    ></div>
  );
});
