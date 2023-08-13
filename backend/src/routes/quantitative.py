from flask import Blueprint, jsonify, request
from sqlalchemy import delete, insert, select, update

from ..utils.status_code import StatusCode
from ..databases.transactional import init_oltp
from ..databases.analytical import init_olap
from ..models.quantitative import Analysis, Construct, Indicator, Quantitative, Relation

quantitative_bp = Blueprint("quantitative", __name__)


# READ all quantitative names
@quantitative_bp.get("/")
def read_quantitatives():
    db = init_oltp()
    with db.session as session:
        quantitative_select = select(Quantitative.id, Quantitative.name)
        quantitative_result = session.execute(quantitative_select).mappings().all()
        quantitative_serialized = {
            "quantitatives": [dict(row) for row in quantitative_result]
        }
        return jsonify(quantitative_serialized), StatusCode.OK


# READ details of a quantitative
@quantitative_bp.get("/<int:quantitative_id>")
def read_quantitative(quantitative_id):
    db = init_oltp()
    with db.session as session:
        quantitative_select = select(Quantitative)
        quantitative_filter = quantitative_select.where(
            Quantitative.id == quantitative_id
        )
        quantitative_result = session.execute(quantitative_filter).scalar()
        return jsonify(quantitative_result), StatusCode.OK


# CREATE a quantitative
@quantitative_bp.post("/")
def create_quantitative():
    request_body = request.get_json()

    db = init_oltp()
    with db.session as session:
        research_id = request_body["research_id"]

        quantitative_insert = (
            insert(Quantitative)
            .values(research_id=research_id, name=request_body["name"])
            .returning(Quantitative.id)
        )
        quantitative_id = session.execute(quantitative_insert).scalar()

        constructs = []
        for e in request_body["constructs"]:
            construct_object = dict(
                quantitative_id=quantitative_id,
                name=e["name"],
                description=e["description"],
            )
            constructs.append(construct_object)
        construct_insert = (
            insert(Construct).values(constructs).returning(Construct.id, Construct.name)
        )
        construct_results = session.execute(construct_insert).all()
        construct_map = dict((name, id) for id, name in construct_results)

        operationalization = {}
        for e in request_body["constructs"]:
            construct_id = construct_map[e["name"]]
            operationalization[construct_id] = [
                indicator["alias"] for indicator in e["indicators"]
            ]

        indicators = []
        for e in request_body["indicators"]:
            construct_id = None
            for key, value in operationalization.items():
                if e["alias"] in value:
                    construct_id = key
            indicator_object = dict(
                quantitative_id=quantitative_id,
                order=e["order"],
                visibility=e["visibility"],
                origin=e["origin"],
                alias=e["alias"],
                type=e["type"],
                role=e["role"],
                construct_id=construct_id,
            )
            indicators.append(indicator_object)
        indicator_insert = insert(Indicator).values(indicators)
        session.execute(indicator_insert)

        relations = []
        for e in request_body["relations"]:
            influencer_id = None
            independent_id = None
            dependent_id = None
            for key, value in construct_map.items():
                if e["influencer"]["name"] == key:
                    influencer_id = value
                if e["independent"] is not None and e["independent"]["name"] == key:
                    independent_id = value
                if e["dependent"]["name"] == key:
                    dependent_id = value
            relation_object = dict(
                quantitative_id=quantitative_id,
                type=e["type"],
                influencer_construct_id=influencer_id,
                independent_construct_id=independent_id,
                dependent_construct_id=dependent_id,
            )
            relations.append(relation_object)
        relation_insert = insert(Relation).values(relations)
        session.execute(relation_insert)

        session.commit()
        return "", StatusCode.NO_CONTENT


# UPDATE properties of a quantitative
@quantitative_bp.put("/<int:quantitative_id>")
def update_quantitative(quantitative_id):
    values = request.get_json()
    db = init_oltp()
    with db.session as session:
        quantitative_update = (
            update(Quantitative)
            .where(Quantitative.id == quantitative_id)
            .values(values)
        )
        session.execute(quantitative_update)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE a quantitative
