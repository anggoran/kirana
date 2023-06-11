import { Dispatch, SetStateAction } from "react";
import {
  ConstructModel,
  IndicatorModel,
  RelationModel,
  ResearchModel,
  ConstructRelationship,
  IndicatorRole,
  IndicatorType,
  copyResearchModel,
  Observations,
} from "../models/research-model";
import { DSVRowString, csvParse } from "d3";
import { TableProps } from "@cloudscape-design/components/table/interfaces";
import { CollectionPreferencesProps } from "@cloudscape-design/components/collection-preferences/interfaces";
import { SelectProps } from "@cloudscape-design/components/select/interfaces";
import { formID } from "../utils/names";

export const handleCSV = async (
  file: File,
  research: ResearchModel,
  setResearch: Dispatch<SetStateAction<ResearchModel>>
) => {
  if (file === undefined) return;

  const newFilePath = file.path;
  const blob = await file.text();
  const csv = csvParse(blob);

  const newIndicators = csv.columns.map((e, i): IndicatorModel => {
    return {
      id: undefined,
      order: i,
      visibility: true,
      name: e,
      type: IndicatorType.Text,
      role: IndicatorRole.Profile,
    };
  });

  const newState = copyResearchModel(research, {
    filePath: newFilePath,
    indicators: newIndicators,
  });
  setResearch(newState);

  return csv;
};

export const handleIndicatorProps = (
  indicator: IndicatorModel,
  column: TableProps.ColumnDefinition<IndicatorModel>,
  newValue: unknown,
  research: ResearchModel,
  setResearch: Dispatch<SetStateAction<ResearchModel>>
) => {
  const newIndicators = research.indicators.map((e, i) => {
    return (e.id ?? i) === (indicator.id ?? indicator.order)
      ? { ...e, [column.id!]: newValue }
      : e;
  });

  const newState = copyResearchModel(research, {
    indicators: newIndicators,
  });
  setResearch(newState);
};

export const handleIndicatorPreferences = (
  detail: CollectionPreferencesProps.Preferences,
  research: ResearchModel,
  setResearch: Dispatch<SetStateAction<ResearchModel>>
) => {
  const rows = detail.contentDisplay!;

  const newIndicators = research.indicators
    .map((item, index) => {
      const matchedRow = rows.find(
        (row, i) => (item.id ?? index)?.toString() === (row.id ?? i).toString()
      );
      return matchedRow
        ? {
            ...item,
            order: rows.indexOf(matchedRow),
            visibility: matchedRow.visible,
          }
        : item;
    })
    .sort((a, b) => a.order - b.order);

  const newState = copyResearchModel(research, {
    indicators: newIndicators,
  });
  setResearch(newState);
};

export const handleRelation = (
  field: string,
  research: ResearchModel,
  detail: SelectProps.ChangeDetail,
  index: number,
  relations: RelationModel[],
  setRelations: Dispatch<SetStateAction<RelationModel[]>>
) => {
  let newField: ConstructModel | ConstructRelationship;

  switch (field) {
    case formID.influencer:
    case formID.independent:
    case formID.dependent:
      newField = research.constructs.find(
        (e) => e.name === detail.selectedOption.value
      ) as ConstructModel;
      break;
    case formID.relationship:
      newField = detail.selectedOption.value as ConstructRelationship;
      break;
  }
  const newRelations = relations.map((e, i) => {
    if (detail.selectedOption.value !== ConstructRelationship.Direct) {
      return {
        ...e,
        [field.toLowerCase()]:
          i === index ? newField : e[field.toLowerCase() as keyof typeof e],
      };
    }
    return {
      ...e,
      relationship: i === index ? ConstructRelationship.Direct : e.relationship,
      independent: i === index ? null : e.independent,
    };
  });

  setRelations(newRelations);
};
