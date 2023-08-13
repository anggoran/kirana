from enum import Enum
from typing import Annotated, Optional
from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..databases.transactional import CreatedAt, UpdatedAt, reg, PrimaryID

ResearchID = Annotated[int, mapped_column(ForeignKey("researches.id"))]
ConstructID = Annotated[int, mapped_column(ForeignKey("constructs.id"))]
QuantitativeID = Annotated[int, mapped_column(ForeignKey("quantitatives.id"))]


def get_observation_code(context):
    current_params = context.get_current_parameters()
    modified_name = (
        str(current_params["name"]).lower().replace(" ", "_").replace("-", "_")
    )
    return str(current_params["research_id"]) + "_" + modified_name


class IndicatorType(str, Enum):
    TEXT = "text"
    LIKERT = "likert"


class IndicatorRole(str, Enum):
    PROFILE = "profile"
    MEASURE = "measure"


class RelationType(str, Enum):
    DIRECT = "direct"
    MEDIATION = "mediation"
    MODERATION = "moderation"


class AnalysisType(str, Enum):
    DESCRIPTIVE = "descriptive statistics"


@reg.mapped_as_dataclass
class Indicator:
    __tablename__ = "indicators"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    quantitative_id: Mapped[QuantitativeID]
    construct_id: Mapped[Optional[ConstructID]]
    order: Mapped[int]
    visibility: Mapped[bool]
    origin: Mapped[str]
    alias: Mapped[str]
    type: Mapped[IndicatorType]
    role: Mapped[IndicatorRole]


@reg.mapped_as_dataclass
class Construct:
    __tablename__ = "constructs"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    quantitative_id: Mapped[QuantitativeID]
    name: Mapped[str]
    description: Mapped[str]
    indicators: Mapped[list["Indicator"]] = relationship(init=False)


@reg.mapped_as_dataclass
class Relation:
    __tablename__ = "relations"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    quantitative_id: Mapped[QuantitativeID]
    type: Mapped[RelationType]
    influencer_construct_id: Mapped[ConstructID]
    independent_construct_id: Mapped[Optional[ConstructID]]
    dependent_construct_id: Mapped[ConstructID]
    influencer_construct: Mapped[Construct] = relationship(
        init=False, foreign_keys="Relation.influencer_construct_id"
    )
    independent_construct: Mapped[Optional[Construct]] = relationship(
        init=False, foreign_keys="Relation.independent_construct_id"
    )
    dependent_construct: Mapped[Construct] = relationship(
        init=False, foreign_keys="Relation.dependent_construct_id"
    )


@reg.mapped_as_dataclass
class Analysis:
    __tablename__ = "analyses"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    quantitative_id: Mapped[QuantitativeID]
    name: Mapped[str]
    type: Mapped[AnalysisType]
    result: Mapped[Optional[JSON]] = mapped_column(JSON)


@reg.mapped_as_dataclass
class Quantitative:
    __tablename__ = "quantitatives"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    research_id: Mapped[ResearchID]
    created_at: Mapped[CreatedAt]
    updated_at: Mapped[UpdatedAt]
    name: Mapped[str]
    observation_code: Mapped[str] = mapped_column(
        insert_default=get_observation_code, onupdate=get_observation_code
    )
    indicators: Mapped[list["Indicator"]] = relationship(init=False)
    constructs: Mapped[list["Construct"]] = relationship(init=False)
    relations: Mapped[list["Relation"]] = relationship(init=False)
    analyses: Mapped[list["Analysis"]] = relationship(init=False)
