import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AttributeEditor,
  Input,
  Multiselect,
} from "@cloudscape-design/components";
import {
  ResearchModel,
  copyResearchModel,
  createConstructModel,
} from "../../models/research-model";

export default ({
  research,
  setResearch,
}: {
  research: ResearchModel;
  setResearch: Dispatch<SetStateAction<ResearchModel>>;
}) => {
  const [constructs, setConstructs] = useState(
    research.constructs.length ? research.constructs : [createConstructModel()]
  );

  useEffect(() => {
    setResearch(copyResearchModel(research, { constructs: constructs }));
  }, [constructs]);

  return (
    <>
      <AttributeEditor
        onAddButtonClick={() => {
          setConstructs([...constructs, createConstructModel()]);
        }}
        onRemoveButtonClick={({ detail: { itemIndex } }) => {
          const newConstructs = constructs.filter((e, i) => {
            return i !== itemIndex;
          });
          setConstructs(newConstructs);
        }}
        isItemRemovable={(item) => {
          return constructs.indexOf(item) > 0;
        }}
        addButtonText="Add construct"
        removeButtonText={"Remove"}
        items={constructs}
        definition={[
          {
            label: "Name",
            control: (item, index) => (
              <Input
                value={item.name}
                placeholder="Construct's short name"
                onChange={({ detail }) => {
                  const newConstructs = constructs.map((e, i) => {
                    return i === index ? { ...item, name: detail.value } : e;
                  });
                  setConstructs(newConstructs);
                }}
              />
            ),
          },
          {
            label: "Description",
            control: (item, index) => (
              <Input
                value={item.description}
                placeholder="Construct's full name"
                onChange={({ detail }) => {
                  const newConstructs = constructs.map((e, i) => {
                    return i === index
                      ? { ...item, description: detail.value }
                      : e;
                  });
                  setConstructs(newConstructs);
                }}
              />
            ),
          },
          {
            label: "Indicators",
            control: (item, index) => (
              <Multiselect
                placeholder="Choose indicators"
                tokenLimit={0}
                selectedOptions={item.indicators.map((e) => ({
                  label: e.name,
                  value: e.name,
                }))}
                options={research.indicators
                  .filter((e) => e.visibility)
                  .map((e) => ({
                    label: e.name,
                    value: e.name,
                  }))}
                onChange={({ detail }) => {
                  const newIndicators = detail.selectedOptions.flatMap(
                    (option) =>
                      research.indicators.filter(
                        (element) => element.name === option.value
                      )
                  );
                  const newConstructs = constructs.map((e, i) => ({
                    ...e,
                    indicators: i === index ? newIndicators : e.indicators,
                  }));
                  setConstructs(newConstructs);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};
