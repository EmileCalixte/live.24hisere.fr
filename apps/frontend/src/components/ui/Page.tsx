import type React from "react";
import { Helmet } from "react-helmet";
import { cn, tv, type VariantProps } from "tailwind-variants";
import { APP_BASE_TITLE } from "../../constants/app";

const pageContent = tv({
  variants: {
    layout: {
      default: "",
      flexGap: "flex flex-col gap-default",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

interface PageProps extends VariantProps<typeof pageContent> {
  children: React.ReactNode[] | React.ReactNode;
  id: string;
  htmlTitle: string;
  title: React.ReactNode;
  titleSrOnly?: true;
  aboveTitle?: React.ReactNode;
  breadCrumbs?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function Page({
  children,
  id,
  htmlTitle,
  title,
  titleSrOnly,
  aboveTitle,
  breadCrumbs,
  className,
  layout,
  contentClassName,
}: PageProps): React.ReactElement {
  return (
    <div id={`page-${id}`} className={cn("mx-3 flex flex-col gap-3 lg:mx-8 lg:gap-6", className)}>
      <Helmet>
        <title>{[htmlTitle, APP_BASE_TITLE].join(" - ")}</title>
      </Helmet>

      {aboveTitle}

      {breadCrumbs}

      {title && (
        <h1 id="page-title" className={cn(titleSrOnly && "sr-only")}>
          {title}
        </h1>
      )}

      <div id="page-content" className={cn(pageContent({ layout }), contentClassName)}>
        {children}
      </div>
    </div>
  );
}
