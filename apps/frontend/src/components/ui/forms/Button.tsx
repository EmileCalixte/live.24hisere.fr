import type React from "react";
import clsx from "clsx";
import CircularLoader from "../CircularLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  click?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ className, isLoading, icon, children, ...props }: ButtonProps): React.ReactElement {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    props.onClick?.(e);
  };

  return (
    <button
      className={clsx("button d-flex align-items-center justify-content-center", className, isLoading && "loading")}
      style={{ position: "relative" }}
      {...props}
      onClick={handleClick}
    >
      <span className={clsx("d-flex align-items-center gap-2", isLoading && "opacity-0")}>
        {icon}
        {children}
      </span>

      {isLoading && (
        <span className="d-flex align-items-center justify-content-center" style={{ position: "absolute", inset: 0 }}>
          <CircularLoader />
        </span>
      )}
    </button>
  );
}
