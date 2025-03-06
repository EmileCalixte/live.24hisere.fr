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
}

export default function Page({
  children,
  id,
  htmlTitle,
  title,
  aboveTitle,
  breadCrumbs,
  className,
}: PageProps): React.ReactElement {
  if (Array.isArray(children)) {
    children = [children];
  }

  return (
    <div id={`page-${id}`} className={clsx("mx-3 md:mx-5", className)}>
      <Helmet>
        <title>{[htmlTitle, APP_BASE_TITLE].join(" - ")}</title>
      </Helmet>

      {aboveTitle}

      {breadCrumbs && <div className="mt-3">{breadCrumbs}</div>}

      {title && <h1 className="my-3">{title}</h1>}

      {children}
    </div>
  );
}
