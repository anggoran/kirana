from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)
from ..databases.transactional import CreatedAt, UpdatedAt, reg, PrimaryID
from .literature import Literature
from .quantitative import Quantitative


@reg.mapped_as_dataclass
class Research:
    __tablename__ = "researches"
    id: Mapped[PrimaryID] = mapped_column(init=False)
    created_at: Mapped[CreatedAt]
    updated_at: Mapped[UpdatedAt]
    name: Mapped[str]
    literatures: Mapped[list["Literature"]] = relationship(init=False)
    quantitatives: Mapped[list["Quantitative"]] = relationship(init=False)
