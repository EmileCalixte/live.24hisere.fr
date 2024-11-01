import React from "react";
import { Tooltip } from "../Tooltip";

type RunnerStoppedTooltipProps = Omit<
    React.ComponentProps<typeof Tooltip>,
    "title"
>;

export default function RunnerStoppedTooltip({
    children,
    ...props
}: RunnerStoppedTooltipProps): React.ReactElement {
    return (
        <Tooltip
            title="Ce coureur a annoncé s'être arrêté. Il sera quand même classé à la fin de la course."
            {...props}
        >
            {children}
        </Tooltip>
    );
}
