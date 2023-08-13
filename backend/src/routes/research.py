from sqlalchemy import select, insert, update, delete
from flask import Blueprint, jsonify, request

from ..utils.status_code import StatusCode
from ..databases.transactional import init_oltp
from ..models.research import Research

research_bp = Blueprint("research", __name__)


# READ all research names
@research_bp.get("/")
def read_researches():
    db = init_oltp()
    with db.session as session:
        research_select = select(
            Research.id, Research.name, Research.created_at, Research.updated_at
        )
        research_result = session.execute(research_select).mappings().all()
        research_serialized = {"researches": [dict(row) for row in research_result]}
        return jsonify(research_serialized), StatusCode.OK


# READ details of a research
@research_bp.get("/<int:research_id>")
def read_research(research_id):
    db = init_oltp()
    with db.session as session:
        research_select = select(Research)
        research_filter = research_select.where(Research.id == research_id)
        research_result = session.execute(research_filter).scalar()
        return jsonify(research_result), StatusCode.OK


# CREATE a research
@research_bp.post("/")
def create_research():
    request_body = request.get_json()
    name = request_body["name"]

    db = init_oltp()
    with db.session as session:
        research_insert = insert(Research).values(name=name)
        session.execute(research_insert)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE properties of a research
@research_bp.put("/<int:research_id>")
def update_research(research_id):
    request_body = request.get_json()
    name = request_body["name"]

    db = init_oltp()
    with db.session as session:
        research_update = (
            update(Research).where(Research.id == research_id).values(name=name)
        )
        session.execute(research_update)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE a research
@research_bp.delete("/<int:research_id>")
def delete_research(research_id):
    db = init_oltp()
    with db.session as session:
        research_delete = delete(Research).where(Research.id == research_id)
        session.execute(research_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT
