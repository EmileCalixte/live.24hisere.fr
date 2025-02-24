import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryState } from "nuqs";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { stringUtils } from "@live24hisere/utils";
import { SearchParam } from "../../constants/searchParams";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicRunnerParticipations } from "../../hooks/api/requests/public/participants/useGetPublicRunnerParticipations";
import { useGetPublicRaces } from "../../hooks/api/requests/public/races/useGetPublicRaces";
import { useGetPublicRaceRunners } from "../../hooks/api/requests/public/runners/useGetPublicRaceRunners";
import { useGetPublicRunners } from "../../hooks/api/requests/public/runners/useGetPublicRunners";
import { useProcessedRunnersWithProcessedHours } from "../../hooks/runners/useProcessedRunnersWithProcessedHours";
import { useRaceSelectOptions } from "../../hooks/useRaceSelectOptions";
import { useRanking } from "../../hooks/useRanking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../utils/countryUtils";
import { getRaceRunnerFromRunnerAndParticipant } from "../../utils/runnerUtils";
import CircularLoader from "../ui/CircularLoader";
import { Flag } from "../ui/countries/Flag";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import RunnerDetailsStats from "../viewParts/runnerDetails/RunnerDetailsStats";
import RunnerSelector from "../viewParts/runnerDetails/RunnerSelector";

// const enum Tab {
//   Stats = "stats",
//   Laps = "laps",
// }

