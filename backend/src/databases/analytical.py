from contextlib import contextmanager
from flask import current_app
from duckdb import connect


@contextmanager
def init_olap():
    connection = connect(current_app.config["ANALYTICAL_DB"])
    try:
        yield connection
    finally:
        connection.close()
