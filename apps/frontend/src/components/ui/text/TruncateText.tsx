import type React from "react";

interface TruncateTextProps {
  maxLength: number;
  children: string;
}

function TruncateText({ maxLength, children }: TruncateTextProps): React.ReactElement {
  const shouldTruncate = children.length > maxLength;
  const text = shouldTruncate ? `${children.slice(0, maxLength)}…` : children;

  return <span title={shouldTruncate ? children : undefined}>{text}</span>;
}

export default TruncateText;
