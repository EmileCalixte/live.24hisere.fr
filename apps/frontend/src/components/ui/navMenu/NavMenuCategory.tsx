import type React from "react";
import type { NavMenuCategory } from "./NavMenu";

interface NavMenuCategoryProps {
  category: NavMenuCategory;
}

export function NavMenuCategory({ category }: NavMenuCategoryProps): React.ReactElement {
  return <li></li>;
}
