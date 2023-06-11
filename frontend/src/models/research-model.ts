import { DSVRowArray } from "d3";

export type Observations = DSVRowArray<string>;

export enum IndicatorType {
  Text = "text",
  Likert = "likert",
}

export enum IndicatorRole {
  Profile = "profile",
  Measure = "measure",
}

export enum ConstructRelationship {
  Direct = "Direct",
  Mediation = "Mediation",
  Moderation = "Moderation",
}

export function copyResearchModel(
  initial: ResearchModel,
  overrides: Partial<ResearchModel>
): ResearchModel {
  return {
    id: initial.id,
    filePath: overrides.filePath ?? initial.filePath,
    indicators: overrides.indicators ?? [...initial.indicators],
    constructs: overrides.constructs ?? [...initial.constructs],
    relations: overrides.relations ?? [...initial.relations],
  };
}

export function createResearchModel(): ResearchModel {
  return {
    id: undefined,
    filePath: "",
    indicators: [],
    constructs: [],
    relations: [],
  };
}

export function createConstructModel(): ConstructModel {
  return {
    id: undefined,
    name: "",
    description: "",
    indicators: [],
  };
}

export function createRelationModel(): RelationModel {
  return {
    id: undefined,
    influencer: undefined,
    relationship: ConstructRelationship.Direct,
    independent: null,
    dependent: undefined,
  };
}

export interface ResearchModel {
  id: number | undefined;
  filePath: string;
  indicators: IndicatorModel[];
  constructs: ConstructModel[];
  relations: RelationModel[];
}

export interface IndicatorModel {
  id: number | undefined;
  order: number;
  visibility: boolean;
  name: string;
  type: IndicatorType;
  role: IndicatorRole;
}

export interface ConstructModel {
  id: number | undefined;
  name: string;
  description: string;
  indicators: IndicatorModel[];
}

export interface RelationModel {
  id: number | undefined;
  influencer: ConstructModel | undefined;
  relationship: ConstructRelationship;
  independent: ConstructModel | null;
  dependent: ConstructModel | undefined;
}
