from enum import Enum
from typing import Annotated, Optional
from sqlalchemy import BLOB, ForeignKey
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from .quantitative import ResearchID
from ..databases.transactional import CreatedAt, UpdatedAt, reg, PrimaryID

LiteratureID = Annotated[int, mapped_column(ForeignKey("literatures.id"))]


class LiteratureType(str, Enum):
    JOURNAL = "journal"
    BOOK = "book"
    NEWS = "news"
    REPORT = "report"
    OTHER = "other"


@reg.mapped_as_dataclass
class Note:
    __tablename__ = "notes"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    literature_id: Mapped[LiteratureID]
    content: Mapped[BLOB] = mapped_column(BLOB)


@reg.mapped_as_dataclass
class Citation:
    __tablename__ = "citations"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    literature_id: Mapped[LiteratureID] = mapped_column(unique=True)
    authors: Mapped[str]
    year: Mapped[int]
    title: Mapped[str]
    access: Mapped[str]
    journal: Mapped[Optional[str]]
    volume: Mapped[Optional[int]]
    issue: Mapped[Optional[int]]
    pages: Mapped[Optional[str]]
    location: Mapped[Optional[str]]
    publisher: Mapped[Optional[str]]


@reg.mapped_as_dataclass
class Literature:
    __tablename__ = "literatures"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    research_id: Mapped[ResearchID]
    created_at: Mapped[CreatedAt]
    updated_at: Mapped[UpdatedAt]
    type: Mapped[LiteratureType]
    note: Mapped["Note"] = relationship(init=False)
    citation: Mapped["Citation"] = relationship(init=False)
