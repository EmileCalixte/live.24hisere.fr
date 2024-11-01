import React from "react";
import { Helmet } from "react-helmet";
import { APP_BASE_TITLE } from "../../constants/app";

interface PageProps {
  children: React.ReactNode[] | React.ReactNode;
  id: string;
  title: string;
}

export default function Page({ children, id, title }: PageProps): React.ReactElement {
  if (Array.isArray(children)) {
    children = [children];
  }

  return (
    <div id={`page-${id}`}>
      <Helmet>
        <title>{[title, APP_BASE_TITLE].join(" - ")}</title>
      </Helmet>
      {children}
    </div>
  );
}
