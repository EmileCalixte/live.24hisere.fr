import type React from "react";
import type { AdminRace, PassageImportRule } from "@live24hisere/core/types";
import { Card } from "../../../ui/Card";
import { Separator } from "../../../ui/Separator";

interface PassageImportRuleCardProps {
  rule: PassageImportRule;
  races: AdminRace[];
}

export function PassageImportRuleCard({ rule, races }: PassageImportRuleCardProps): React.ReactElement {
  return (
    <Card className="flex flex-col gap-2 p-3 transition-shadow hover:shadow-md dark:transition-colors dark:hover:bg-neutral-700">
      <pre className="text-xs text-wrap">{rule.url}</pre>

      <Separator />

      <p className="text-sm">{rule.isActive ? "Active" : "Inactive"}</p>

      <div>{races.map((race) => race.name).join(" - ")}</div>
    </Card>
  );
}
