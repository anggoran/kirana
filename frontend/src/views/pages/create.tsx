import { useEffect, useState } from "react";
import { Wizard } from "@cloudscape-design/components";
import ObservationTable from "../components/ObservationTable";
import IndicatorTable from "../components/IndicatorTable";
import ConstructEditor from "../components/ConstructEditor";
import RelationEditor from "../components/RelationEditor";
import { Observations, createResearchModel } from "../../models/research-model";

export default function CreatePage() {
  const [research, setResearch] = useState(createResearchModel());
  const [observations, setObservations] = useState<Observations>();

  return (
    <>
      <Wizard
        i18nStrings={{
          stepNumberLabel: (i) => (i < 4 ? `Step ${i}` : "Final Step"),
          collapsedStepsLabel: (i, n) =>
            i < 4 ? `Step ${i} of ${n}` : "Final Step",
          submitButton: "Start analysis",
          nextButton: "Next",
          previousButton: "Previous",
        }}
        steps={[
          {
            title: "Select Observations",
            content: (
              <ObservationTable
                observations={observations}
                setObservations={setObservations}
                research={research}
                setResearch={setResearch}
              />
            ),
          },
          {
            title: "Define Indicators",
            content: (
              <IndicatorTable research={research} setResearch={setResearch} />
            ),
          },
          {
            title: "Determine Constructs",
            content: (
              <ConstructEditor research={research} setResearch={setResearch} />
            ),
          },
          {
            title: "Create Relations",
            content: (
              <RelationEditor research={research} setResearch={setResearch} />
            ),
          },
        ]}
      />
    </>
  );
}
