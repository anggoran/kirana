from sqlalchemy import select, insert, update, delete, func
from sqlalchemy.dialects.sqlite import insert as sqlite_upsert
from flask import Blueprint, jsonify, request

from ..utils.binary_convert import binary_decode, binary_encode
from ..models.literature import Citation, Literature, Note
from ..utils.status_code import StatusCode
from ..databases.transactional import init_oltp

literature_bp = Blueprint("literature", __name__)


# COUNT literatures
@literature_bp.get("/")
def count_literatures():
    db = init_oltp()
    with db.session as session:
        literature_count = func.count(Literature.id)
        literature_result = session.execute(literature_count).scalar()
        return jsonify(literature_result), StatusCode.OK


# READ details of a literature
@literature_bp.get("/<int:literature_id>")
def read_literature(literature_id):
    db = init_oltp()
    with db.session as session:
        literature_select = select(Literature)
        literature_filter = literature_select.where(Literature.id == literature_id)
        literature_result = session.execute(literature_filter).scalar()
        return jsonify(literature_result), StatusCode.OK


# CREATE a literature
@literature_bp.post("/")
def create_literature():
    request_body = request.get_json()
    research_id = request_body["research_id"]
    type = request_body["type"]

    db = init_oltp()
    with db.session as session:
        literature_insert = insert(Literature).values(
            research_id=research_id, type=type
        )
        session.execute(literature_insert)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE properties of a literature
@literature_bp.put("/<int:literature_id>")
def update_literature(literature_id):
    request_body = request.get_json()
    type = request_body["type"]

    db = init_oltp()
    with db.session as session:
        literature_update = (
            update(Literature).where(Literature.id == literature_id).values(type=type)
        )
        session.execute(literature_update)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE a literature
@literature_bp.delete("/<int:literature_id>")
def delete_literature(literature_id):
    db = init_oltp()
    with db.session as session:
        literature_delete = delete(Literature).where(Literature.id == literature_id)
        session.execute(literature_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# READ content of a note
@literature_bp.get("/<int:literature_id>/note")
def read_note(literature_id):
    db = init_oltp()
    with db.session as session:
        note_select = select(Note)
        note_filter = note_select.where(Note.literature_id == literature_id)
        note_result = session.execute(note_filter).scalar()
        return binary_decode(note_result.content), StatusCode.OK


# UPSERT properties of a note
@literature_bp.patch("/<int:literature_id>/note")
def upsert_note(literature_id):
    request_body = request.get_json()
    content = binary_encode(request_body["content"])
    values = dict(literature_id=literature_id, content=content)

    db = init_oltp()
    with db.session as session:
        note_upsert = (
            sqlite_upsert(Note)
            .values(**values)
            .on_conflict_do_update(
                index_elements=[Note.literature_id],
                set_=dict(values),
            )
        )
        session.execute(note_upsert)
        session.commit()
        return "", StatusCode.NO_CONTENT


# READ details of a citation
@literature_bp.get("/<int:literature_id>/citation")
def read_citation(literature_id):
    db = init_oltp()
    with db.session as session:
        citation_select = select(Citation)
        citation_filter = citation_select.where(Citation.literature_id == literature_id)
        citation_result = session.execute(citation_filter).scalar()
        return jsonify(citation_result), StatusCode.OK


# UPSERT properties of a citation
@literature_bp.patch("/<int:literature_id>/citation")
def upsert_citation(literature_id):
    values = request.get_json()
    values["literature_id"] = literature_id

    db = init_oltp()
    with db.session as session:
        citation_upsert = (
            sqlite_upsert(Citation)
            .values(**values)
            .on_conflict_do_update(
                index_elements=[Citation.literature_id],
                set_=values,
            )
        )
        session.execute(citation_upsert)
        session.commit()
        return "", StatusCode.NO_CONTENT
