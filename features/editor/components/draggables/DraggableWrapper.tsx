import * as React from "react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export const DraggableWrapper = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        style,
        className,
        onMouseDown,
        onMouseUp,
        onTouchEnd,
        children,
        ...rest
      },
      ref
    ) => {
      return (
        <div
          style={{ ...style }}
          className={className}
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
          {...rest}
        >
          {children}
        </div>
      );
    }
  )
);