@quantitative_bp.delete("/<int:quantitative_id>")
def delete_quantitative(quantitative_id):
    db = init_oltp()
    with db.session as session:
        quantitative_delete = delete(Quantitative).where(
            Quantitative.id == quantitative_id
        )
        session.execute(quantitative_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# READ a paginated observation
@quantitative_bp.get("/<int:quantitative_id>/observation")
def read_observation():
    # [TODO] to be implemented after frontend is ready
    # pagination = request.args.get("page")
    with init_olap() as connection:
        data = connection.sql("SELECT * FROM observation;")
        print(data)
        return {"message": "OK"}, 200


# UPSERT properties of an observation
@quantitative_bp.patch("/<int:quantitative_id>/observation")
def create_observation():
    # [TODO] to be implemented after frontend is ready
    with init_olap() as connection:
        csv_path = "static/observation.csv.gz"
        connection.sql(
            f"""CREATE OR REPLACE TABLE observation AS SELECT * 
            FROM read_csv_auto('{csv_path}');"""
        )
        return {"message": "OK"}, 201


# RUN an analysis
@quantitative_bp.patch("/<int:quantitative_id>/analysis/<int:analysis_id>")
def run_analysis():
    # [TODO] to be implemented after frontend is ready
    pass


# CREATE an analysis
@quantitative_bp.post("/<int:quantitative_id>/analysis")
def create_analysis(quantitative_id):
    values = request.get_json()
    values["quantitative_id"] = quantitative_id

    db = init_oltp()
    with db.session as session:
        analysis_insert = insert(Analysis).values(values)
        session.execute(analysis_insert)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE an analysis
@quantitative_bp.put("/<int:quantitative_id>/analysis/<int:analysis_id>")
def update_analysis(quantitative_id, analysis_id):
    values = request.get_json()

    db = init_oltp()
    with db.session as session:
        analysis_update = (
            update(Analysis)
            .where(Analysis.quantitative_id == quantitative_id)
            .values(values)
        )
        session.execute(analysis_update)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE an analysis
@quantitative_bp.delete("/<int:quantitative_id>/analysis/<int:analysis_id>")
def delete_analysis(quantitative_id, analysis_id):
    db = init_oltp()
    with db.session as session:
        analysis_delete = delete(Analysis).where(Analysis.id == analysis_id)
        session.execute(analysis_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# CREATE bulk of relations
@quantitative_bp.post("/<int:quantitative_id>/relation")
def create_relations(quantitative_id):
    request_body = request.get_json()
    values = request_body["relations"]

    db = init_oltp()
    with db.session as session:
        relations_insert = insert(Relation).values(values)
        session.execute(relations_insert)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE bulk of relations
@quantitative_bp.put("/<int:quantitative_id>/relation")
def update_relations(quantitative_id):
    request_body = request.get_json()
    values = request_body["relations"]

    db = init_oltp()
    with db.session as session:
        relations_update = update(Relation)
        session.execute(relations_update, values)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE bulk of relations
@quantitative_bp.delete("/<int:quantitative_id>/relation")
def delete_relations(quantitative_id):
    request_body = request.get_json()
    values = request_body["relation_ids"]

    db = init_oltp()
    with db.session as session:
        relations_delete = delete(Relation).where(Relation.id.in_(values))
        session.execute(relations_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# CREATE bulk of constructs
@quantitative_bp.post("/<int:quantitative_id>/construct")
def create_constructs(quantitative_id):
    request_body = request.get_json()
    values = request_body["constructs"]

    db = init_oltp()
    with db.session as session:
        constructs_insert = insert(Construct).values(values)
        session.execute(constructs_insert)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE bulk of constructs
@quantitative_bp.put("/<int:quantitative_id>/construct")
def update_constructs(quantitative_id):
    request_body = request.get_json()
    values = request_body["constructs"]

    db = init_oltp()
    with db.session as session:
        constructs_update = update(Construct)
        session.execute(constructs_update, values)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE bulk of constructs
@quantitative_bp.delete("/<int:quantitative_id>/construct")
def delete_constructs(quantitative_id):
    request_body = request.get_json()
    values = request_body["construct_ids"]

    db = init_oltp()
    with db.session as session:
        constructs_delete = delete(Construct).where(Construct.id.in_(values))
        session.execute(constructs_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# UPDATE bulk of indicators
@quantitative_bp.put("/<int:quantitative_id>/indicator")
def update_indicators(quantitative_id):
    request_body = request.get_json()
    values = request_body["indicators"]

    db = init_oltp()
    with db.session as session:
        indicators_update = update(Indicator)
        session.execute(indicators_update, values)
        session.commit()
        return "", StatusCode.NO_CONTENT
