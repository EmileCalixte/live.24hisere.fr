import React from "react";
import { Helmet } from "react-helmet";

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
                <title>{title}</title>
            </Helmet>
            {children}
        </div>
    );
}
