import type React from "react";
import clsx from "clsx";
import { Col, Row } from "react-bootstrap";
import type { ProcessedPassage } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import { formatMsAsDuration, formatMsDurationHms } from "../../../utils/durationUtils";

interface RunnerDetailsStatsLapCardProps {
  title: string;
  passage: ProcessedPassage | null;
}

export function RunnerDetailsStatsLapCard({ title, passage }: RunnerDetailsStatsLapCardProps): React.ReactElement {
  return (
    <div className="card">
      <h3 className={clsx("mt-0", !passage && "mb-0")}>
        {title}&nbsp;: {passage ? formatMsDurationHms(passage.processed.lapDuration) : NO_VALUE_PLACEHOLDER}
      </h3>

      {passage && (
        <Row as="ul" className="no-ul-style gap-y-3">
          <Col as="li" xxl={12}>
            Tour n° {passage.processed.lapNumber}
            <> </>à <strong>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</strong> de course
          </Col>

          <Col as="li" xl={6} md={12} sm={6} xs={12}>
            Vitesse&nbsp;: <strong>{passage.processed.lapSpeed.toFixed(2)} km/h</strong>
          </Col>

          <Col as="li" xl={6} md={12} sm={6} xs={12}>
            Allure&nbsp;:
            <> </>
            <strong>
              {formatMsDurationHms(passage.processed.lapPace)}
              <> </>/ km
            </strong>
          </Col>
        </Row>
      )}
    </div>
  );
}
