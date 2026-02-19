import type React from "react";
import { Card } from "../Card";
import { NavMenu } from "./NavMenu";

export function NavMenuWideScreenContainer(): React.ReactElement {
  return (
    <Card
      shape="square"
      border="right-only"
      className="sticky top-0 max-h-screen w-72 shrink-0 overflow-x-hidden overflow-y-auto print:hidden"
    >
      <NavMenu />
    </Card>
  );
}
