from dataclasses import dataclass
from datetime import datetime
from flask import current_app
from typing import Annotated
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker, mapped_column, registry


reg = registry()
PrimaryID = Annotated[int, mapped_column(primary_key=True, autoincrement=True)]
CreatedAt = Annotated[
    str,
    mapped_column(
        insert_default=lambda: current_timestamp(),
    ),
]
UpdatedAt = Annotated[
    str,
    mapped_column(
        insert_default=lambda: current_timestamp(),
        onupdate=lambda: current_timestamp(),
    ),
]


@dataclass
class TransactionalDB:
    engine: Engine | None
    session: Session | None


def init_oltp():
    engine = create_engine(current_app.config["TRANSACTIONAL_DB"])
    Session = sessionmaker(engine)
    return TransactionalDB(engine=engine, session=Session())


def current_timestamp():
    return datetime.now().astimezone().isoformat()