export default function RunnerDetailsView(): React.ReactElement {
  // const { serverTimeOffset } = React.useContext(appContext).appData;

  const { runnerId } = useParams(); // This param is optional, undefined if no runner selected

  const [selectedRaceId, setSelectedRaceId] = useQueryState(SearchParam.RACE);

  const navigate = useNavigate();

  // const [selectedTab, setSelectedTab] = useQueryState(
  //   SearchParam.TAB,
  //   parseAsEnum([Tab.Stats, Tab.Laps]).withDefault(Tab.Stats),
  // );

  const getEditionsQuery = useGetPublicEditions();
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetPublicRaces();
  const races = getRacesQuery.data?.races;

  const selectedRace = React.useMemo(
    () => races?.find((race) => race.id.toString() === selectedRaceId),
    [races, selectedRaceId],
  );

  const selectedRaceEdition = React.useMemo(() => {
    if (!editions || !selectedRace) {
      return undefined;
    }

    return editions.find((edition) => edition.id === selectedRace.editionId);
  }, [editions, selectedRace]);

  const allRacesOptions = useRaceSelectOptions(races, (race) => {
    const edition = editions?.find((edition) => edition.id === race.editionId);

    if (edition) {
      return `${edition.name} – ${race.name}`;
    }

    return race.name;
  });

  const getRunnersQuery = useGetPublicRunners();
  const runners = getRunnersQuery.data?.runners;

  const selectedRunner = React.useMemo(() => {
    if (!runners || runnerId === undefined) {
      return undefined;
    }

    return runners.find((runner) => runner.id.toString() === runnerId);
  }, [runnerId, runners]);

  const getRunnerParticipationsQuery = useGetPublicRunnerParticipations(selectedRunner?.id);
  const runnerParticipations = getRunnerParticipationsQuery.data?.participations;

  const runnerRaceIds = React.useMemo(
    () => new Set(runnerParticipations?.map((participation) => participation.raceId)),
    [runnerParticipations],
  );

  const runnerHasMultipleParticipations = runnerParticipations && runnerParticipations.length >= 2;

  const runnerRaceOptions = allRacesOptions.filter((option) => runnerRaceIds.has(option.value));

  const selectedParticipation = React.useMemo(
    () => runnerParticipations?.find((participation) => participation.raceId === selectedRace?.id),
    [runnerParticipations, selectedRace?.id],
  );

  const selectedRaceRunner = React.useMemo(() => {
    if (!selectedRunner || !selectedParticipation) {
      return undefined;
    }

    return getRaceRunnerFromRunnerAndParticipant(selectedRunner, selectedParticipation);
  }, [selectedParticipation, selectedRunner]);

  const getRaceRunnersQuery = useGetPublicRaceRunners(selectedRaceId ?? undefined);
  const raceRunners = getRaceRunnersQuery.data?.runners;

  const processedRaceRunners = useProcessedRunnersWithProcessedHours(raceRunners, selectedRace);

  const ranking = useRanking(selectedRace, processedRaceRunners);
  const selectedRankingRunner = ranking?.find((runner) => runner.id === selectedRaceRunner?.id);

  const onSelectRunner = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      void navigate(`/runner-details/${e.target.value}${window.location.search}`);
    },
    [navigate],
  );

  // const exportRunnerToXlsx = React.useCallback(() => {
  //   if (!selectedRaceRunner) {
  //     return;
  //   }

  //   const filename = `${selectedRaceRunner.firstname} ${selectedRaceRunner.lastname}`.trim();

  //   generateXlsxFromData(getDataForExcelExport(selectedRaceRunner), filename);
  // }, [selectedRaceRunner]);

  // Redirect to runner-details without selected runner if selected runner ID is unknown
  React.useEffect(() => {
    if (!runners || runnerId === undefined) {
      return;
    }

    if (runners.find((runner) => runner.id.toString() === runnerId) === undefined) {
      void navigate("/runner-details");
    }
  }, [runners, runnerId, navigate]);

  // Remove race query param if selected runner has no participation in corresponding race
  React.useEffect(() => {
    if (!selectedRunner || !runnerParticipations) {
      return;
    }

    if (
      runnerParticipations.find((participation) => participation.raceId.toString() === selectedRaceId) === undefined
    ) {
      void setSelectedRaceId(null);
    }
  }, [runnerParticipations, selectedRaceId, selectedRunner, setSelectedRaceId]);

  // Auto-select first participation race (participations are ordered by edition order and race order) if no race selected
  React.useEffect(() => {
    if (!selectedRunner || !runnerParticipations) {
      return;
    }

    if (selectedRaceId === null && runnerParticipations.length > 0) {
      void setSelectedRaceId(runnerParticipations[0].raceId.toString());
    }
  }, [runnerParticipations, selectedRaceId, selectedRunner, setSelectedRaceId]);

  const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(selectedRaceRunner?.countryCode ?? null);

  // const isRaceInProgress = !!selectedRace && !isRaceFinished(selectedRace, serverTimeOffset);

  return (
    <Page
      id="runner-details"
      title={
        selectedRunner === undefined
          ? "Détails coureur"
          : `Détails coureur ${selectedRunner.firstname} ${selectedRunner.lastname}`
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

      {runnerId === undefined && (
        <Row>
          <Col>
            <p>Sélectionnez un coureur ci-dessus pour consulter ses détails.</p>
          </Col>
        </Row>
      )}

      {runnerId !== undefined && !selectedRaceRunner && (
        <div className="card mt-3">
          <Row>
            <Col>
              <p>
                <CircularLoader asideText="Chargement des données" />
              </p>
            </Col>
          </Row>
        </div>
      )}

      {selectedRaceRunner && (
        <div className="card mt-3">
          <Row>
            <Col>
              <h2 className="m-0 d-flex align-items-center gap-2">
                {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}

                <span>
                  {selectedRaceRunner.lastname.toUpperCase()} {selectedRaceRunner.firstname}
                </span>
              </h2>
            </Col>
          </Row>

          <Row className="mt-1 mb-4">
            {runnerHasMultipleParticipations ? (
              <Col xxl={3} xl={4} lg={6} md={8} sm={12}>
                <Select
                  label="Course"
                  options={runnerRaceOptions}
                  value={selectedRace?.id}
                  onChange={(e) => {
                    void setSelectedRaceId(e.target.value);
                  }}
                />
              </Col>
            ) : (
              <Col>
                <p className="m-0">
                  {stringUtils.joinNonEmpty([selectedRaceEdition?.name, selectedRace?.name], " – ")}
                </p>
              </Col>
            )}
          </Row>

          {selectedRankingRunner && selectedRace && ranking ? (
            <>
              <RunnerDetailsStats runner={selectedRankingRunner} race={selectedRace} ranking={ranking} />
            </>
          ) : (
            <p>
              <CircularLoader asideText="Chargement des données" />
            </p>
          )}
        </div>
      )}

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
      {/* )} */}
    </Page>
  );
}
