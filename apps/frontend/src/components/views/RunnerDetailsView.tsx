import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import CircularLoader from "../ui/CircularLoader";
import Page from "../ui/Page";
import RunnerSelector from "../viewParts/runnerDetails/RunnerSelector";

// const enum Tab {
//   Stats = "stats",
//   Laps = "laps",
// }

export default function RunnerDetailsView(): React.ReactElement {
  const { runnerId } = useParams();

  const navigate = useNavigate();

  // const [selectedTab, setSelectedTab] = useQueryState(
  //   SearchParam.TAB,
  //   parseAsEnum([Tab.Stats, Tab.Laps]).withDefault(Tab.Stats),
  // );

  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  // const raceId: number | undefined = React.useMemo(() => {
  //   if (runnerId === undefined) {
  //     return undefined;
  //   }

  //   return runners?.find((runner) => runner.id.toString() === runnerId)?.raceId;
  // }, [runnerId, runners]);

  // const fetchRace = React.useMemo(() => {
  //   if (raceId === undefined) {
  //     return;
  //   }

  //   return async () => await getRace(raceId);
  // }, [raceId]);

  // const race = useIntervalSimpleApiRequest(fetchRace).json?.race;

  // const fetchRaceRunners = React.useMemo(() => {
  //   if (raceId === undefined) {
  //     return;
  //   }

  //   return async () => await getRaceRunners(raceId);
  // }, [raceId]);

  // const raceRunners = useIntervalSimpleApiRequest(fetchRaceRunners).json?.runners;

  // const processedRaceRunners = React.useMemo<
  //   Array<RunnerWithProcessedPassages & RunnerWithProcessedHours & RaceRunnerWithProcessedData> | undefined
  // >(() => {
  //   if (!raceRunners || !race) {
  //     return;
  //   }

  //   return raceRunners.map((runner) => {
  //     const processedPassages = getProcessedPassagesFromPassages(race, runner.passages);

  //     return {
  //       ...runner,
  //       ...getRunnerProcessedDataFromPassages(race, runner.passages),
  //       passages: processedPassages,
  //       hours: getProcessedHoursFromPassages(race, processedPassages),
  //     };
  //   });
  // }, [raceRunners, race]);

  // const ranking = useRanking(race, processedRaceRunners);

  // const selectedRunner = React.useMemo(() => {
  //   return ranking?.find((rankingRunner) => rankingRunner.id.toString() === runnerId);
  // }, [ranking, runnerId]);

  const onSelectRunner = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      void navigate(`/runner-details/${e.target.value}${window.location.search}`);
    },
    [navigate],
  );

  // const exportRunnerToXlsx = React.useCallback(() => {
  //   if (!selectedRunner) {
  //     return;
  //   }

  //   const filename = `${selectedRunner.firstname} ${selectedRunner.lastname}`.trim();

  //   generateXlsxFromData(getDataForExcelExport(selectedRunner), filename);
  // }, [selectedRunner]);

  React.useEffect(() => {
    if (!runners || runnerId === undefined) {
      return;
    }

    if (runners.find((runner) => runner.id.toString() === runnerId) === undefined) {
      void navigate("/runner-details");
    }
  }, [runners, runnerId, navigate]);

  return (
    <Page
      id="runner-details"
      title={
        "TODO"
        // selectedRunner === undefined
        //   ? "Détails coureur"
        //   : `Détails coureur ${selectedRunner.firstname} ${selectedRunner.lastname}`
      }
    >
      <Row className="hide-on-print">
        <Col>
          <h1>Détails coureur</h1>
        </Col>
      </Row>

      <Row className="hide-on-print">
        <Col>
          <p className="mt-0">
            <Link to="/runner-details/search" className="button">
              <FontAwesomeIcon icon={faSearch} className="me-1" /> Rechercher un coureur
            </Link>
          </p>
        </Col>
      </Row>

      <Row className="hide-on-print">
        <Col>
          <RunnerSelector runners={runners} onSelectRunner={onSelectRunner} selectedRunnerId={runnerId} />
        </Col>
      </Row>

      {/* {selectedRunner && race ? (
            <>
              <Row className="mt-3">
                <Col className="mb-3">
                  <button className="a" onClick={exportRunnerToXlsx}>
                    <FontAwesomeIcon icon={faFileExcel} /> Générer un fichier Excel
                  </button>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="runner-details-data-container">
                    <ul className="tabs-container">
                      <li className={selectedTab === Tab.Stats ? "active" : ""}>
                        <button
                          onClick={() => {
                            void setSelectedTab(Tab.Stats);
                          }}
                        >
                          Statistiques
                        </button>
                      </li>
                      <li className={selectedTab === Tab.Laps ? "active" : ""}>
                        <button
                          onClick={() => {
                            void setSelectedTab(Tab.Laps);
                          }}
                        >
                          Détails des tours
                        </button>
                      </li>
                    </ul>

                    <div className="card">
                      {selectedRunner.stopped && (
                        <div>
                          <p
                            className="mt-3 mb-0"
                            style={{
                              fontWeight: "bold",
                              color: "#db1616",
                            }}
                          >
                            Coureur arrêté
                            <RunnerStoppedTooltip className="ms-2">
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                style={{
                                  fontSize: "0.85em",
                                }}
                              />
                            </RunnerStoppedTooltip>
                          </p>
                        </div>
                      )}

                      {(() => {
                        switch (selectedTab) {
                          case Tab.Stats:
                            return (
                              <>
                                <RunnerDetailsRaceDetails race={race} />
                                {ranking ? (
                                  <RunnerDetailsStats runner={selectedRunner} race={race} ranking={ranking} />
                                ) : (
                                  <CircularLoader />
                                )}
                              </>
                            );
                          case Tab.Laps:
                            return <RunnerDetailsLaps runner={selectedRunner} race={race} />;
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          ) : ( */}
      <>
        {runnerId !== undefined && (
          <Row className="mt-3">
            <Col>
              <CircularLoader asideText="Chargement des données" />
            </Col>
          </Row>
        )}
      </>
      {/* )} */}
    </Page>
  );
}
