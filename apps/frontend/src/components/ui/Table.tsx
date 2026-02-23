import React from "react";
import { twMerge } from "tailwind-merge";

export const TABLE_CELL_BORDER_CLASSNAME = "border border-solid border-neutral-300 dark:border-neutral-700";
export const TABLE_CELL_PADDING_CLASSNAME = "p-2 print:p-1";
export const TABLE_HEADER_BG_CLASSNAME = "bg-white dark:bg-white/5";

const TABLE_CELL_PRINT_CLASSNAME = "print:border-0 print:border-b-1 print:text-sm print:text-left";

export const Table = React.forwardRef<HTMLTableElement, React.ComponentPropsWithoutRef<"table">>(
  ({ children, className, ...props }, ref) => (
    <table className={twMerge("border-collapse", className)} {...props} ref={ref}>
      {children}
    </table>
  ),
);
Table.displayName = "Table";

export const Tr = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentPropsWithoutRef<"tr"> & {
    hoverEffect?: boolean;
    alternateBgColors?: boolean;
  }
>(({ children, className, hoverEffect = true, alternateBgColors = true, ...props }, ref) => (
  <tr
    className={twMerge(
      alternateBgColors
        && "odd:[&>td]:bg-neutral-50 even:[&>td]:bg-neutral-100 odd:[&>td]:dark:bg-neutral-800 even:[&>td]:dark:bg-neutral-900",
      hoverEffect && "hover:[&>td]:bg-black/5 hover:[&>td]:dark:bg-white/10",
      className,
    )}
    {...props}
    ref={ref}
  >
    {children}
  </tr>
));
Tr.displayName = "Tr";

export const Th = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"th">>(
  ({ children, className, ...props }, ref) => (
    <th
      className={twMerge(
        TABLE_CELL_BORDER_CLASSNAME,
        TABLE_CELL_PADDING_CLASSNAME,
        TABLE_CELL_PRINT_CLASSNAME,
        TABLE_HEADER_BG_CLASSNAME,
        "border-b-2",
        className,
      )}
      {...props}
      ref={ref}
    >
      {children}
    </th>
  ),
);
Th.displayName = "Th";

export const Td = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"td">>(
  ({ children, className, ...props }, ref) => (
    <td
      className={twMerge(
        TABLE_CELL_BORDER_CLASSNAME,
        TABLE_CELL_PADDING_CLASSNAME,
        TABLE_CELL_PRINT_CLASSNAME,
        className,
      )}
      {...props}
      ref={ref}
    >
      {children}
    </td>
  ),
);
Td.displayName = "Td";
