import type React from "react";

interface LinkBlankProps extends Omit<React.ComponentProps<"a">, "href"> {
  to: string | undefined;
}

export default function LinkBlank({ to, children, ...props }: LinkBlankProps): React.ReactElement {
  if (!to) {
    return <>{children}</>;
  }

  return (
    <a href={to} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  );
}
