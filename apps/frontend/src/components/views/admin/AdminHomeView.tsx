import type React from "react";
import Page from "../../ui/Page";
import AdminHomeMenuList from "../../viewParts/admin/home/AdminHomeMenuList";

export default function AdminHomeView(): React.ReactElement {
  return (
    <Page id="admin-home" htmlTitle="Administration" title="Administration">
      <AdminHomeMenuList />
    </Page>
  );
}
