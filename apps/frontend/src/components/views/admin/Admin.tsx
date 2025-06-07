import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { appContext } from "../../../contexts/AppContext";
import CircularLoader from "../../ui/CircularLoader";
import AdminHomeView from "./AdminHomeView";
import CustomRunnerCategoriesAdminView from "./customRunnerCategories/CustomRunnerCategoriesAdminView";
import DisabledAppAdminView from "./DisabledAppAdminView";
import CreateEditionAdminView from "./editions/CreateEditionAdminView";
import EditionDetailsAdminView from "./editions/EditionDetailsAdminView";
import EditionsAdminView from "./editions/EditionsAdminView";
import FastestLapsAdminView from "./FastestLapsAdminView";
import CreateParticipantAdminView from "./participants/CreateParticipantAdminView";
import ParticipantDetailsAdminView from "./participants/ParticipantDetailsAdminView";
import CreatePassageImportRuleAdminView from "./passageImportSettings/CreatePassageImportRuleAdminView";
import PassageImportRuleDetailsAdminView from "./passageImportSettings/PassageImportRuleDetailsAdminView";
import PassageImportRulesAdminView from "./passageImportSettings/PassageImportRulesAdminView";
import CreateRaceAdminView from "./races/CreateRaceAdminView";
import RaceDetailsAdminView from "./races/RaceDetailsAdminView";
import RacesAdminView from "./races/RacesAdminView";
import CreateRunnerAdminView from "./runners/CreateRunnerAdminView";
import RunnerDetailsAdminView from "./runners/RunnerDetailsAdminView";
import RunnersAdminView from "./runners/RunnersAdminView";

export default function Admin(): React.ReactElement {
  const { user } = React.useContext(appContext).user;

  if (user === null) {
    return <Navigate to="/" />;
  }

  if (user === undefined) {
    return <CircularLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminHomeView />} />
      <Route path="editions" element={<EditionsAdminView />} />
      <Route path="editions/create" element={<CreateEditionAdminView />} />
      <Route path="editions/:editionId" element={<EditionDetailsAdminView />} />
      <Route path="runners" element={<RunnersAdminView />} />
      <Route path="runners/create" element={<CreateRunnerAdminView />} />
      <Route path="runners/:runnerId" element={<RunnerDetailsAdminView />} />
      <Route path="races" element={<RacesAdminView />} />
      <Route path="races/create" element={<CreateRaceAdminView />} />
      <Route path="races/:raceId" element={<RaceDetailsAdminView />} />
      <Route path="races/:raceId/add-runner" element={<CreateParticipantAdminView />} />
      <Route path="races/:raceId/runners/:runnerId" element={<ParticipantDetailsAdminView />} />
      <Route path="custom-runner-categories" element={<CustomRunnerCategoriesAdminView />} />
      <Route path="fastest-laps" element={<FastestLapsAdminView />} />
      <Route path="passage-import-rules" element={<PassageImportRulesAdminView />} />
      <Route path="passage-import-rules/create" element={<CreatePassageImportRuleAdminView />} />
      <Route path="passage-import-rules/:ruleId" element={<PassageImportRuleDetailsAdminView />} />
      <Route path="disabled-app" element={<DisabledAppAdminView />} />

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
