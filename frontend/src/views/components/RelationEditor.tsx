import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AttributeEditor, Select } from "@cloudscape-design/components";
import {
  RelationModel,
  ResearchModel,
  ConstructRelationship,
  copyResearchModel,
  createRelationModel,
} from "../../models/research-model";
import { handleRelation } from "../../controllers/research-controller";
import { formID } from "../../utils/names";

export default ({
  research,
  setResearch,
}: {
  research: ResearchModel;
  setResearch: Dispatch<SetStateAction<ResearchModel>>;
}) => {
  const relationshipOptions = Object.values(ConstructRelationship).map((e) => ({
    value: e,
  }));

  const constructSimilarity = (item: RelationModel) => {
    const array = [item.influencer, item.independent, item.dependent];
    if (array.some((e) => e === undefined)) {
      return;
    }
    const uniqueNames = [...new Set(array.map((e) => e?.name))];
    if (uniqueNames.length < 3) {
      return "Please use different variable";
    }
  };

  const [relations, setRelations] = useState(
    research.relations.length ? research.relations : [createRelationModel()]
  );

  useEffect(() => {
    setResearch(copyResearchModel(research, { relations: relations }));
  }, [relations]);

  return (
    <>
      <AttributeEditor
        onAddButtonClick={() => {
          setRelations([...relations, createRelationModel()]);
        }}
        onRemoveButtonClick={({ detail: { itemIndex } }) => {
          const newRelations = relations.filter((e, i) => {
            return i !== itemIndex;
          });
          setRelations(newRelations);
        }}
        isItemRemovable={(item) => {
          return relations.indexOf(item) > 0;
        }}
        addButtonText="Add construct"
        removeButtonText={"Remove"}
        items={relations}
        definition={[
          {
            label: formID.influencer,
            errorText: (item) => constructSimilarity(item),
            control: (item, index) => (
              <Select
                placeholder="Choose influencing variable"
                selectedOption={{
                  label: item.influencer?.name,
                  value: item.influencer?.name,
                }}
                options={research.constructs.map((e) => ({
                  label: e.name,
                  value: e.name,
                }))}
                onChange={({ detail }) => {
                  handleRelation(
                    formID.influencer,
                    research,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
          {
            label: formID.relationship,
            control: (item, index) => (
              <Select
                placeholder="Choose relationship"
                selectedOption={{
                  label: item.relationship,
                  value: item.relationship,
                }}
                options={relationshipOptions.map((e) => ({
                  label: e.value,
                  value: e.value,
                }))}
                onChange={({ detail }) => {
                  handleRelation(
                    formID.relationship,
                    research,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
          {
            label: formID.independent,
            errorText: (item) => constructSimilarity(item),
            control: (item, index) => (
              <Select
                disabled={item.relationship === ConstructRelationship.Direct}
                placeholder="Choose independent variable"
                selectedOption={{
                  label: item.independent?.name,
                  value: item.independent?.name,
                }}
                options={research.constructs
                  .map((e) => ({
                    label: e.name,
                    value: e.name,
                  }))
                  .filter((e) => e.value !== item.influencer?.name)}
                onChange={({ detail }) => {
                  handleRelation(
                    formID.independent,
                    research,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
          {
            label: formID.dependent,
            errorText: (item) => constructSimilarity(item),
            control: (item, index) => (
              <Select
                placeholder="Choose dependent variable"
                selectedOption={{
                  label: item.dependent?.name,
                  value: item.dependent?.name,
                }}
                options={research.constructs
                  .map((e) => ({
                    label: e.name,
                    value: e.name,
                  }))
                  .filter((e) => e.value !== item.influencer?.name)}
                onChange={({ detail }) => {
                  handleRelation(
                    formID.dependent,
                    research,
                    detail,
                    index,
                    relations,
                    setRelations
                  );
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
};
