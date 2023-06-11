from flask import Flask, jsonify, make_response, request
import pandas as pd

app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello():
    response = {"message": "Hello, World!"}
    return jsonify(response), 200


@app.route("/upload-csv", methods=["POST"])
def upload_csv():
    file = request.files["file"]

    if file and file.filename.endswith(".csv"):
        file.save(file.filename)
        df = pd.read_csv(file.filename)
        return df.to_json(orient="records"), 201

    return jsonify({"status": "error", "message": "Please upload a CSV file."}), 400


@app.after_request
def after_request(response):
    response = make_response(response)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Content-Type"] = "application/json"
    return response


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
