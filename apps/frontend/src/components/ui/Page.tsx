import type React from "react";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { APP_BASE_TITLE } from "../../constants/app";

interface PageProps {
  children: React.ReactNode[] | React.ReactNode;
  id: string;
  htmlTitle: string;
  title?: React.ReactNode;
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
  aboveTitle,
  breadCrumbs,
  className,
  contentClassName,
}: PageProps): React.ReactElement {
  if (Array.isArray(children)) {
    children = [children];
  }

  return (
    <div id={`page-${id}`} className={clsx("mx-3 flex flex-col gap-3 md:mx-5", className)}>
      <Helmet>
        <title>{[htmlTitle, APP_BASE_TITLE].join(" - ")}</title>
      </Helmet>

      {aboveTitle}

      {breadCrumbs}

      {title && <h1 id="page-title">{title}</h1>}

      <div id="page-content" className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
