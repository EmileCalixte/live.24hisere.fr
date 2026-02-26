import type React from "react";
import { Card } from "../ui/Card";
import Page from "../ui/Page";

export default function CompareRunnersView(): React.ReactElement {
  return (
    <Page id="compare-runners" title="Comparaison de coureurs" htmlTitle="Comparaison de coureurs" layout="flexGap">
      <Card>
        <p>
          Vous pouvez utiliser cet outil pour comparer plusieurs coureurs différents, ou un même coureur sur plusieurs
          courses différentes.
        </p>
      </Card>
    </Page>
  );
}
